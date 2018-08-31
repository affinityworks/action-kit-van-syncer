const defaultLog = {
  syncStart: null,
  syncEnd: null,
  totalSyncTime: null,
  people: {
    created: 0,
    updated: 0,
  },
  events: {
    created: 0,
    updated: 0,
  },
  signups: {
    created: 0,
    updated: 0,
  },
}

let syncLog = defaultLog

export const startSyncLog = (now) => {
  syncLog = {
    ...syncLog,
    syncStart: now,
    syncEnd: now,
  }
}

export const updateSyncCounts = async (resource, action) => {
  const now = new Date(Date.now())
  syncLog = {
    ...syncLog,
    [resource]: { ...syncLog[resource], [action]: syncLog[resource][action] + 1 },
    syncEnd: now.toString(),
    totalSyncTime: calcSyncTime(Date.parse(now.toString()) - Date.parse(syncLog.syncStart)),
  }
}

export const printSyncLog = () => {
  if (isNotFirstSync()) {
    console.log("\n[LAST SYNC RESULTS]")
    console.log(JSON.stringify(getSyncLog(), null, 4))
    resetSyncLog()
  }
}

export const getSyncLog = () => syncLog

const resetSyncLog = () => syncLog = defaultLog

const isNotFirstSync = () => !!(syncLog.syncStart && syncLog.syncEnd)

const calcSyncTime = (ms) => {
  const syncDate = new Date(ms)
  return syncDate.getUTCMinutes() + " minute(s)"
}

export const getTotalCreatedCount = () => {
  return syncLog.people.created + syncLog.signups.created + syncLog.events.created
}

export const getTotalUpdatedCount = () => {
  return syncLog.people.updated + syncLog.signups.updated + syncLog.events.updated
}
