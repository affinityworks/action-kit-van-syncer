import {expect} from "chai"
import {cloneDeep, keys, omit, pick} from "lodash"
import {after, before, describe, it} from "mocha"
import {Database, initDb} from "../../../src/db"
import {EventInstance} from "../../../src/db/models/event"
import {SignupInstance} from "../../../src/db/models/signup"
import {vanEventTree} from "../../fixtures/vanEvent"
import * as vanApi from "../../../src/api/vanApi"
import * as sinon from "sinon"
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
      include: [{ model: db.person, include: [{ model: db.address }]}],
    })
  })

  after(async () => {
    createEventStub.restore()
    createSignupStub.restore()
    createPersonStub.restore()
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.address.destroy({where: {}})
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
      expect(pick(p.get(), keys(personAttrs)))
        .to.eql(omit(personAttrs, ["addresses"]))
    })

    it("accepts nested attributes for a person's address", async () => {
      const a = await signup.getPerson().then(p => p.getAddresses())
      expect(pick(a[0].get(), keys(personAttrs.addresses[0])))
        .to.eql(personAttrs.addresses[0])
    })
  })

  describe("hooks", () => {

    describe("on creation", () => {

      it("posts nested event to VAN", () => {
        expect(createEventStub).to.have.been.calledWith(signup.event)
      })

      it("saves van event id to db", async () => {
        expect(await db.event.findOne({ where: { eventId: 1000000 }})).to.exist
      })

      it("posts nested person to VAN", () => {
        expect(createPersonStub).to.have.been.calledWith(signup.person)
      })

      it("saves van person id to db", async () => {
        expect(await db.person.findOne({ where: { vanId: 1000000 }})).to.exist
      })

      it("posts signup with all nested resources to VAN", () => {
        expect(
          pick(
            createSignupStub.getCall(0).args[0],
            ["eventId", "vanId"],
          ),
        ).to.eql({
          eventId: 1000000,
          vanId: 1000000,
        })
      })

      it("saves signup id to VAN", async () => {
        expect(await db.signup.findOne({ where: { eventSignupId: 1000000 }})).to.exist
      })
    })
  })
})
