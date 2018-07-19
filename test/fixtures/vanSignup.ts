import {SignupAttributes} from "../../src/db/models/signup"
import {ShiftAttributes} from "../../src/db/models/shift"
import {VanSignupStatus} from "../../src/types/VanSignup"
import {VanEvent} from "../../src/types/VanEvent"
import {PersonAttributes} from "../../src/db/models/person"
import {personAttrs} from "./vanPerson"
import {eventAttrs, locationAttrs} from "./vanEvent"
import {shiftAttrs} from "./vanShift"

export const signupAttrs: SignupAttributes = {
  id: 1,
  vanId: 1,
  archived: "test",
  createdAt: "test",
  updatedAt: "test",
  personId: 1,
  eventId: 1,
  vanEventId: 1,
  shiftId: 1,
  vanShiftId: 1,
  roleId: 1,
  vanRoleId: 1,
  locationId: 1,
  actionKitId: 1,
  eventSignupId: 1,
  status: { statusId: 4,  name: "Invited"   }, // JSON
  role: { roleId: 2,  name: "Attendee"}, // JSON
  person: personAttrs, // assoc
  event: eventAttrs, // assoc
  shift: shiftAttrs, // assoc
  location: locationAttrs,
}

export const signupUpdate: VanSignupUpdateRequest = {
  event: {
    eventId: signupAttrs.eventId,
  },
  location: {
    locationId: signupAttrs.locationId,
  },
  person: {
    vanId: signupAttrs.personId,
  },
  role: {
    roleId: signupAttrs.vanRoleId,
  },
  shift: {
    eventShiftId: signupAttrs.shiftId,
  },
  status: {
    statusId: signupAttrs.status.statusId,
  },
  vanId: 1,
}
