import axios from "axios"
import * as _ from "lodash"
import {secrets} from "../Secrets"
import {Subject} from "rxjs/Subject"

export const actionKitSubject = new Subject()

const api = () => {
  return axios.create({
    baseURL: secrets.actionKitAPI.baseUrl,
    auth: {
      username: secrets.actionKitAPI.username,
      password: secrets.actionKitAPI.password,
    },
  })
}

const getResource = async (resourceUrl: string, responsePath: string[]) => {
  try {
    const response = await api().get(resourceUrl)
    return _.get(response, responsePath)
  } catch (error) {
    console.error(error)
  }
}

export const getEvents = async (eventsUrl) => {
  return getResource(eventsUrl, ["data", "objects"])
}

export const getEventSignups = (eventSignupUrls) => {
  return eventSignupUrls.map(getEventSignup)
}

export const getEventSignup = (eventSignupUrl: string) => {
  return getResource(eventSignupUrl, ["data"])
}

export const getUsers = (userUrls) => {
  return userUrls.map(getUser)
}

export const getUser = (userUrl: string) => {
  return getResource(userUrl, ["data"])
}

export const getPhones = async (phoneUrls) => {
  return await Promise.all(phoneUrls.map(async (phoneUrl) => {
    return await getPhone(phoneUrl)
  }))
}

export const getPhone = async (phoneUrl: string) => {
  return await getResource(phoneUrl, ["data"])
}

export const getResources = async () => {
  const events = await getEvents(secrets.actionKitAPI.campaignEndpoint)

  events.map( async (event) => {
    const eventSignups = await Promise.all(event.signups.map( async (signupUrl) => {
      const eventSignup = await getEventSignup(signupUrl)
      const user = await getUser(eventSignup.user)
      const phones = await getPhones(user.phones)

      return { ...eventSignup, user: {...user, phones } }
    }))

    const resourceTree = { ...event, signups: eventSignups }
    actionKitSubject.next(resourceTree)
  })
}
