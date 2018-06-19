import "reflect-metadata"
import {createConnection} from "typeorm"
import {dev} from "../config"
import {User} from "./entity/User"

(async () => {
  try {
    console.log("running...")

    const connection = await createConnection(dev.db)
    const userRepo = connection.getRepository(User)
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
