import {describe, it} from "mocha"
import * as api from "../../src/service/vanApi"
import * as nock from "nock"
import {eventAttrs} from "../fixtures/vanEvent"
import config from "../../config/index"
import {personAttrs} from "../fixtures/vanPerson"
import {signupUpdate} from "../fixtures/vanSignup"
import {expect} from "chai"

const {secrets} = config

describe("vanApi", () => {
  nock.disableNetConnect()
  describe("create resource", () => {
    it("calls create on event api", async () => {
      nock(secrets.vanAPI.baseUrl)
        .post("/events", eventAttrs)
        .reply(200)

      await api.createEvent(eventAttrs)
    })
  })

  describe("update resource", () => {
    it("calls update on event api", async () => {
      nock(secrets.vanAPI.baseUrl)
        .put("/events/1", eventAttrs)
        .reply(200)

      await api.updateEvent(eventAttrs)
    })

    it("calls update on person api", async () => {
      nock(secrets.vanAPI.baseUrl)
        .post("/people/1", personAttrs)
        .reply(200)

      await api.updatePerson(personAttrs)
    })

    it("calls update on signup api", async () => {
      nock(secrets.vanAPI.baseUrl)
        .put("/signups/1", signupUpdate)
        .reply(200)

      await api.updateSignup(signupUpdate)
    })
  })
})
