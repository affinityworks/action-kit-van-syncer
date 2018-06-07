import {expect} from "chai"
import {User} from "../app/entity/User"
import {createConnection} from "typeorm"
import "reflect-metadata"
import {omit} from "lodash"

describe("User", () => {

    // before((done) => {
    //     createConnection().then(done).catch(console.error)
    // })

    it("creates a User", () => {

        createConnection().then(async (connection) => {

            const userRepo = connection.getRepository(User)

            const user = new User()
            user.firstName = "Timber"
            user.lastName = "Saw"
            user.age = 25

            await userRepo.save(user)
            const users = await connection.manager.find(User)

            expect(omit(users[0], ["id"])).to.eql({
                age: 25,
                firstName: "Timber",
                lastName: "Saw",
            })
        }).catch(err => console.error(err))
    })
})
