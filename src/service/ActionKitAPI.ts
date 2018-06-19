import axios from "axios"
import * as _ from "lodash"
import {Observable, interval} from "rxjs"
import {mergeMap} from "rxjs/operators"
import "rxjs/add/observable/of"
import "rxjs/add/observable/from"
import "rxjs/add/operator/map"
import "rxjs/add/observable/fromPromise"
import "rxjs/add/observable/forkJoin"
import "rxjs/add/observable/interval"
import {secrets} from "../Secrets"

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
  return eventSignupUrls.map((signupUrl) => {
    return getEventSignup(signupUrl)
  })
}

export const getEventSignup = (eventSignupUrl: string) => {
  return getResource(eventSignupUrl, ["data"])
}

export const getUsers = (userUrls) => {
  return userUrls.map((userUrl) => getUser(userUrl))
}

export const getUser = (userUrl: string) => {
  return getResource(userUrl, ["data"])
}

export const buildEventsStream = (intervalStream) => {
  return intervalStream.pipe(
    mergeMap((_) => Observable.fromPromise(getEvents(secrets.actionKitAPI.campaignEndpoint))),
  )
}

export const buildSignupsStream = (eventsStream) => {
  return eventsStream.pipe(
    mergeMap((events: [ActionKitEvent]) => {
      const eventSignupUrls = [].concat(...events.map( (event) => event.signups))
      return Observable.forkJoin(getEventSignups(eventSignupUrls))
    }),
  )
}

export const buildUsersStream = (signupsStream) => {
  return signupsStream.pipe(
    mergeMap((signups: [ActionKitSignup]) => {
      const userUrls = signups.map((signup) => signup.user)
      return Observable.forkJoin(getUsers(userUrls))
    }),
  )
}

export const createStreams = (intervalPeriod = 10000) => {
  const intervalStream = interval(intervalPeriod)
  const eventsStream = buildEventsStream(intervalStream)
  const signupsStream = buildSignupsStream(eventsStream)
  const usersStream = buildUsersStream(signupsStream)

  return { eventsStream, signupsStream, usersStream }
}
