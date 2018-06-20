import {lowerFirst} from "lodash"

export const parseVanEvents = (akes: ActionKitEvent[]): VanEvent[] =>
  akes.map(parseVanEvent)

export const parseVanEvent = (ake: ActionKitEvent): VanEvent => ({
  actionKitId: ake.id,
  name: ake.title,
  description: ake.public_description,
  startDate: `${ake.starts_at_utc}-00:00`,
  endDate: `${ake.ends_at_utc}-00:00`,
  eventType: {}, // TODO: is this right?
  codes: [{}], // TODO: ditto
  notes: [{}], // TODO: ditto
  voterRegistrationBatches: [{}], // TODO: ditto
  createdDate: ake.created_at,
  shifts: [{
    name: "FULL SHIFT",
    startTime: `${ake.starts_at_utc}-00:00`, // TODO: just time?
    endTime: `${ake.ends_at_utc}-00:00`, // TODO: ditto
  }],
  roles: [{
    name: "Host",
    isEventLead: true,
  }, {
    name: "Attendee",
    isEventLead: false,
    max: ake.max_attendees,
  }],
  locations: [{
    name: ake.venue,
    address: parseVanAddress(ake, "Custom"),
  }],
  signups: ake.signups.map(parseVanSignup),
})

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
  status: parseVanSignupStatus(aks.status),
  role: { name: lowerFirst(aks.role) === "host" ? "Host" : "Attendee" },
  person: parseVanPerson(aks.user),
})

const parseVanSignupStatus = (akss: ActionKitSignupStatus): VanSignupStatus => {
  switch (akss) {
    case "active":
      return { statusId: 4, name: "Invited"  }
    case "cancelled":
      return { statusId: 3, name: "Declined" }
    case "deleted":
      return { statusId: 2, name: "Completed"}
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
  phones: [],
})
