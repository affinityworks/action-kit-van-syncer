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
  const rolesAttrs = et[0].roles
  let db, event

  before(async () => {
    db = initDb()
    event = await db.event.create({
      ...eventAttrs,
      location: locationAttrs,
      shifts: shiftsAttrs,
      roles: rolesAttrs,
    }, {
      include: [
        {
          model: db.location,
          include: [{ model: db.address }],
        },
        { model: db.shift },
        { model: db.role },
      ],
    })
  })

  after(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.sequelize.close()
  })

  test("fields", () => {
    expect(keys(event.get())).to.eql([
      "id",
      "actionKitId",
      "name",
      "description",
      "createdDate",
      "startDate",
      "endDate",
      "eventType",
      "codes",
      "notes",
      "shifts",
      "roles",
      "location",
      "updatedAt",
      "createdAt",
      "vanId",
      "eventId",
      "shortName",
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

    it("has many roles", async () => {
      const roles = await event.getRoles()
      map(roles, (role, i) =>
        expect(pick(role, keys(rolesAttrs[i]))),
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
          role: await db.role.count(),
        }
        await event.destroy()
      })

      it("deletes associated location", async () => {
        expect(await db.location.count()).to.eql(counts.location - 1)
      })

      it("deletes associated shifts", async () => {
        expect(await db.shift.count()).to.eql(counts.shift - 1)
      })

      it("deletes associated roles", async () => {
        expect(await db.role.count()).to.eql(counts.role - 2)
      })
    })
  })
})
