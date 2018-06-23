import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {locationAttrs as la, vanEvents, vanEventTree} from "../../fixtures/vanEvent"

describe("Location model", () => {
  const locationAttrs = {...la, locationId: Math.round(Math.random() * 1000000000) }
  const addressAttrs = vanEventTree[0].locations[0].address
  let db, location, event

  before(async () => {
    db = initDb()
    event = await db.event.create(vanEvents[0])
    location = await db.location.create({
      ...locationAttrs,
      eventId: event.id,
      address: addressAttrs, // accepts nested
    }, {
      include: [
        { model: db.event },
        { model: db.address },
      ],
    })
  })

  after(async () => {
    await db.address.destroy({where: {}})
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has the right fields", () => {
      expect(keys(location.dataValues)).to.eql([
        "id",
        "name",
        "displayName",
        "locationId",
        "eventId",
        "address",
        "updatedAt",
        "createdAt",
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

    it("has one address", async () => {
      const a = await location.getAddress()
      expect(pick(a, keys(addressAttrs))).to.eql(addressAttrs)
    })

    it("deletes address when it deletes location", async () => {
      const count = await db.address.count()
      await location.destroy()
      expect(await db.address.count()).to.eql(count - 1)
    })
  })
})
