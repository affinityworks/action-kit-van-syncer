import {EventAttributes} from "../db/models/event"
import {LocationAttributes} from "../db/models/location"
import {PersonAttributes} from "../db/models/person"
import {ShiftAttributes} from "../db/models/shift"

// TODO (aguestuser): consider moving these to `/types` dir
export type VanApiResponse =
  VanEventCreateResponse |
  VanLocationCreateResponse |
  VanPersonCreateResponse |
  VanShiftCreateResponse |
  VanSignupCreateResponse

export interface VanEventCreateResponse { eventId: number }
export interface VanLocationCreateResponse { locationId: number }
export interface VanPersonCreateResponse { vanId: number }
export interface VanShiftCreateResponse { eventShiftId: number }
export interface VanSignupCreateResponse { eventSignupId: number }

export const createEvent = (attrs: EventAttributes): Promise<VanEventCreateResponse> =>
  Promise.resolve({ eventId: Math.random() * 100000000 })

export const createLocation = (attrs: LocationAttributes): Promise<VanLocationCreateResponse> =>
  Promise.resolve({ locationId: Math.random() * 100000000 })

export const createPerson = (attrs: PersonAttributes): Promise<VanPersonCreateResponse> =>
  Promise.resolve({ vanId: Math.random() * 100000000 })

export const createShift = (attrs: ShiftAttributes): Promise<VanShiftCreateResponse> =>
  Promise.resolve({ eventShiftId: Math.random() * 100000000 })

export const createSignup = (attrs: VanSignupCreateRequest): Promise<VanSignupCreateResponse> =>
  Promise.resolve({ eventSignupId: Math.random() * 100000000 })
