import "reflect-metadata"
import {createConnection} from "typeorm"
import {User} from "./entity/User"

createConnection().then(async (connection) => {

    const user = new User()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    await connection.manager.save(user)

    // console.log("Loading users from the database...");
    const users = await connection.manager.find(User)
    // console.log("Loaded users: ", users);

    // console.log("Here you can setup and run express/koa/any other framework.");

}).catch((error) => console.error(error))
