import {expect} from "chai"
import * as nock from "nock"
import {getEvents, getEventSignup, getUser, createStreams} from "../../src/service/ActionKitAPI"
import * as responses from "../Responses"

describe("ActionKitAPI", () => {
  before(() => {
    nock("https://roboticdogs.actionkit.com"  )
      .persist()
      .get("/rest/v1/event/?campaign=289")
      .reply(200, responses.eventsResponse)
      .get("/rest/v1/eventsignup/1267/")
      .reply(200, responses.signupResponseHost)
      .get("/rest/v1/eventsignup/1268/")
      .reply(200, responses.signupResponseAttendee)
      .get("/rest/v1/eventsignup/1269/")
      .reply(200, responses.signupResponseHost)
      .get("/rest/v1/eventsignup/1270/")
      .reply(200, responses.signupResponseAttendee)
      .get("/rest/v1/user/350567/")
      .reply(200, responses.userResponseHost)
      .get("/rest/v1/user/350568/")
      .reply(200, responses.userResponseAttendee)
  })

  describe("getEvents", () => {
    it("contains the events for the campaign", async () => {
      const events = await getEvents("/rest/v1/event/?campaign=289")
      expect(events).to.be.an("Array")
    })
  })

  describe("getEventSignup", () => {
    it("contains the user for the signup", async () => {
      const eventSignup = await getEventSignup("/rest/v1/eventsignup/1268/")
      expect(eventSignup.user).to.eq("/rest/v1/user/350568/")
    })
  })

  describe("getUser", () => {
    it("contains the id for the user", async () => {
      const user = await getUser("/rest/v1/user/350568/")
      expect(user.id).to.eq(350568)
    })
  })

  describe("createStreams", () => {
    it("creates streams", (done) => {
      done()
    })
  })

  describe("sync", () => {
    it("runs rxjs", (done) => {
      done()
    })
  })
})