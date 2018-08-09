import * as chai from "chai"
import {expect} from "chai"
import * as sinonChai from "sinon-chai"
import * as nock from "nock"
import {cloneDeep, keys, pick} from "lodash"
import {after, before, beforeEach, describe, it} from "mocha"
import sinon from "ts-sinon"

import {Database, initDb} from "../../../src/db"
import {EventInstance} from "../../../src/db/models/event"
import {SignupInstance} from "../../../src/db/models/signup"
import {vanEventTree} from "../../fixtures/vanEvent"
import {vanApiStubNoResponse, vanApiStubOf} from "../../support/spies"
import {signupAttrs} from "../../fixtures/vanSignup"
import * as signupModel from "../../../src/db/models/signup"

describe("Signup model", () => {
  nock.disableNetConnect()
  chai.use(sinonChai)
  const defaultEventAttrs = cloneDeep(vanEventTree[0])
  const personAttrs = signupAttrs.person
  const sandbox = sinon.createSandbox()
  
  let db: Database,
    event: EventInstance,
    signup: SignupInstance,
    createSignupStub: sinon.SinonStub,
    createPersonStub: sinon.SinonStub,
    createEventStub: sinon.SinonStub,
    createShiftStub: sinon.SinonStub,
    createLocationStub: sinon.SinonStub,
    updateSignupStub: sinon.SinonStub,
    parseVanSignupStub: sinon.SinonStub

  const setup = async (eventAttrs = defaultEventAttrs) => {
    db = initDb()

    createSignupStub = vanApiStubOf(sandbox, "createSignup", { eventSignupId: 1000000 })
    createPersonStub = vanApiStubOf(sandbox, "createPerson", { vanId: 1000000 })
    createEventStub = vanApiStubOf(sandbox, "createEvent", { eventId: 1000000 })
    createShiftStub = vanApiStubOf(sandbox, "createShift", { eventShiftId: 1000000 })
    createLocationStub = vanApiStubOf(sandbox, "createLocation", { locationId: 1000000 })

    updateSignupStub = vanApiStubNoResponse(sandbox, "updateSignup")

    event = await db.event.create(eventAttrs, {
      include: [{ model: db.shift }, { model: db.location }],
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
    sandbox.restore()
    
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
      expect(p.get("id")).to.eql(personAttrs.id)
    })
  })

  describe("hooks", () => {

    describe("on creation", () => {
      
      describe("when all resources are new", () => {

        before(async () => await setup())
        after(async () => await teardown())
  
        it("posts nested person to VAN", async () => {
          const person = await signup.getPerson()
          expect(createPersonStub).to.have.been.calledWith(person.get())
        })
  
        it("saves VAN person id to db", async () => {
          expect(await db.person.findOne({ where: { vanId: 1000000 }})).to.exist
        })
  
        it ("posts nested shift to VAN", async () => {
          const shift = await signup.getShift()
          expect(createShiftStub.getCall(0).args).to.eql([1000000, shift.get()])
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

    describe("on update", () => {

      describe("validate update", () => {

        before(async () => {
          await setup()
          parseVanSignupStub = sandbox.stub(signupModel, "parseVanSignupUpdate")
        })

        beforeEach(() => {
          updateSignupStub.restore()
          updateSignupStub = vanApiStubNoResponse(sandbox, "updateSignup")
        })

        after(async () => await teardown())

        it("updates signup in VAN when status field is updated", async () => {
          await signup.update({ status: { statusId: 5,  name: "SuperCoolStatus" } })
          expect(updateSignupStub).to.have.been.calledOnce
        })

        it("updates signup in VAN when shiftId field is updated", async () => {
          await signup.update({ shiftId: 1234 })
          expect(updateSignupStub).to.have.been.calledOnce
        })

        it("updates signup in VAN when role field is updated", async () => {
          await signup.update({ role: { roleId: 20000, name: "Medic" } })
          expect(updateSignupStub).to.have.been.calledOnce
        })

        it("does not update in VAN when eventSignupId is updated", async () => {
          await signup.update({ eventSignupId: 12345 })
          expect(updateSignupStub).to.not.have.been.called
        })
      })

      describe("parseVanSignupUpdate", () => {
        before(async () => {
          await setup()
        })

        beforeEach(() => {
          updateSignupStub.restore()
          updateSignupStub = vanApiStubNoResponse(sandbox, "updateSignup")
        })

        after(async () => await teardown())

        it("formats the update correctly", async () => {
          await signup.update({
            role: { roleId: 100310, name: "Medic" },
            status: { statusId: 5,  name: "SuperCoolStatus" },
          })

          expect(updateSignupStub.getCall(0).args[0]).to.eql({
            event: { eventId: 1000000 },
            eventSignupId: 1000000,
            person: { vanId: 1000000 },
            location: { locationId: 1000000 },
            role: { roleId: 100310 },
            shift: { eventShiftId: 1000000 },
            status: { statusId: 5 },
          })
        })
      })
    })
  })
})
