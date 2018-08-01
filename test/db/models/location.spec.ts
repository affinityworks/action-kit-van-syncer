import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {vanEvents, vanEventTree} from "../../fixtures/vanEvent"
import {locationAttrs as la} from "../../fixtures/vanLocation"
import nock = require("nock")
import sinon from "ts-sinon"
import {vanApiStubOf} from "../../support/spies"
import {createLocation} from "../../../src/service/vanApi"

describe("Location model", () => {
  nock.disableNetConnect()
  const sandbox = sinon.createSandbox()

  const locationAttrs = { ...la[0], locationId: Math.round(Math.random() * 1000000000) }
  let db, location, event, createEventStub, createLocationStub

  before(async () => {
    db = initDb()
    createEventStub = vanApiStubOf(sandbox, "createEvent", { eventId: 1000000 })
    createLocationStub = vanApiStubOf(sandbox, "createLocation", { locationId: 1000000 })

    event = await db.event.create(vanEvents[0])
    location = await db.location.create({
      ...locationAttrs, eventId: event.id,
    }, {
      include: [{ model: db.event } ],
    })
  })

  after(async () => {
    createEventStub.restore()
    createLocationStub.restore()
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has the right fields", () => {
      expect(keys(location.get())).to.eql([
        "id",
        "name",
        "address",
        "locationId",
        "eventId",
        "updatedAt",
        "createdAt",
        "displayName",
      ])
    })

    it("saves the right fields", () => {
      expect(pick(location, keys(locationAttrs))).to.eql(locationAttrs)
    })
  })

  describe("associations", async () => {

    it("belongs to an event", async () => {
      const e = await location.getEvent()
      expect(e.get("id")).to.eql(event.id)
    })
  })
})
