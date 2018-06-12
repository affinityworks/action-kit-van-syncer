import {expect} from "chai"
import * as nock from "nock"
import {getEvents, getEventSignup, getUser, sync} from "../../app/service/ActionKitAPI"
import {signupResponseAttendee, signupResponseHost, eventsResponse, userResponse} from "../Responses"

describe("ActionKitAPI", () => {
  describe("getEvents", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/event/?campaign=289")
        .reply(200, eventsResponse)
    })

    it("contains the events for the campaign", async () => {
      const events = await getEvents("/rest/v1/event/?campaign=289")
      expect(events).to.be.an("Array")
    })
  })

  describe("getEventSignup", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/eventsignup/1268")
        .reply(200, signupResponseAttendee)
    })

    it("contains the user for the signup", async () => {
      const eventSignup = await getEventSignup("/rest/v1/eventsignup/1268")
      expect(eventSignup.user).to.eq("/rest/v1/user/350568/")
    })
  })

  describe("getUser", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/user/350568")
        .reply(200, userResponse)
    })

    it("contains the id for the user", async () => {
      const user = await getUser("/rest/v1/user/350568")
      expect(user.id).to.eq(350568)
    })
  })

  describe("sync", () => {
    before(() => {
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/event/?campaign=289")
        .reply(200, eventsResponse)
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/eventsignup/1267")
        .reply(200, signupResponseHost)
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/eventsignup/1268")
        .reply(200, signupResponseAttendee)
      nock("https://roboticdogs.actionkit.com")
        .get("/rest/v1/user/350568")
        .reply(200, userResponse)
    })

    it("contains the id for the user", async () => {
      await sync()
    })
  })
})
