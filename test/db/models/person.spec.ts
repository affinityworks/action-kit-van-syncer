import {describe, it, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, cloneDeep, omit} from "lodash"
import {PersonInstance} from "../../../src/db/models/person"
import {signupAttrs} from "../../fixtures/vanSignup"
import * as nock from "nock"

describe("Person model", () => {
  nock.disableNetConnect()
  const personAttrs = cloneDeep(signupAttrs.person)
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
      const omitKeys = ["updatedAt", "createdAt"]
      expect(omit(pick(person, keys(personAttrs)), omitKeys)).to.eql(omit(personAttrs, omitKeys))
    })
  })
})
