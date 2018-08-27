import {lowerFirst, reduce} from "lodash"
import {Attributes} from "../types/Attributes"
import {values} from "lodash"
import {VanEvent} from "../types/VanEvent"
import {VanSignup, VanSignupStatus} from "../types/VanSignup"
import config from "../../config/index"
const {vanRsvp} = config

export const parseVanEvents = (akes: ActionKitEvent[]): VanEvent[] =>
  akes.map(parseVanEvent)

const parseVanEvent = (ake: ActionKitEvent): VanEvent => {
  return {
    actionKitId: ake.id,
    name: ake.title.slice(0, 499),
    shortName: `AKID: ${ake.id}`.slice(0, 11),
    description: ake.public_description.slice(0, 999).replace(/[\<\>&#"]+/g, ""),
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
    roles: parseVanRoles(ake.campaign),
    locations: [{
      name: ake.venue.slice(0, 49),
      address: parseVanAddress(ake, "Custom"),
    }],
    signups: ake.signups.map(signup => parseVanSignup(signup, ake.campaign)),
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

const parseVanSignup = (aks: ActionKitSignup, campaign: string): VanSignup => ({
  actionKitId: aks.id,
  status: parseVanSignupStatus(aks),
  role: lowerFirst(aks.role) === "host"
      ? vanRsvp.actionKit.whitelistMapping[campaign].roles.host
      : vanRsvp.actionKit.whitelistMapping[campaign].roles.attendee,
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
  } else {
    return vanRsvp.van.statuses.scheduled
  }
}

const parseVanPerson = (akp: ActionKitPerson): VanPerson => ({
  actionKitId: akp.id,
  salutation: akp.prefix,
  firstName: akp.first_name.slice(0, 19),
  middleName: akp.middle_name.slice(0, 19),
  lastName: akp.last_name.slice(0, 24),
  suffix: akp.suffix.slice(0, 49),
  addresses: [parseVanAddress(akp, "Home")],
  emails: [{ email: akp.email, type: "P" }],
  phones: parseVanPhones(akp.phones),
})

const parseVanPhones = (akphs: ActionKitPhone[]): VanPhone[] => {
  return akphs
    .filter(phone => typeof phone !== "undefined")
    .filter(phone => RegExp(/^1?[2-9][0-8]\d[2-9]\d{6,6}$/g).test(phone.normalized_phone))
    .map(parseVanPhone)
}

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
  return vanRsvp.actionKit.whitelistMapping[campaign].eventType
}

const parseVanRoles = (campaign: string) => {
  return [
    vanRsvp.actionKit.whitelistMapping[campaign].roles.host,
    vanRsvp.actionKit.whitelistMapping[campaign].roles.attendee,
  ]
}