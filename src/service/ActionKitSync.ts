import {createStreams} from "./ActionKitAPI"
import {Subject} from "rxjs/Subject"
import * as _ from "lodash"

const eventResource = "event"
const signupResource = "signup"
const userResource = "user"

const eventSubject = new Subject()
const signupSubject = new Subject()
const userSubject = new Subject()

const { eventsStream, signupsStream, usersStream } = createStreams()

export const sync = () => {
  setupSubscribers()
}

export const setupSubscribers = () => {
  eventsStream.subscribe(apiSubscriber(eventResource))
  signupsStream.subscribe(apiSubscriber(signupResource))
  usersStream.subscribe(apiSubscriber(userResource))

  eventSubject.subscribe(diffSubscriber())
  signupSubject.subscribe(diffSubscriber())
  userSubject.subscribe(diffSubscriber())
}

export const apiSubscriber = (resourceType) => {
  return {
    next: (nextResources) => {
      nextResources.map((nextResource: ActionKitResource) => {
        const id = nextResource.id
        const dbResource = findResource(id, resourceType)
        // if (hasDiff(dbResource, nextResource)) {
        //   getSubject(resourceType).next({resourceType, id, nextResource})
        // }
        // publich to db
      })
    },
    error: (err) => {console.log(`Error in ${resourceType}:`, err)},
    complete: () => {console.log(`${resourceType} done!`)},
  }
}

export const diffSubscriber = () => {
  return {
    next: (nextDiff) => {
      const { resourceType, id, nextResource } = nextDiff
      // has diff
      // have type, id, object from api
      // write to db
      // post to van
      // every time we get something form db after create/update, then post entire obejc
      console.log(`New ${resourceType} diff:`, nextResource)
    },
    error: (err) => { console.log("Error:", err) },
    complete: () => { console.log("Done!") },
  }
}

export const findResource = (id, resourceType) => {
  switch (resourceType) {
    case eventResource: {
      return { akId: 1, name: "blah" }
    }
    case signupResource: {
      return { akId: 1, name: "blah" }
    }
    case userResource: {
      return { akId: 1, name: "blah" }
    }
  }
}

export const hasDiff = (dbResource, apiResource) => {
  return !_.isEqual(dbResource, apiResource)
}

export const getSubject = (resourceType) => {
  switch (resourceType) {
    case eventResource: return eventSubject
    case signupResource: return signupSubject
    case userResource: return userSubject
  }
}

sync()
