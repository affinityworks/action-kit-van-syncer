export const wait = interval =>
  new Promise((rslv, _) => setTimeout(rslv, interval))

export const repeatEvery = (interval, fn, limit = null, count = 0) =>
  ((!limit) || (limit && count < limit)) ?
    Promise
      .resolve(fn())
      .then(() => wait(interval))
      .then(() => repeatEvery(interval, fn, limit, count + 1)) :
    Promise.resolve()