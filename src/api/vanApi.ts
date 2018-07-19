import axios from "axios"
import {EventAttributes} from "../db/models/event"
import {LocationAttributes} from "../db/models/location"
import {PersonAttributes} from "../db/models/person"
import {ShiftAttributes} from "../db/models/shift"
import config from "../../config/"
import {get} from "lodash"
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

// CREATE RESOURCES

export const createEvent = async (attrs: EventAttributes): Promise<VanEventCreateResponse> => {
  const eventId = await createResource("/events", attrs)
  return { eventId }
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

const createResource = async (resourceEndpoint, attrs): Promise<number> => {
  const response = await api().post(resourceEndpoint, attrs)
  return get(response, ["data"])
}

// UPDATE RESOURCES

export const updateEvent = async (attrs: EventAttributes) => {
  await updateResource(`/events/${attrs.vanId}`, attrs, api().put)
}

export const updatePerson = async (attrs: PersonAttributes) => {
  await updateResource(`/people/${attrs.vanId}`, attrs, api().post)
}

export const updateSignup = async (attrs: VanSignupUpdateRequest) => {
  await updateResource(`/signups/${attrs.vanId}`, attrs, api().put)
}

const updateResource = async (resourceEndpoint, attrs, httpMethod) => {
  await httpMethod(resourceEndpoint, attrs)
}
