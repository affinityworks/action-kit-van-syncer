import {expect} from "chai"
import * as chai from "chai"
import {describe, it, before, after, beforeEach, afterEach} from "mocha"
import {initDb} from "../../../src/db"
import {createEventTree, eventIncludesOf} from "../../../src/db/service/eventService"
import * as eventService from "../../../src/db/service/eventService"
import {VanEvent} from "../../../src/types/VanEvent"
import {vanEvents, vanEventTree} from "../../fixtures/vanEvent"
import {cloneDeep, find} from "lodash"
import * as nock from "nock"
import * as sinonChai from "sinon-chai"
import sinon from "ts-sinon"
import {vanApiRandomStubOf, vanApiStubNoResponse, vanApiStubOf} from "../../support/spies"
import {wait} from "../../support/time"

describe("event service", () => {
  nock.disableNetConnect()
  chai.use(sinonChai)

  let db, createEventStub, createLocationStub, createPersonStub, createShiftStub, createSignupStub, updateEventStub
  const sandbox = sinon.createSandbox()
  const eventsAttrs = cloneDeep(vanEvents)
  const oldEventTrees = cloneDeep(vanEventTree)
  const oldEventTree = oldEventTrees[0]
  const newEventTree = {
    ...oldEventTree,
    name: "very new name",
    locations: [
      {...oldEventTree.locations, name: "very new name"},
      ...oldEventTree.locations.slice(1),
    ],
    shifts: [
      {...oldEventTree.shifts[0], name: "very new name"},
      ...oldEventTree.shifts.slice(1),
    ],
    signups: [
      {
        ...oldEventTree.signups[0],
        status: { statusId: 3, name: "Declined" },
        person: {
          ...oldEventTree.signups[0].person,
          firstName: "very new name",
        },
      },
      ...oldEventTree.signups.slice(1),
    ],
  }
  const newEventTrees = [newEventTree, oldEventTrees[1]]
  const newEventTreeWithNewSignup: VanEvent = {
    ...oldEventTree,
    signups: [
      ...oldEventTree.signups,
      {
        actionKitId: 10000000,
        status: { statusId: 4, name: "Invited"  },
        role:   {
          roleId: 198854,
          name: "Canvasser",
        },
        person: {
          actionKitId: 10000000,
          salutation: "",
          firstName: "Tyrone",
          middleName: "",
          lastName: "Slothrop",
          suffix: "",
          addresses: [
            {
              addressLine1: "111 Main St",
              addressLine2: "",
              city: "Ridgewood",
              stateOrProvince: "NY",
              zipOrPostalCode: "11385",
              countryCode: "US",
              type: "Home",
            },
          ],
          emails: [{ email: "tyrone@riseup.net", type: "P"}],
          phones: [],
        },
      },
    ],
  }

  before(async () => {
    db = initDb()
    await destroyAll()
  })

  beforeEach(() => {
    createEventStub = vanApiRandomStubOf(sandbox, "createEvent", "eventId")
    createShiftStub = vanApiRandomStubOf(sandbox, "createShift", "eventShiftId")
    createLocationStub = vanApiRandomStubOf(sandbox, "createLocation", "locationId")
    createPersonStub = vanApiRandomStubOf(sandbox, "createPerson", "vanId")
    createSignupStub = vanApiRandomStubOf(sandbox, "createSignup", "eventSignupId")

    updateEventStub = vanApiStubNoResponse(sandbox, "updateEvent")
  })

  afterEach(async () => {
    sandbox.restore()
    await destroyAll()
  })

  const destroyAll = async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
  }

  after(async () => {
    sandbox.restore()
    await db.sequelize.close()
  })

  describe("saving event trees", async () => {

    let createSpy, updateSpy
    beforeEach(() => {
      createSpy = sandbox.spy(eventService, "createEventTree")
      updateSpy = sandbox.spy(eventService, "updateEventTree")
    })
    afterEach(async () => {
      createSpy.restore()
      updateSpy.restore()
    })

    it("creates event trees if they do not exist",async () => {
      await eventService.saveMany(db)(oldEventTrees)
      await wait(500)
      expect(createSpy).to.have.been.calledTwice
      expect(updateSpy).not.to.have.been.called
    })

    it("updates an event if it already exists", async function() {
      this.timeout(0)
      await eventService.saveMany(db)(oldEventTrees)
      await wait(500)
      await eventService.saveMany(db)(newEventTrees)
      await wait(500)
      expect(createSpy).to.have.been.calledTwice
      expect(updateSpy).to.have.been.calledTwice
    })
  })

  describe("creating an event tree", () => {

    it("creates an event", async () => {
      await eventService.createEventTree(db)(eventsAttrs[0])
      await wait(500)
      expect(await db.event.count()).to.eql(1)
    })

    it("creates many events", async () => {
      await eventService.createEventTrees(db)(eventsAttrs)
      await wait(500)
      expect(await db.event.count()).to.eql(2)
    })

    it("creates an event with associations", async () => {
      await eventService.createEventTree(db)(oldEventTrees[0])
      await wait(500)
      expect(await db.event.count()).to.eql(1)
      expect(await db.shift.count()).to.eql(1)
      expect(await db.location.count()).to.eql(1)
      expect(await db.signup.count()).to.eql(2)
      expect(await db.person.count()).to.eql(2)
    })
  })

  // TODO: Fix these tests
  describe("updating an event tree", async () => {

    let event, updatedEvent

    it("updates a nested location", async () => {
      event = await eventService.createEventTree(db)(oldEventTrees[0])
      await wait(500)
      updatedEvent = await eventService.updateEventTree(db)(event, newEventTree)
      await wait(500)
      const name = await updatedEvent.getLocations().then(locs => locs[0].name)
      expect(name).to.eql("very new name")
    })

    it("updates a nested shift", async () => {
      event = await eventService.createEventTree(db)(oldEventTrees[0])
      await wait(500)
      updatedEvent = await eventService.updateEventTree(db)(event, newEventTree)
      await wait(500)
      expect(await updatedEvent.getShifts().then(shifts => shifts[0].name)).to.eql("very new name")
    })

    it("updates a nested signup", async () => {
      event = await eventService.createEventTree(db)(oldEventTrees[0])
      await wait(500)
      updatedEvent = await eventService.updateEventTree(db)(event, newEventTree)
      await wait(500)
      const signup = await updatedEvent
        .getSignups()
        .then(signups => find(signups, { actionKitId: oldEventTrees[0].signups[0].actionKitId }))

      expect(signup.status).to.eql({ statusId: 3, name: "Declined" })
    })

    it("creates a new signup", async () => {
      event = await eventService.createEventTree(db)(oldEventTrees[0])
      await wait(500)
      updatedEvent = await eventService.updateEventTree(db)(event, newEventTree)
      await wait(500)
      expect(await db.signup.count()).to.eql(2)
      const e = await  db.event.findOne({ where: { id: event.id }, ...eventIncludesOf(db) })
      await eventService.updateEventTree(db)(e, newEventTreeWithNewSignup)
      expect(await db.signup.count()).to.eql(3)
    })

    it("updates a nested person", async () => {
      event = await eventService.createEventTree(db)(oldEventTrees[0])
      await wait(500)
      updatedEvent = await eventService.updateEventTree(db)(event, newEventTree)
      await wait(500)
      const person = await updatedEvent
        .getSignups()
        .then(signups =>
          find(
            signups, { actionKitId: oldEventTrees[0].signups[0].actionKitId }
            ).getPerson(),
        )
      expect(person.firstName).to.eql("very new name")
    })
  })
})
