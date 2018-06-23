import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {parseDate} from "../../../src/service/parse"
import {locationAttrs, vanEvents} from "../../fixtures/vanEvent"

describe("Event model", () => {
  const eventAttrs = vanEvents[0]
  let db, event

  before(async () => {
    db = initDb()
    event = await db.Event.create({
      ...eventAttrs,
      location: locationAttrs,
    }, {
      include: [{ model: db.Location, as: "location" }],
    })
  })

  after(async () => {
    await db.Event.destroy({where: {}})
    await db.Location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(pick(event, keys(eventAttrs))).to.eql({
      ...eventAttrs,
      createdDate: parseDate(eventAttrs.createdDate),
      startDate: parseDate(eventAttrs.startDate),
      endDate: parseDate(eventAttrs.endDate),
    })
  })

  describe("associations", async () => {

    it("has one location (lazy loaded)", async () => {
      const l = await event.getLocation()
      expect(pick(l, keys(locationAttrs))).to.eql(locationAttrs)
    })

    it("has one location (eager loaded)", () => {
      expect(pick(event.location, keys(locationAttrs))).to.eql(locationAttrs)
    })
  })
})
