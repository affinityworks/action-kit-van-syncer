import {Address} from "cluster"
import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {locationAttrs, vanEvents, vanEventTree} from "../../fixtures/vanEvent"

describe("Location model", () => {
  const addressAttrs = vanEventTree[0].locations[0].address
  let db, location, event

  before(async () => {
    db = initDb()
    event = await db.Event.create(vanEvents[0])
    location = await db.Location.create({
      ...locationAttrs,
      eventId: event.id,
      address: addressAttrs, // accepts nested
    }, {
      include: [
        { model: db.Event, as: "event" },
        { model: db.Address, as: "address" },
      ],
    })
  })

  after(async () => {
    await db.Address.destroy({where: {}})
    await db.Event.destroy({where: {}})
    await db.Location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(pick(location.dataValues, keys(locationAttrs))).to.eql(locationAttrs)
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
      const count = await db.Address.count()
      await location.destroy()
      expect(await db.Address.count()).to.eql(count - 1)
    })
  })
})
