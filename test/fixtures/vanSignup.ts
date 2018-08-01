import {SignupAttributes} from "../../src/db/models/signup"
import {ShiftAttributes} from "../../src/db/models/shift"
import {VanSignupStatus} from "../../src/types/VanSignup"
import {VanEvent} from "../../src/types/VanEvent"
import {PersonAttributes} from "../../src/db/models/person"
import {personAttrs} from "./vanPerson"
import {eventAttrs} from "./vanEvent"
import {shiftAttrs} from "./vanShift"
import {locationAttrs} from "./vanLocation"

export const signupAttrs: SignupAttributes = {
  id: 1,
  vanId: 1,
  archived: "2018-07-25T16:00:00-00:00",
  createdAt: "2018-07-25T16:00:00-00:00",
  updatedAt: "2018-07-25T16:00:00-00:00",
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
  role: {
    roleId: 198854,
    name: "Canvasser",
  }, // JSON
  person: personAttrs, // assoc
  event: eventAttrs, // assoc
  shift: shiftAttrs, // assoc
  location: locationAttrs[0],
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
