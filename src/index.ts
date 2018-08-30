import {getEventTrees} from "./service/actionKitAPI"
import {parseVanEvents} from "../src/service/parse"
import {initDb} from "../src/db"
import {saveMany} from "../src/db/service/eventService"
import {repeatEvery} from "../test/support/time"
import {printSyncLog, startSyncLog} from "./service/syncLog"

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const EIGHT_HOURS = 8 * HOUR

export const sync = async (db = initDb()) => {
  printSyncLog()

  const now = new Date(Date.now())
  console.log(`[AK2VAN SYNC STARTED][${now}]`)
  startSyncLog(now.toString())

  console.log(`[AK FETCH STARTED]`)
  const eventTrees = await getEventTrees()
  console.log(`[AK FETCH COMPLETE]`)

  console.log(`[AK2VAN PARSE STARTED]`)
  const vanEventTrees = parseVanEvents(eventTrees)
  console.log(`[AK2VAN PARSE COMPLETE]`)

  console.log("[VAN SYNC STARTED]")
  await saveMany(db)(vanEventTrees)
}

export const repeatSync = async () => {
  repeatEvery(EIGHT_HOURS, await sync)
}

(async () => {
  if (process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production") {
    repeatSync()
  }
})()
