import {describe, it} from "mocha"
import * as api from "../../src/api/vanApi"
import * as nock from "nock"
import {eventAttrs} from "../fixtures/vanEvent"
import config from "../../config"
import {personAttrs} from "../fixtures/vanPerson"
import {signupUpdate} from "../fixtures/vanSignup"
const {secrets} = config

describe("vanApi", () => {
  nock.disableNetConnect()

  describe("update resource", () => {
    it("calls update on event api", async () => {
      const scope = nock(secrets.vanAPI.baseUrl)
        .put("/events/1", eventAttrs)
        .reply(200)

      await api.updateEvent(eventAttrs)
      scope.isDone()
    })

    it("calls update on person api", async () => {
      const scope = nock(secrets.vanAPI.baseUrl)
        .post("/people/1", personAttrs)
        .reply(200)

      await api.updatePerson(personAttrs)
      scope.isDone()
    })

    it("calls update on signup api", async () => {
      const scope = nock(secrets.vanAPI.baseUrl)
        .put("/signups/1", signupUpdate)
        .reply(200)

      await api.updateSignup(signupUpdate)
      scope.isDone()
    })
  })
})
