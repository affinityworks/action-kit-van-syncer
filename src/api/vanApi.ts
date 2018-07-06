import axios from "axios"
import {EventAttributes} from "../db/models/event"
import {LocationAttributes} from "../db/models/location"
import {PersonAttributes} from "../db/models/person"
import {ShiftAttributes} from "../db/models/shift"
import config from "../../config/"
import * as _ from "lodash"
const {secrets} = config

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

const api = () => {
  return axios.create({
    baseURL: secrets.vanAPI.baseUrl,
    auth: {
      username: secrets.vanAPI.applicationName,
      password: secrets.vanAPI.apiKey,
    },
  })
}

export const createEvent = async (attrs: EventAttributes): Promise<VanEventCreateResponse> => {
  const eventId = await createResource("/events", attrs)
  return { eventId }
}

export const createLocation = async (attrs: LocationAttributes): Promise<VanLocationCreateResponse> => {
  const locationId = await createResource("/locations/findOrCreate", attrs)
  return { locationId }
}

export const createPerson = async (attrs: PersonAttributes): Promise<VanPersonCreateResponse> => {
  const vanId = await createResource("/people/findOrCreate", attrs)
  return { vanId }
}

export const createShift = async (attrs: ShiftAttributes): Promise<VanShiftCreateResponse> => {
  const eventShiftId = await createResource(`/events/${attrs.eventId}/shifts`, attrs)
  return { eventShiftId }
}

export const createSignup = async (attrs: VanSignupCreateRequest): Promise<VanSignupCreateResponse> => {
  const eventSignupId = await createResource("/signups", attrs)
  return { eventSignupId }
}

const createResource = async (resourceEndpoint, attrs) => {
  const response = await api().post(resourceEndpoint, attrs)
  return _.get(response, ["data"])
}
