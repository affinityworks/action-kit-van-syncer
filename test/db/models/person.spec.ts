import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, omit, map, cloneDeep} from "lodash"
import {PersonInstance} from "../../../src/db/models/person"
import {vanEventTree} from "../../fixtures/vanEvent"

describe("Person model", () => {
  const personAttrs = cloneDeep(vanEventTree[0].signups[1].person)
  let db: Database, person: PersonInstance

  before(async () => {
    db = initDb()
    person = await db.person.create(personAttrs)
  })

  after(async () => {
    await db.person.destroy({where: {}})
    await db.sequelize.close()
  })

  describe("fields", () => {

    it("has correct fields", () => {
      expect(keys(person.get()).sort()).to.eql([
        "actionKitId",
        "addresses",
        "createdAt",
        "emails",
        "firstName",
        "id",
        "lastName",
        "middleName",
        "phones",
        "salutation",
        "suffix",
        "updatedAt",
        "vanId",
      ].sort())
    })

    it("saves correct fields", () => {
      expect(pick(person, keys(personAttrs))).to.eql(personAttrs)
    })
  })
})
