import {expect} from "chai"
import {cloneDeep, keys, omit, pick} from "lodash"
import {after, before, describe, it} from "mocha"
import {Database, initDb} from "../../../src/db"
import {EventInstance} from "../../../src/db/models/event"
import {SignupInstance} from "../../../src/db/models/signup"
import {vanEventTree} from "../../fixtures/vanEvent"
import * as chai from "chai"
import * as sinonChai from "sinon-chai"
import {vanApiStubOf} from "../../support/spies"

describe("Signup model", () => {
  chai.use(sinonChai)
  const eventAttrs = cloneDeep(vanEventTree[0])
  const personAttrs = eventAttrs.signups[0].person
  const signupAttrs = eventAttrs.signups[0]
  const createEventStub = vanApiStubOf("createEvent", { eventId: 1000000 })
  const createSignupStub = vanApiStubOf("createSignup", { eventSignupId: 1000000 })
  const createPersonStub = vanApiStubOf("createPerson", { vanId: 1000000 })
  const createShiftStub = vanApiStubOf("createShift", { eventShiftId: 1000000 })
  const createLocationStub = vanApiStubOf("createLocation", { locationId: 1000000 })

  let db: Database,
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
      include: [{ model: db.person }],
    })
  })

  after(async () => {
    createEventStub.restore()
    createSignupStub.restore()
    createPersonStub.restore()
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", async () => {

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
      expect(pick(p.get(), keys(personAttrs))).to.eql(personAttrs)
    })
  })

  describe("hooks", () => {

    describe("on creation", () => {

      it("posts nested event to VAN", async () => {
        const e = await signup.getEvent()
        expect(createEventStub).to.have.been.calledWith(e.get())
      })

      it("saves VAN event id to db", async () => {
        expect(await db.event.findOne({ where: { eventId: 1000000 }})).to.exist
      })

      it("posts nested person to VAN", async () => {
        const person = await signup.getPerson()
        expect(createPersonStub).to.have.been.calledWith(person.get())
      })

      it("saves VAN person id to db", async () => {
        expect(await db.person.findOne({ where: { vanId: 1000000 }})).to.exist
      })

      it ("posts nested shift to VAN", async () => {
        const shift = await signup.getShift()
        expect(createShiftStub.getCall(0).args[0]).to.eql(shift.get())
      })

      it ("saves VAN shift id to db", async () => {
        expect(await db.shift.findOne({ where: { eventShiftId: 1000000 }})).to.exist
      })

      it("posts nested location to VAN", async () => {
        const location = await signup.getLocation()
        expect(createLocationStub.getCall(0).args[0]).to.eql(location.get())
      })

      it("saves VAN location id to db", async () => {
        expect(await db.location.findOne({ where: { locationId: 1000000 }})).to.exist
      })

      it("posts signup with all nested resources to VAN", () => {
        expect(
          pick(
            createSignupStub.getCall(0).args[0],
            [
              "event",
              "location",
              "person",
              "role",
              "shift",
              "status",
            ],
          ),
        ).to.eql({
          event: {
            eventId: 1000000,
          },
          location: {
            locationId: 1000000,
          },
          person: {
            vanId: 1000000,
          },
          role: {
            roleId: signupAttrs.role.roleId,
          },
          shift: {
            eventShiftId: 1000000,
          },
          status: {
            statusId: signupAttrs.status.statusId,
          },
        })
      })

      it("saves signup id to VAN", async () => {
        expect(await db.signup.findOne({ where: { eventSignupId: 1000000 }})).to.exist
      })
    })
  })
})
