import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {vanEvents, vanEventTree, vanEventWithLocation} from "../../fixtures/vanEvent"
import {locationAttrs as la} from "../../fixtures/vanLocation"
import nock = require("nock")
import * as sinonChai from "sinon-chai"
import sinon from "ts-sinon"
import * as chai from "chai"
import {vanApiStubOf} from "../../support/spies"
import {createLocation} from "../../../src/service/vanApi"

describe("Location model", () => {
  nock.disableNetConnect()
  chai.use(sinonChai)

  const sandbox = sinon.createSandbox()

  const locationAttrs = vanEventWithLocation.locations[0]
  let db, location, event, createEventStub, createLocationStub

  before(async () => {
    db = initDb()
    createEventStub = vanApiStubOf(sandbox, "createEvent", { eventId: 1000000 })
    createLocationStub = vanApiStubOf(sandbox, "createLocation", { locationId: 1000000 })

    event = await db.event.create(vanEventWithLocation, {
      include: [
        { model: db.location },
      ],
    })
    location = await event.getLocations().then(locations => locations[0] )
  })

  after(async () => {
    sandbox.restore()
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has the right fields", () => {
      expect(keys(location.get())).to.eql([
        "id",
        "locationId",
        "name",
        "displayName",
        "eventId",
        "address",
        "createdAt",
        "updatedAt",
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

  describe("hooks", async () => {
    before(async () => {
      createLocationStub.restore()
      createLocationStub = vanApiStubOf(sandbox, "createLocation", { locationId: 1000001 })
      await location.update({ name: "Updated Name" })
    })

    describe("on update", () => {
      it("posts location to VAN", async () => {
        expect(createLocationStub).to.have.been.calledOnce
      })

      it("saves VAN location id to db", async () => {
        expect(await db.location.findOne({where: {locationId: 1000001}})).to.exist
      })

      it("does not make VAN call if nothing changed", async () => {
        await location.update(location.get())
        expect(createLocationStub).to.have.been.calledOnce
      })

      it("does not make VAN call if locationId is updated", async () => {
        await location.update({ locationId: 1 })
        expect(createLocationStub).to.have.been.calledOnce
      })
    })
  })
})
