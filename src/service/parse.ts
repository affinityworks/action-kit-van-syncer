import {lowerFirst, reduce} from "lodash"
import {Attributes} from "../types/Attributes"
import {values} from "lodash"
import {VanEvent} from "../types/VanEvent"
import {VanSignup, VanSignupStatus} from "../types/VanSignup"
import config from "../../config/index"
const {vanRsvp} = config

// TODO: fill these in with actual ids once we find or create them
export const roles: { [key: string]: VanRole } = {
  HOST: { roleId: 198856, name: "Host" },
  ATTENDEE: { roleId: 198854, name: "Canvasser" },
}

export const parseVanEvents = (akes: ActionKitEvent[]): VanEvent[] =>
  akes.map(parseVanEvent)

const parseVanEvent = (ake: ActionKitEvent): VanEvent => {
  return {
    actionKitId: ake.id,
    name: ake.title,
    shortName: `AKID: ${ake.id}`,
    description: ake.public_description,
    startDate: `${ake.starts_at_utc}-00:00`,
    endDate: `${ake.ends_at_utc || setEndTime(ake.starts_at_utc)}-00:00`,
    eventType: parseVanEventType(ake.campaign),
    codes: [],
    notes: [],
    createdDate: ake.created_at,
    shifts: [{
      name: "FULL SHIFT",
      startTime: `${ake.starts_at_utc}-00:00`,
      endTime: `${ake.ends_at_utc || setEndTime(ake.starts_at_utc)}-00:00`,
    }],
    roles: values(roles),
    locations: [{
      name: ake.venue,
      address: parseVanAddress(ake, "Custom"),
    }],
    signups: ake.signups.map(parseVanSignup),
  }
}

const parseVanAddress = (akx: ActionKitEvent | ActionKitPerson, type: VanAddressType): VanAddress => ({
  addressLine1: akx.address1,
  addressLine2: akx.address2,
  city: akx.city,
  stateOrProvince: akx.state,
  zipOrPostalCode: akx.zip + (akx.plus4 && `-${akx.plus4}`),
  countryCode: "US",
  type,
})

const parseVanSignup = (aks: ActionKitSignup): VanSignup => ({
  actionKitId: aks.id,
  status: parseVanSignupStatus(aks),
  role: lowerFirst(aks.role) === "host" ? roles.HOST : roles.ATTENDEE,
  person: parseVanPerson(aks.user),
})

/*
signup + attended false + active -> Scheduled

signup + attended true + complete -> Confirmed

signup + attended false + complete -> No Show
 */
const parseVanSignupStatus = (aks: ActionKitSignup): VanSignupStatus => {
  if (aks && !aks.attended && aks.status === "active") {
    return vanRsvp.van.statuses.scheduled
  } else if (aks && aks.attended && aks.status === "complete") {
    return vanRsvp.van.statuses.confirmed
  } else if (aks && !aks.attended && aks.status === "complete") {
    return vanRsvp.van.statuses.noshow
  }
}

const parseVanPerson = (akp: ActionKitPerson): VanPerson => ({
  actionKitId: akp.id,
  salutation: akp.prefix,
  firstName: akp.first_name,
  middleName: akp.middle_name,
  lastName: akp.last_name,
  suffix: akp.suffix,
  addresses: [parseVanAddress(akp, "Home")],
  emails: [{ email: akp.email, type: "P" }],
  phones: parseVanPhones(akp.phones),
})

const parseVanPhones = (akphs: ActionKitPhone[]): VanPhone[] =>
  akphs.filter(phone => typeof phone !== "undefined").map(parseVanPhone)

const parseVanPhone = (akph: ActionKitPhone): VanPhone => {
  return {
    actionKitId: akph.id,
    phoneNumber: akph.normalized_phone,
    phoneType: {
      home: "H",
      work: "W",
      mobile: "M",
      home_fax: "F",
      mobile_fax: "F",
    }[akph.type] || "M",
  }
}

export const parseDate = (timestamp: Date|string): Date =>
  new Date(Date.parse(timestamp.toString()))

export const parseDatesIn = (obj: Attributes): Attributes =>
  reduce(obj, (acc, v, k) => ({
    ...acc,
    [k]: isDateField(k) ? parseDate(v as string) : v,
  }), {} as Attributes)

const isDateField = (k: string): boolean =>
  k.includes("Date") || k.includes("Time")

const setEndTime = (timestamp: Date|string): Date => {
  const date = parseDate(timestamp)
  date.setHours(date.getHours() + 1)
  return date
}

const parseVanEventType = (campaign: string): object => {
  return vanRsvp.actionKit.whitelistMapping[campaign]
}
