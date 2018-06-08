
import {expect} from "chai"
import {User} from "../app/entity/User"
import {createConnection, getRepository} from "typeorm"
import {clone, omit} from "lodash"

describe("User", () => {
  let userRepo

  before(async () => {
    await createConnection()
    userRepo = getRepository(User)
  })
  after( async () => await userRepo.delete({})) // delete all users

  it("starts with an empty repo", async () => {
      expect(await userRepo.count()).to.equal(0)
  })

  describe("creating a user", () => {
    // NOTE on setup
    // - `create` doesn't save by default (:. we call `save` directly instead of `create` then `save`)
    // - `save` borrows reference to its arg and will mutate it (:. we clone `sampleUser` before passing)
    const sampleUser = { firstName: "Timber", lastName: "Saw", age: 25 }
    before(async () => await userRepo.save(clone(sampleUser)))
    after(async () => await userRepo.delete(sampleUser))

    it("creates a User", async () => {
      expect(await userRepo.count()).to.equal(1)
    })

    it("creates user with correct fields", async () => {
      expect(omit(await userRepo.findOne(), ["id"])).to.eql(sampleUser)
    })

    it("finds a user by name", async () => {
      expect(omit(await userRepo.findOne({ firstName: "Timber" }), ["id"])).to.eql(sampleUser)
    })
  })
})
