import {VanEvent} from "../../types/VanEvent"
import {Database} from "../index"
import {EventInstance} from "../models/event"
import Bluebird = require("bluebird")

export const createMany = (db: Database) => (attrs: VanEvent[]): Promise<EventInstance[]> =>
  Promise.all(attrs.map(create(db)))

// TODO: wrap this in transaction
export const create = (db: Database) => async (eventTree: VanEvent): Promise<EventInstance> => {
  const event = await createEvent(db, eventTree)
  await createSignups(db, event, eventTree)
  return event
}

const createEvent = (db: Database, eventAttrs: VanEvent): Bluebird<EventInstance> =>
  db.event.create(eventAttrs, {
    include: [
      { model: db.shift },
      { model: db.location, include: [{ model: db.address }] },
    ],
  })

// TODO: try to use `bulkCreate` here (figure out assoc's)
const createSignups = (db: Database, event: EventInstance, eventTree: VanEvent): Promise<any[]> =>
  Promise.all(
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
