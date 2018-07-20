import {VanEvent} from "../../types/VanEvent"
import {VanSignup} from "../../types/VanSignup"
import {Database} from "../index"
import {EventInstance} from "../models/event"
import {SignupInstance} from "../models/signup"
import Bluebird = require("bluebird")

/*********
 * SAVE
 *********/

export const saveMany = (db: Database) => (eventTrees: VanEvent[]): Promise<EventInstance[]> =>
  Promise.all(eventTrees.map(save(db)))

export const save = (db: Database) => async (eventTree: VanEvent): Promise<EventInstance> => {
  const {actionKitId} = eventTree
  const event = await db.event.findOne({ where: { actionKitId }, ...eventIncludesOf(db) })
  return event ? updateEventTree(db)(event, eventTree) : createEventTree(db)(eventTree)
}

/*********
 * CREATE
 *********/

export const createEventTrees = (db: Database) => (attrs: VanEvent[]): Promise<EventInstance[]> =>
  Promise.all(attrs.map(createEventTree(db)))

// TODO: wrap this in transaction
export const createEventTree = (db: Database) => async (eventTree: VanEvent): Promise<EventInstance> => {
  const event = await createEvent(db, eventTree)
  await createSignups(db, event, eventTree)
  return event
}

const createEvent = (db: Database, eventTree: VanEvent): Bluebird<EventInstance> =>
  db.event.create(eventTree, eventIncludesOf(db))


// TODO: try to use `bulkCreate` here (figure out assoc's)
const createSignups = (db: Database, event: EventInstance, eventTree: VanEvent): Promise<any[]> =>
  Promise.all((eventTree.signups || []).map(s => createSignup(db, s, event)))

const createSignup = async (db: Database, signup: VanSignup, event: EventInstance): Promise<SignupInstance> =>
  db.signup.create({
    ...signup,
    eventId: event.id,
    shiftId: event.shifts[0].id || await event.getShifts().then(ss => ss[0].id),
    locationId: event.locations[0] || await event.getLocations().then(ls => ls[0].id),
  }, signupIncludesOf(db))


/*********
 * UPDATE
 *********/

export const updateEventTree = (db: Database) => async (event: EventInstance, eventTree: VanEvent):
  Promise<EventInstance> => {
  await Promise.all([
    event.update(eventTree),
    updateLocations(event, eventTree),
    updateShifts(event, eventTree),
    updateSignups(db)(event, eventTree),
  ])
  return event
}

const updateLocations = (event: EventInstance, eventTree: VanEvent): Bluebird<object[]> =>
  event
    .getLocations()
    .then(locs => Promise.all(locs.map((loc, i) => loc.update(eventTree.locations[i]))))

const updateShifts = (event: EventInstance, eventTree: VanEvent): Bluebird<object[]> =>
  event
    .getShifts()
    .then(shifts => Promise.all(shifts.map((shift, i) => shift.update(eventTree.shifts[i]))))

const updateSignups = (db: Database) => (event: EventInstance, eventTree: VanEvent): Promise<any[]> =>
  Promise.all(eventTree.signups.map(updateSignup(db, event)))

const updateSignup = (db: Database, event: EventInstance) => async (vanSignup: VanSignup): Promise<any|any[]> => {
  const {actionKitId} = vanSignup
  const signup = await db.signup.findOne({ where: { actionKitId }, ...signupIncludesOf(db) })
  return !signup
    ? createSignup(db, vanSignup, event)
    : Promise.all([
      signup.update(vanSignup),
      signup.getPerson().then(p => p.update(vanSignup.person)),
    ])
}


/***********
 * HELPERS
 **********/

export const eventIncludesOf = (db: Database) => ({
  include: [
    { model: db.shift },
    { model: db.location },
  ],
})

const signupIncludesOf = (db: Database): object => ({
  include: [{ model: db.person }],
})
