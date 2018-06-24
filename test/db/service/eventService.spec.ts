import {expect} from "chai"
import {describe, it, before, after, beforeEach, afterEach} from "mocha"
import {initDb} from "../../../src/db"
import * as eventService from "../../../src/db/service/eventService"
import {vanEvents, vanEventTree} from "../../fixtures/vanEvent"

describe("event service", () => {
  let db
  const teardown = () =>
    Promise.all([
      db.event.destroy({where: {}}),
      db.shift.destroy({ where: {}}),
      db.location.destroy({ where: {}}),
      db.address.destroy({ where: {}}),
      db.signup.destroy({ where: {}}),
      db.person.destroy({ where: {}}),
    ])
  
  before(async () => db = initDb())
  after(async () => await db.sequelize.close())
  beforeEach(async () => await teardown())
  afterEach(async () => await teardown())
  
  it("creates an event", async () => {
    await eventService.create(db)(vanEvents[0])
    expect(await db.event.count()).to.eql(1)
  })
  
  it("creates many events", async () => {
    await eventService.createMany(db)(vanEvents)
    expect(await db.event.count()).to.eql(2)
  })
  
  it("creates an event with associations", async () => {
    await eventService.create(db)(vanEventTree[0])
    expect(await db.event.count()).to.eql(1)
    expect(await db.shift.count()).to.eql(1)
    expect(await db.location.count()).to.eql(1)
    expect(await db.address.count()).to.eql(3) // 1 for event, 2 for people
    expect(await db.signup.count()).to.eql(2)
    expect(await db.person.count()).to.eql(2)
  })
  
  it("creates many events with associations", async() => {
    await eventService.createMany(db)(vanEventTree)
    expect(await db.event.count()).to.eql(2)
    expect(await db.shift.count()).to.eql(2)
    expect(await db.location.count()).to.eql(2)
    expect(await db.address.count()).to.eql(4) // 1 for event, 2 for people
    expect(await db.signup.count()).to.eql(2)
    expect(await db.person.count()).to.eql(2)
  })
})
