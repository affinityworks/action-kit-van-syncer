import {expect} from "chai"
import {describe, it, before, after, beforeEach, afterEach} from "mocha"
import {initDb} from "../../../src/db"
import * as eventService from "../../../src/db/service/eventService"
import {vanEvents, vanEventTree} from "../../fixtures/vanEvent"
import {cloneDeep} from "lodash"

describe("event service", () => {
  const eventsAttrs = cloneDeep(vanEvents)
  const eventTreeAttrs = cloneDeep(vanEventTree)
  let db
  
  before(async () => db = initDb())
  afterEach(async () => {
    await db.event.destroy({where: {}})
    await db.location.destroy({where: {}})
    await db.address.destroy({where: {}})
    await db.shift.destroy({where: {}})
    await db.signup.destroy({where: {}})
    await db.person.destroy({where: {}})
  })
  after(async () => await db.sequelize.close())
  
  it("creates an event", async () => {
    await eventService.create(db)(eventsAttrs[0])
    expect(await db.event.count()).to.eql(1)
  })
  
  it("creates many events", async () => {
    await eventService.createMany(db)(eventsAttrs)
    expect(await db.event.count()).to.eql(2)
  })
  
  it("creates an event with associations", async () => {
    await eventService.create(db)(eventTreeAttrs[0])
    expect(await db.event.count()).to.eql(1)
    expect(await db.shift.count()).to.eql(1)
    expect(await db.location.count()).to.eql(1)
    expect(await db.address.count()).to.eql(3) // 1 for event, 2 for people
    expect(await db.signup.count()).to.eql(2)
    expect(await db.person.count()).to.eql(2)
  })
  
  it("creates many events with associations", async () => {
    await eventService.createMany(db)(eventTreeAttrs)
    expect(await db.event.count()).to.eql(2)
    expect(await db.shift.count()).to.eql(2)
    expect(await db.location.count()).to.eql(2)
    expect(await db.address.count()).to.eql(4) // 1 for event, 2 for people
    expect(await db.signup.count()).to.eql(2)
    expect(await db.person.count()).to.eql(2)
  })
})
