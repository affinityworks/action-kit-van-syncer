///<reference path="../../../node_modules/@types/sinon/index.d.ts"/>
import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, clone} from "lodash"
import {EventInstance} from "../../../src/db/models/event"
import {ShiftInstance} from "../../../src/db/models/shift"
import {parseDatesIn} from "../../../src/service/parse"
import {vanEventTree} from "../../fixtures/vanEvent"
import {vanApiStubOf} from "../../support/spies"
import * as nock from "nock"
import sinon from "ts-sinon"

describe("Shift model", () => {
  nock.disableNetConnect()
  const sandbox = sinon.createSandbox()

  const eventAttrs = vanEventTree[0]
  const shiftAttrs = vanEventTree[0].shifts[0]
  let db: Database, shift: ShiftInstance, event: EventInstance, createEventStub, createLocationStub

  before(async () => {
    db = initDb()
    createEventStub = vanApiStubOf(sandbox, "createEvent", { eventId: 1000000 })
    createLocationStub = vanApiStubOf(sandbox, "createLocation", { locationId: 1000000} )
    event = await db.event.create(eventAttrs)
    shift = await db.shift.create({
      ...shiftAttrs,
      eventId: event.id,
      include: [{ model: db.event }],
    })
  })

  after(async () => {
    createEventStub.restore()
    createLocationStub.restore()
    await db.event.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has correct fields", () => {
      expect(keys(shift.get()).sort()).to.eql([
        "id",
        "name",
        "startTime",
        "endTime",
        "updatedAt",
        "createdAt",
        "eventId",
        "eventShiftId",
      ].sort())
    })
    
    it("saves correct fields", () => {
      expect(pick(shift, keys(shiftAttrs))).to.eql(parseDatesIn(shiftAttrs))
    })
  })

  describe("associations", async () => {
    it("belongs to an event", async () => {
      const e = await shift.getEvent()
      expect(e.get()).to.eql(event.get())
    })
  })
})
