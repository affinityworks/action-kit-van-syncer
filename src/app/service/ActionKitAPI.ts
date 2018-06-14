import axios from "axios"
import {flatten, get} from "lodash"
import {secrets} from "../Secrets"

export const getEvents = async (eventsUrl): Promise<[ActionKitEvent]> => {
  return await getResource(eventsUrl, ["data", "objects"])
}

export const getEventSignup = async (eventSignupUrl: string): Promise<ActionKitSignup> => {
  return await getResource(eventSignupUrl, ["data"])
}

export const getUser = async (userUrl: string): Promise<ActionKitPerson> => {
  return await getResource(userUrl, ["data"])
}

const getResource = async (resourceUrl: string, responsePath: string[]) => {
  try {
    const response = await api().get(resourceUrl)
    return get(response, responsePath)
  } catch (error) {
    console.error(error)
  }
}

export const sync = async (): Promise<{events: ActionKitEvent[], signups: ActionKitSignup[], users: ActionKitPerson[]}> => {
  const events = await getEvents(secrets.actionKitAPI.campaignEndpoint)

  const signups = flatten(await Promise.all(events.map(async (event) => {
    return await Promise.all(event.signups.map(async (signupUrl) => {
      return await getEventSignup(signupUrl)
    }))
  })))

  const users = await Promise.all(signups.map(async (signup) => {
    return await getUser(signup.user)
  }))

  return { events, signups, users }
}

const api = () => {
  return axios.create({
    baseURL: secrets.actionKitAPI.baseUrl,
    auth: {
      username: secrets.actionKitAPI.username,
      password: secrets.actionKitAPI.password,
    },
  })
}
