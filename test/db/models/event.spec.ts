import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {initDb} from "../../../src/db"
import {keys, pick, omit, map} from "lodash"
import {parseDatesIn} from "../../../src/service/parse"
import {vanEvents, vanEventTree} from "../../fixtures/vanEvent"

describe("Event model", () => {
  const eventAttrs = vanEvents[0]
  const locationAttrs = vanEventTree[0].locations[0]
  const shiftsAttrs = vanEventTree[0].shifts
  const rolesAttrs = vanEventTree[0].roles
  let db, event

  before(async () => {
    db = initDb()
    event = await db.Event.create({
      ...eventAttrs,
      location: locationAttrs,
      shifts: shiftsAttrs,
      roles: rolesAttrs,
    }, {
      include: [
        {
          model: db.Location,
          as: "location",
          include: [{ model: db.Address, as: "address" }],
        },
        { model: db.Shift, as: "shifts" },
        { model: db.Role, as: "roles" },
      ],
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
          location: await db.Location.count(),
          shift: await db.Shift.count(),
          role: await db.Role.count(),
        }
        await event.destroy()
      })

      it("deletes associated location", async () => {
        expect(await db.Location.count()).to.eql(counts.location - 1)
      })

      it("deletes associated shifts", async () => {
        expect(await db.Shift.count()).to.eql(counts.shift - 1)
      })

      it("deletes associated roles", async () => {
        expect(await db.Role.count()).to.eql(counts.role - 2)
      })
    })
  })
})
