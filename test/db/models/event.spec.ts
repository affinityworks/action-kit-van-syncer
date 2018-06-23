import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick, omit} from "lodash"
import {LocationInstance} from "../../../src/db/models/location"
import {parseDate, parseDatesIn} from "../../../src/service/parse"
import {vanEvents, vanEventTree} from "../../fixtures/vanEvent"

describe("Event model", () => {
  const eventAttrs = vanEvents[0]
  const locationAttrs = vanEventTree[0].locations[0]
  const shiftAttrs = vanEventTree[0].shifts[0]
  let db, event

  before(async () => {
    db = initDb()
    event = await db.Event.create({
      ...eventAttrs,
      location: locationAttrs,
      shifts: [shiftAttrs],
    }, {
      include: [{
        model: db.Location,
        as: "location",
        include: [{ model: db.Address, as: "address" }],
      }, {
        model: db.Shift,
        as: "shifts",
      }],
    })
  })

  after(async () => {
    await db.Event.destroy({where: {}})
    await db.Location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(pick(event, keys(eventAttrs))).to.eql(parseDatesIn(eventAttrs))
  })

  describe("associations", async () => {

    it("has one location (w/o nested attrs)", async () => {
      const l = await event.getLocation()
      expect(pick(l, keys(omit(locationAttrs, ["address"]))))
        .to.eql(omit(locationAttrs, ["address"]))
    })
  
    it("has one location (w/ nested attrs)", async () => {
      const l = await event.getLocation({include: [{ model: db.Address, as: "address" }]})
      expect({
        ...pick(l, keys(locationAttrs)),
        address: pick(l.address, keys(locationAttrs.address)),
      }).to.eql(locationAttrs)
    })

    it("has many shifts", async () => {
      const shifts = await event.getShifts()
      expect(pick(shifts[0], keys(shiftAttrs))).to.eql(parseDatesIn(shiftAttrs))
    })
  })
})
