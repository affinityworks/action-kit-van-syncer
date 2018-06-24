import {describe, it, test, before, after} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, omit, map, cloneDeep} from "lodash"
import {PersonInstance} from "../../../src/db/models/person"
import {vanEventTree} from "../../fixtures/vanEvent"

describe("Person model", () => {
  const personAttrs = cloneDeep(vanEventTree[0].signups[1].person)
  const addressesAttrs = personAttrs.addresses
  let db: Database, person: PersonInstance

  before(async () => {
    db = initDb()
    person = await db.person.create({
      ...personAttrs,
      addresses: addressesAttrs,
    }, {
      include: [{ model: db.address }],
    })
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
      expect(pick(person, keys(omit(personAttrs, ["addresses"]))))
        .to.eql(omit(personAttrs, ["addresses"]))
    })
  })

  describe("associations", () => {
    it("has many addresses", async () => {
      const as = await person.getAddresses()
      map(as, (a, i) =>
        expect(pick(a.get(), keys(addressesAttrs[i])))
          .to.eql(addressesAttrs[i]),
      )
    })
  })

  describe ("hooks", async () => {

    describe("on delete", async () => {
      let count
      before(async () => {
        count = await db.address.count()
        await person.destroy()
      })

      it ("deletes associated addresses", async () => {
        expect(await db.address.count()).to.eql(count - 1)
      })
    })
  })
})
