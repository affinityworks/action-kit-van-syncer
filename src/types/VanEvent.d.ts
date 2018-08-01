import {VanSignup} from "./VanSignup"

declare interface VanEvent {
/////////////////////// TODO: extract --v
  actionKitId: number,
  vanId?: number,
  id?: number,
  ////////////////////
  eventId?: number,
  name: string,
  shortName: string,
  description: string,
  startDate: Date | string,
  endDate: Date | string,
  eventType: object,
  isOnlyEditableByCreatingUser?: boolean,
  isPubliclyViewable?: boolean,
  codes: object[], // need VanCode
  notes: object[], // need VanNote ?
  // districtFieldValue?: string,
  // voterRegistrationBatches?: object[],
  createdDate: Date | string,
  roles?: VanRole[],
  locations?: VanLocation[],
  shifts: VanShift[],
  signups?: VanSignup[],
}
