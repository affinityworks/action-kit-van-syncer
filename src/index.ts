import {getEventTrees} from "./service/actionKitAPI"
import {parseVanEvents} from "../src/service/parse"
import {initDb} from "../src/db"
import * as eventService from "../src/db/service/eventService"
import {repeatEvery} from "../test/support/time"

export const sync = async (db = initDb()) => {
  console.log("[SYNC STARTED] ", Date.now())
  const eventTrees = await getEventTrees()
  const vanEventTrees = parseVanEvents(eventTrees)
  await eventService.saveMany(db)(vanEventTrees)
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const THIRTY_SECONDS = 30 * SECOND
const EIGHT_HOURS = 8 * HOUR

export const repeatSync = async () => {
  repeatEvery(THIRTY_SECONDS, await sync) // TODO: Change to EIGHT_HOURS for prod
}

// (async () => {
//   repeatSync()
// })()
