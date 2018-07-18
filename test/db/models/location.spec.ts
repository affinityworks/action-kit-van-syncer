import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {locationAttrs as la, vanEvents, vanEventTree} from "../../fixtures/vanEvent"

describe("Location model", () => {
  const locationAttrs = {...la, locationId: Math.round(Math.random() * 1000000000) }
  let db, location, event

  before(async () => {
    db = initDb()
    event = await db.event.create(vanEvents[0])
    location = await db.location.create({
      ...locationAttrs, eventId: event.id
    }, {
      include: [{ model: db.event } ],
    })
  })

  after(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has the right fields", () => {
      expect(keys(location.get())).to.eql([
        "id",
        "name",
        "displayName",
        "locationId",
        "eventId",
        "updatedAt",
        "createdAt",
        "address",
      ])
    })

    it("saves the right fields", () => {
      expect(pick(location, keys(locationAttrs))).to.eql(locationAttrs)
    })
  })

  describe("associations", async () => {

    it("belongs to an event", async () => {
      const e = await location.getEvent()
      expect(e.dataValues).to.eql(event.dataValues)
    })
  })
})
