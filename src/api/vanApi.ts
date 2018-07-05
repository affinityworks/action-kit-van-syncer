import {EventAttributes} from "../db/models/event"
import {SignupAttributes} from "../db/models/signup"

// TODO (aguestuser): consider moving these to `/types` dir
export interface VanEventCreateResponse { eventId: number }
export interface VanSignupCreateResponse { eventSignupId: number }

export const createEvent = (attrs: EventAttributes): Promise<VanEventCreateResponse> =>
  Promise.resolve({ eventId: Math.random() * 100000000 })

export const createSignup = (attrs: SignupAttributes): Promise<VanSignupCreateResponse> =>
  Promise.resolve({ eventSignupId: Math.random() * 100000000 })
