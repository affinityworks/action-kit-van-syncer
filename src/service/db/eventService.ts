import {Database} from "../../db"
import {EventAttributes, EventInstance} from "../../models/Event"
import Bluebird = require("bluebird")

export const create = (db: Database, attrs: EventAttributes): Bluebird<EventInstance> =>
  db.Event.create(attrs)

export const createMany = (db: Database, attrs: EventAttributes[]): Bluebird<EventInstance[]> =>
  db.Event.bulkCreate(attrs)
