import {Database} from "../index"
import {EventAttributes, EventInstance} from "../models/event"

export const create = (db: Database) => async (eventTree: EventAttributes): Promise<EventInstance> => {

  // TODO: would be nice to wrap this all in a transaction
  const event = await db.event.create(eventTree, {
    include: [
      { model: db.shift },
      { model: db.location, include: [{ model: db.address }] },
    ],
  })

  // TODO: would be nice to use `bulkCreate` here, but can't include associations in that func
  await Promise.all(
    (eventTree.signups || []).map(
      signup => db.signup.create({
        ...signup,
        eventId: event.id,
        shiftId: event.shifts[0].id,
        locationId: event.locations[0].id,
        person: signup.person,
      }, {
        include: [{ model: db.person, include: [{ model: db.address }]}],
      }),
    ),
  )

  return event
}

export const createMany = (db: Database) => (attrs: EventAttributes[]): Promise<EventInstance[]> =>
  Promise.all(attrs.map(create(db)))
