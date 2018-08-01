import axios from "axios"
import * as _ from "lodash"
import {Subject} from "rxjs/Subject"
import config from "../../config/"
const {secrets} = config

export const actionKitSubject = new Subject()
const limit = 100

const api = () => {
  return axios.create({
    baseURL: secrets.actionKitAPI.baseUrl,
    auth: {
      username: secrets.actionKitAPI.username,
      password: secrets.actionKitAPI.password,
    },
  })
}

const getResource = async (resourceUrl: string) => {
  try {
    const response = await api().get(resourceUrl)
    return _.get(response, ["data"])
  } catch (error) {
    console.error("CAUGHT ERROR: ", error)
  }
}

export const getResources = async (resourceUrl: string, offset: number = 0, resources = []) => {
  try {
    const paginationParams = `_limit=${limit}&_offset=${offset}`
    const paramsAppender = resourceUrl.includes("?") ? "&" : "?"
    const endpoint = `${resourceUrl}${paramsAppender}${paginationParams}`

    const response = await api().get(endpoint)
    const nextUrl = _.get(response, ["data", "meta", "next"])
    const nextResources = _.get(response, ["data", "objects"])
    const acc = resources.concat(nextResources)

    if (nextUrl) {
      return getResources(resourceUrl, offset + limit, acc)
    }

    return acc
  } catch (error) {
    console.error("ERROR: ", error)
  }
}

export const getEvents = async (eventsUrl: string): Promise<ActionKitEventResponse[]> => {
  return getResources(eventsUrl)
}

export const getEventSignup = (eventSignupUrl: string): Promise<ActionKitSignupResponse> => {
  return getResource(eventSignupUrl)
}

export const getUser = (userUrl: string): Promise<ActionKitPersonResponse> => {
  return getResource(userUrl)
}

export const getPhones = async (phoneUrls: string[]): Promise<ActionKitPhone[]> => {
  return await Promise.all(phoneUrls.map(async (phoneUrl: string) => {
    return await getPhone(phoneUrl)
  }))
}

export const getPhone = async (phoneUrl: string): Promise<ActionKitPhone> => {
  return await getResource(phoneUrl)
}

export const getEventTrees = async (eventsEndpoint = secrets.actionKitAPI.eventsEndpoint): Promise<ActionKitEvent[]> => {
  const events = await getEvents(eventsEndpoint)
  return Promise.all(events.filter(noSyncEventFilter).map(getEventTree))
}

const noSyncEventFilter = event => !event.title.includes("NOSYNC")

export const getEventTree = async (event): Promise<ActionKitEvent> => {
  const eventSignups = await Promise.all(event.signups.map(async (signupUrl) => {
    const eventSignup = await getEventSignup(signupUrl)
    const user = await getUser(eventSignup.user)
    const phones = await getPhones(user.phones)

    return {...eventSignup, user: {...user, phones}}
  }))

  return {...event, signups: eventSignups}
}
