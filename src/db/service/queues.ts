import Bottleneck from "bottleneck"

export const vanQueue = new Bottleneck({
  minTime: 120,
  maxConcurrent: 1,
  id: "van",
})

export const dbQueue = new Bottleneck( {
  minTime: 50,
  maxConcurrent: 20,
  id: "db",
})
