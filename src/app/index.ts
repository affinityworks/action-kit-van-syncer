import "reflect-metadata"
import {createConnection, getRepository} from "typeorm"
import {User} from "./entity/User"

(async () => {
  try {
    console.log("running...")

    await createConnection()
    const userRepo = getRepository(User)
    await userRepo.save({
      firstName: "Foo",
      lastName: "Bar",
      age: 25,
    })

    console.log("Loaded users: ", await userRepo.find())

  } catch (e) {
    console.error(e)
  }
})()
