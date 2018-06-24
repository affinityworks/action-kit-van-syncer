import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick, omit, map, cloneDeep} from "lodash"
import {parseDatesIn} from "../../../src/service/parse"
import {vanEventTree} from "../../fixtures/vanEvent"

describe("Event model", () => {
  const et = cloneDeep(vanEventTree) // else #create call will mutate fixture
  const eventAttrs = et[0]
  const locationAttrs = et[0].locations[0]
  const shiftsAttrs = et[0].shifts
  let db, event

  before(async () => {
    db = initDb()
    event = await db.event.create({
      ...eventAttrs,
      location: locationAttrs,
      shifts: shiftsAttrs,
    }, {
      include: [
        {
          model: db.location,
          include: [{ model: db.address }],
        },
        { model: db.shift },
      ],
    })
  })

  after(async () => {
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
      "location",
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

    it("has one location (w/o nested attrs)", async () => {
      const l = await event.getLocation()
      expect(pick(l, keys(omit(locationAttrs, ["address"]))))
        .to.eql(omit(locationAttrs, ["address"]))
    })

    it("has one location (w/ nested attrs)", async () => {
      const l = await event.getLocation({include: [{ model: db.address, as: "address" }]})
      expect({
        ...pick(l, keys(locationAttrs)),
        address: pick(l.address, keys(locationAttrs.address)),
      }).to.eql(locationAttrs)
    })

    it("has many shifts", async () => {
      const shifts = await event.getShifts()
      map(shifts, (shift, i) =>
        expect(pick(shift, keys(shiftsAttrs[i]))).to.eql(parseDatesIn(shiftsAttrs[i])),
      )
    })
  })

  describe("hooks", async () => {
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
