import {expect} from "chai"
import {cloneDeep, keys, pick} from "lodash"
import {after, before, beforeEach, afterEach, describe, it} from "mocha"
import {createShift} from "../../../src/api/vanApi"
import {Database, initDb} from "../../../src/db"
import {EventInstance} from "../../../src/db/models/event"
import {SignupInstance} from "../../../src/db/models/signup"
import {vanEventTree} from "../../fixtures/vanEvent"
import sinon from "ts-sinon"
import * as chai from "chai"
import * as sinonChai from "sinon-chai"
import {vanApiStubOf} from "../../support/spies"

describe("Signup model", () => {
  chai.use(sinonChai)
  const defaultEventAttrs = cloneDeep(vanEventTree[0])
  const personAttrs = defaultEventAttrs.signups[0].person
  const signupAttrs = defaultEventAttrs.signups[0]
  
  let db: Database,
    event: EventInstance,
    signup: SignupInstance,
    createSignupStub: sinon.SinonStub,
    createPersonStub: sinon.SinonStub,
    createEventStub: sinon.SinonStub,
    createShiftStub: sinon.SinonStub

  const setup = async (eventAttrs = defaultEventAttrs) => {

    db = initDb()

    createSignupStub = vanApiStubOf("createSignup", { eventSignupId: 1000000 })
    createPersonStub = vanApiStubOf("createPerson", { vanId: 1000000 })
    createEventStub = vanApiStubOf("createEvent", { eventId: 1000000 })
    createShiftStub = vanApiStubOf("createShift", { eventShiftId: 1000000 })

    event = await db.event.create(eventAttrs, {
      include: [{ model: db.shift }],
    })

    signup = await db.signup.create({
      ...signupAttrs,
      eventId: event.id,
      shiftId: event.shifts[0].id,
      person: personAttrs,
    }, {
      include: [{ model: db.person }],
    })
  }

  const teardown = async () => {
    createEventStub.restore()
    createSignupStub.restore()
    createPersonStub.restore()
    createShiftStub.restore()
    
    await db.event.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
    await db.sequelize.close()
  }

  describe("fields", async () => {
  
    before(async () => await setup())
    after(async () => await teardown())

    it("has correct fields", () => {
      expect(keys(signup.get()).sort()).to.eql([
        "actionKitId",
        "createdAt",
        "eventId",
        "eventSignupId",
        "id",
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
  
    before(async () => await setup())
    after(async () => await teardown())

    it("belongs to an event", async () => {
      const e = await signup.getEvent()
      expect(e.get("id")).to.eql(event.id)
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
      
      describe("when all resources are new", () => {

        before(async () => await setup())
        after(async () => await teardown())

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
  
        it("posts signup with all nested resources to VAN", () => {
          expect(
            pick(
              createSignupStub.getCall(0).args[0],
              [
                "event",
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
      
      describe("when nested event already exists in VAN", () => {

        before(async () => await setup({
          ...defaultEventAttrs,
          eventId: 1000001,
          shifts: [{...defaultEventAttrs.shifts[0], eventShiftId: 1000001 }],
        }))
        after(teardown)

        it("does not POST event to VAN", () => {
          expect(createEventStub).not.to.have.been.called
        })

        it("does not POST shift to VAN", () => {
          expect(createShiftStub).not.to.have.been.called
        })
      })
      
      describe("when nested shift already exists in VAN", () => {

        it("does not POST shift to VAN")
      })
    })
  })
})
