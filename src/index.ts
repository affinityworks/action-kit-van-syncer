import {getEventTrees} from "./service/actionKitAPI"
import {parseVanEvents} from "../src/service/parse"
import {initDb} from "../src/db"
import { saveMany } from "../src/db/service/eventService"
import {repeatEvery} from "../test/support/time"

export const sync = async (db = initDb()) => {
  console.log(`[AK2VAN SYNC STARTED][${Date.now()}]`)
  console.log(`[AK FETCH STARTED]`)
  const eventTrees = await getEventTrees()
  console.log(`[AK FETCH COMPLETE]`)
  console.log(eventTrees)
  console.log(`[AK2VAN PARSE STARTED]`)
  const vanEventTrees = parseVanEvents(eventTrees)
  console.log(vanEventTrees)
  console.log(`[AK2VAN PARSE COMPLETE]`)
  console.log("[VAN SYNC STARTED]")
  await saveMany(db)(vanEventTrees)
  console.log("[VAN SYNC COMPLETE]")
  console.log(`[AK2VAN SYNC COMPLETE][${Date.now()}]`)
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
