import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick, omit, map, cloneDeep} from "lodash"
import {parseDatesIn} from "../../../src/service/parse"
import {vanEventTree} from "../../fixtures/vanEvent"
import {vanApiStubOf} from "../../support/spies"
import * as chai from "chai"
import * as sinonChai from "sinon-chai"
import * as nock from "nock"
import sinon from "ts-sinon"

describe("Event model", () => {
  nock.disableNetConnect()
  chai.use(sinonChai)
  const sandbox = sinon.createSandbox()

  const et = cloneDeep(vanEventTree) // else #create call will mutate fixture
  const eventAttrs = et[0]
  const locationAttrs = et[0].locations[0]
  const shiftsAttrs = et[0].shifts
  let db, event, createEventStub, createLocationStub, location

  before(async () => {
    db = initDb()

    createEventStub = vanApiStubOf(sandbox, "createEvent", { eventId: 1000000 })
    location = { locationId: 1000000 }
    createLocationStub = vanApiStubOf(sandbox, "createLocation", location)

    event = await db.event.create({
      ...eventAttrs,
      location: locationAttrs,
      shifts: shiftsAttrs,
    }, {
      include: [
        { model: db.location },
        { model: db.shift },
      ],
    })
  })

  after(async () => {
    createEventStub.restore()
    createLocationStub.restore()
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(keys(event.get()).sort()).to.eql([
      "actionKitId",
      "codes",
      "createdAt",
      "createdDate",
      "description",
      "endDate",
      "eventId",
      "eventType",
      "id",
      "locations",
      "name",
      "notes",
      "roles",
      "shifts",
      "shortName",
      "startDate",
      "updatedAt",
      "vanId",
    ])
  })

  describe("associations", async () => {

    it("has many locations", async () => {
      const l = await event.getLocations()
      expect(pick(l[0], keys(omit(locationAttrs, ["address"]))))
        .to.eql(omit(locationAttrs, ["address"]))
    })

    it("has many shifts", async () => {
      const shifts = await event.getShifts()
      map(shifts, (shift, i) =>
        expect(pick(shift, keys(shiftsAttrs[i]))).to.eql(parseDatesIn(shiftsAttrs[i])),
      )
    })
  })

  describe("hooks", async () => {
    describe("on creation", () => {
      describe("when all resources are new", () => {
        it("posts nested event to VAN", async () => {
          // expect(createEventStub).to.have.been.calledWith( { ...event.get(), locations: [location] })
        })

        it("saves VAN event id to db", async () => {
          expect(await db.event.findOne({where: {eventId: 1000000}})).to.exist
        })
      })
    })

    describe("on delete", () => {
      let counts
      before(async () => {
        counts = {
          location: await db.location.count(),
          shift: await db.shift.count(),
        }
        await event.destroy()
      })

      it("deletes associated location", async () => {
        expect(await db.location.count()).to.eql(counts.location - 1)
      })

      it("deletes associated shifts", async () => {
        expect(await db.shift.count()).to.eql(counts.shift - 1)
      })
    })
  })
})
