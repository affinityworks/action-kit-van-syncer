import {getEventTrees} from "./service/actionKitAPI"
import {parseVanEvents} from "../src/service/parse"
import {initDb} from "../src/db"
import * as eventService from "../src/db/service/eventService"

export const sync = async (db = initDb()) => {
  const eventTrees = await getEventTrees()
  const vanEventTrees = parseVanEvents(eventTrees)
  await eventService.saveMany(db)(vanEventTrees)
}

// (async () => {
//   sync()
// })()
