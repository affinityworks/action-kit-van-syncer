import {describe, it, before, after, beforeEach, afterEach} from "mocha"
import {expect} from "chai"
import {Database, initDb} from "../../../src/db"
import {keys, pick, cloneDeep, omit} from "lodash"
import {PersonInstance} from "../../../src/db/models/person"
import {signupAttrs} from "../../fixtures/vanSignup"
import * as nock from "nock"
import * as chai from "chai"
import * as sinonChai from "sinon-chai"
import {vanApiRandomStubOf, vanApiStubOf} from "../../support/spies"
import sinon from "ts-sinon"
import {locationAttrs} from "../../fixtures/vanLocation"

describe("Person model", () => {
  chai.use(sinonChai)
  nock.disableNetConnect()
  const sandbox = sinon.createSandbox()

  const personAttrs = cloneDeep(signupAttrs.person)
  let db: Database, person: PersonInstance, updatePersonStub

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

  describe("on update", () => {
    beforeEach(async () => {
      updatePersonStub = vanApiRandomStubOf(sandbox, "updatePerson", "vanId")
    })

    afterEach(async () => {
      sandbox.restore()
    })

    describe("makes update call to VAN", () => {
      it("updates person to VAN", async () => {
        await person.update({ firstName: "Petr" })
        expect(updatePersonStub).to.have.been.calledOnce
      })

      describe("nested field changed", () => {

        it("phones changed", async () => {
          const phones = [{
            normalized_phone: "6152239999",
            phone: "6152239999",
            type: "home",
          }]

          await person.update({ ...person.get(), phones })
          expect(updatePersonStub.getCall(0).args[0].phones).to.eql(phones)
        })

        it("emails changed", async () => {
          const emails = [{ email: "test@test.com", type: "P" }]

          await person.update({ ...person.get(), emails })
          expect(updatePersonStub.getCall(0).args[0].emails).to.eql(emails)
        })

        it("addresses changed", async () => {
          const addresses = [locationAttrs[0].address]

          await person.update({ ...person.get(), addresses })
          expect(updatePersonStub.getCall(0).args[0].addresses).to.eql(addresses)
        })
      })
    })

    it("does not make VAN call if nothing changed", async () => {
      await person.update(person.get())
      expect(updatePersonStub).to.have.not.been.called
    })
  })
})
