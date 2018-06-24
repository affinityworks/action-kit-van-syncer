import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, cloneDeep, omit} from "lodash"
import {EventInstance} from "../../../src/db/models/event"
import {PersonInstance} from "../../../src/db/models/person"
import {ShiftInstance} from "../../../src/db/models/shift"
import {parseDatesIn} from "../../../src/service/parse"
import {vanEventTree} from "../../fixtures/vanEvent"
import {SignupInstance} from "../../../src/db/models/signup"

describe("Signup model", () => {
  const eventAttrs = cloneDeep(vanEventTree[0])
  const personAttrs = eventAttrs.signups[0].person
  const signupAttrs = eventAttrs.signups[0]

  let
    db: Database,
    event: EventInstance,
    signup: SignupInstance

  before(async () => {
    db = initDb()
    event = await db.event.create(eventAttrs, {
      include: [
        { model: db.shift },
        { model: db.location },
      ],
    })

    signup = await db.signup.create({
      ...signupAttrs,
      eventId: event.id,
      shiftId: event.shifts[0].id,
      locationId: event.locations[0].id,
      person: personAttrs,
    }, {
      include: [{ model: db.person, include: [{ model: db.address }]}],
    })
  })

  after(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.address.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has correct fields", () => {
      expect(keys(signup.get()).sort()).to.eql([
        "actionKitId",
        "createdAt",
        "eventId",
        "eventSignupId",
        "id",
        "locationId",
        "person",
        "personId",
        "role",
        "shiftId",
        "status",
        "updatedAt",
        "vanEventId",
        "vanShiftId",
      ])
    })

    it("saves correct fields")
  })

  describe("associations", async () => {
    it("belongs to an event", async () => {
      const e = await signup.getEvent()
      expect(e.get("id")).to.eql(event.id)
    })
    it("belongs to a location", async () => {
      const l = await signup.getLocation()
      expect(l.get("id")).to.eql(event.locations[0].id)
    })
    it("belongs to a shift", async () => {
      const s = await signup.getShift()
      expect(s.get("id")).to.eql(event.shifts[0].id)
    })
    it("belongs to a person", async () => {
      const p = await signup.getPerson()
      expect(pick(p.get(), keys(personAttrs)))
        .to.eql(omit(personAttrs, ["addresses"]))
    })
    it("accepts nested attributes for a person's address", async () => {
      const a = await signup.getPerson().then(p => p.getAddresses())
      expect(pick(a[0].get(), keys(personAttrs.addresses[0])))
        .to.eql(personAttrs.addresses[0])
    })
  })
})
