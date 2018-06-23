import {Database} from "../index"
import {EventAttributes, EventInstance} from "../models/event"
import Bluebird = require("bluebird")

export const create = (db: Database, attrs: EventAttributes): Bluebird<EventInstance> =>
  db.event.create(attrs)

export const createMany = (db: Database, attrs: EventAttributes[]): Bluebird<EventInstance[]> =>
  db.event.bulkCreate(attrs)
