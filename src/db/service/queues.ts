import Bottleneck from "bottleneck"

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
