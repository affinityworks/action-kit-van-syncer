import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick} from "lodash"
import {EventInstance} from "../../../src/db/models/event"
import {ShiftInstance} from "../../../src/db/models/shift"
import {parseDate} from "../../../src/service/parse"
import {vanEventTree} from "../../fixtures/vanEvent"

describe("Shift model", () => {
  const eventAttrs = vanEventTree[0]
  const shiftAttrs = vanEventTree[0].shifts[0]
  let db: Database, shift: ShiftInstance, event: EventInstance

  before(async () => {
    db = initDb()
    event = await db.Event.create(eventAttrs)
    shift = await db.Shift.create({
      ...shiftAttrs,
      eventId: event.id,
      include: [{model: db.Event, as: "event" }],
    })
  })

  after(async () => {
    await db.Event.destroy({where: {}})
    await db.Shift.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has correct fields", () => {
      expect(keys(shift.get())).to.eql([
        "id",
        "name",
        "startTime",
        "endTime",
        "updatedAt",
        "createdAt",
        "eventId",
        "eventShiftId",
      ])
    })
    
    it("saves correct fields", () => {
      expect(pick(shift, keys(shiftAttrs))).to.eql({
        ...shiftAttrs,
        startTime: parseDate(shiftAttrs.startTime),
        endTime: parseDate(shiftAttrs.endTime),
      })
    })
  })

  describe("associations", async () => {
    it("belongs to an event", async () => {
      const e = await shift.getEvent()
      expect(e.get()).to.eql(event.get())
    })
  })
})
