import {EventAttributes, EventInstance} from "../db/models/event"
import {LocationAttributes} from "../db/models/location"
import {PersonAttributes} from "../db/models/person"
import {ShiftAttributes} from "../db/models/shift"
import {VanEvent} from "./VanEvent"

declare interface VanSignup {
  /////////////////////// TODO: extract --v
  actionKitId: number,
  id?: number,
  ////////////////////
  eventSignupId?: number,
  status: VanSignupStatus, // JSON
  role: VanRole, // JSON
  person: VanPerson | PersonAttributes, // assoc
  event?: VanEvent | EventAttributes, // assoc
  shift?: VanShift | ShiftAttributes, // assoc
  location?: VanLocation | LocationAttributes, // assoc
}

declare type VanSignupStatus =
  { statusId: 4,  name: "Invited"   } |
  { statusId: 1,  name: "Scheduled" } |
  { statusId: 3,  name: "Declined"  } |
  { statusId: 11, name: "Confirmed" } |
  { statusId: 2,  name: "Completed" } |
  { statusId: 15, name: "Walk In"   }

//
// declare type VanSignupStatusString =
//   "Invited" |
//   "Scheduled" |
//   "Declined" |
//   "Confirmed" |
//   "Completed" |
//   "Walk In"

// OMITED FIELDS (in VAN API, but not our data model):
// startTimeOverride?: Date | string,
// endTimeOverride?: Date | string,
// printedLists?: object[],
// minivanExports?: object[],
