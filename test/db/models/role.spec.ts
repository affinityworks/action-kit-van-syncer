import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, clone} from "lodash"
import {EventInstance} from "../../../src/db/models/event"
import {RoleInstance} from "../../../src/db/models/role"

import {vanEventTree} from "../../fixtures/vanEvent"

describe("Role model", () => {
  const eventAttrs = vanEventTree[0]
  const roleAttrs = vanEventTree[0].roles[0]
  let db: Database, role: RoleInstance, event: EventInstance

  before(async () => {
    db = initDb()
    event = await db.event.create(eventAttrs)
    role = await db.role.create({
      ...roleAttrs,
      rolable: "event",
      rolableId: event.id,
      include: [{model: db.event }],
    })
  })

  after(async () => {
    await db.role.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has correct fields", () => {
      expect(keys(role.get()).sort()).to.eql([
        "id",
        "name",
        "isEventLead",
        "updatedAt",
        "createdAt",
        "roleId",
        "min",
        "max",
        "goal",
        "rolable",
        "rolableId",
      ].sort())
    })

    it("saves correct fields", () => {
      expect(pick(role, keys(roleAttrs))).to.eql(roleAttrs)
    })
  })

  describe("associations", async () => {
    it("belongs to an event", async () => {
      const e = await role.getEvent()
      expect(e.get()).to.eql(event.get())
    })
  })
})
