import {expect} from "chai"
import {describe, it, xit, before} from "mocha"
import * as nock from "nock"
import {getEvents, getEventSignup, getUser, getEventTrees, getEventTree} from "../../src/service/actionKitAPI"
import {actionKitEventTree, actionKitEventTreeWithNoSyncEvent} from "../fixtures/actionKitEvent"
import * as responses from "../fixtures/Responses"

describe("actionKitAPI", () => {
  describe("getEvents", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/event/?_limit=100&_offset=0")
        .reply(200, responses.eventsResponse)
    })

    it("returns the event objects", async () => {
      const events = await getEvents("/rest/v1/event/")
      expect(events).to.eql(responses.eventsResponse.objects)
    })
  })

  describe("getEventSignup", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/eventsignup/1268/")
        .reply(200, responses.signupResponseAttendee)
    })

    it("returns the event signup object", async () => {
      const eventSignup = await getEventSignup("/rest/v1/eventsignup/1268/")
      expect(eventSignup).to.eql(responses.signupResponseAttendee)
    })
  })

  describe("getUser", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/user/350568/")
        .reply(200, responses.userResponseHost)
    })

    it("returns the user object", async () => {
      const user = await getUser("/rest/v1/user/350568/")
      expect(user).to.eql(responses.userResponseHost)
    })
  })

  describe("getEventTree", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/eventsignup/1267/")
        .reply(200, responses.signupResponseHost)
        .get("/rest/v1/user/350567/")
        .reply(200, responses.userResponseHost)
        .get("/rest/v1/eventsignup/1268/")
        .reply(200, responses.signupResponseAttendee)
        .get("/rest/v1/user/350568/")
        .reply(200, responses.userResponseAttendee)
        .get("/rest/v1/phone/568/")
        .reply(200, responses.phoneResponseAttendeeHome)
        .get("/rest/v1/phone/569/")
        .reply(200, responses.phoneResponseAttendeeMobile)
    })

    it("returns a correctly formatted event tree", async () => {
      const event = responses.eventsResponse.objects[0]
      const eventTree = await getEventTree(event)
      expect(eventTree).to.eql(actionKitEventTree[0])
    })
  })

  describe("getEventTrees", () => {
    it("returns an array of trees", async () => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/event/?_limit=100&_offset=0")
        .reply(200, responses.eventsResponse)
        .get("/rest/v1/eventsignup/1267/")
        .reply(200, responses.signupResponseHost)
        .get("/rest/v1/user/350567/")
        .reply(200, responses.userResponseHost)
        .get("/rest/v1/eventsignup/1268/")
        .reply(200, responses.signupResponseAttendee)
        .get("/rest/v1/user/350568/")
        .reply(200, responses.userResponseAttendee)
        .get("/rest/v1/phone/568/")
        .reply(200, responses.phoneResponseAttendeeHome)
        .get("/rest/v1/phone/569/")
        .reply(200, responses.phoneResponseAttendeeMobile)

      const eventTrees = await getEventTrees()
      expect(eventTrees).to.eql(actionKitEventTree)
    })

    it("filters out any events with NOSYNC in the title", async () => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/event/?_limit=100&_offset=0")
        .reply(200, responses.eventsResponseWithNoSync)

      const eventTrees = await getEventTrees()
      expect(eventTrees).to.eql(actionKitEventTreeWithNoSyncEvent)
    })
  })

})
