import Bottleneck from "bottleneck"
import {getSyncLog, getTotalCreatedCount, getTotalUpdatedCount} from "../../service/syncLog"
import * as readline from "readline"

export const akQueue = new Bottleneck( {
  maxConcurrent: 20,
  id: "ak",
})
export const vanQueue = new Bottleneck({
  minTime: 120,
  maxConcurrent: 2,
  id: "van",
})

export const dbQueue = new Bottleneck( {
  minTime: 50,
  maxConcurrent: 20,
  id: "db",
})

export const vanLogQueue = new Bottleneck( {
  minTime: 100,
  maxConcurrent: 1,
  id: "vanLog",
})

vanLogQueue.on("idle", (message, data) => {
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(
    "Events: " + getSyncLog().events.created + "/" + getSyncLog().events.updated
          + " Signups: " + getSyncLog().signups.created + "/" + getSyncLog().signups.updated
          + " People: " + getSyncLog().people.created + "/" + getSyncLog().people.updated + "\r",
  )
})
