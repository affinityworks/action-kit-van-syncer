import * as Bluebird from "bluebird"
import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {VanSignup, VanSignupStatus} from "../../types/VanSignup"
import {EventAttributes, EventInstance} from "./event"
import {LocationInstance} from "./location"
import {PersonInstance} from "./person"
import {ShiftInstance} from "./shift"
type Model = SequelizeStaticAndInstance["Model"]
import * as vanApi from "../../service/vanApi"
import {fromPairs, pick} from "lodash"
import * as util from "util"
import * as _ from "lodash"

export interface SignupAttributes extends AbstractAttributes, VanSignup {
  personId: number,
  eventId: number,
  locationId?: number,
  vanEventId: number,
  shiftId: number,
  vanShiftId: number,
  roleId: number,
  vanRoleId: number,
}

export interface SignupInstance extends Instance<SignupAttributes>, SignupAttributes {
  getEvent(): Bluebird<EventInstance>
  getLocation(): Bluebird<LocationInstance>
  getShift(): Bluebird<ShiftInstance>
  getPerson(): Bluebird<PersonInstance>
}

export const signupFactory = (s: Sequelize, t: DataTypes): Model => {

  const signup = s.define<SignupInstance, SignupAttributes>("signup", {
    actionKitId: t.INTEGER,
    eventSignupId: t.INTEGER,
    status: t.JSON,
    personId: t.INTEGER,
    eventId: t.INTEGER,
    vanEventId: t.INTEGER,
    shiftId: t.INTEGER,
    vanShiftId: t.INTEGER,
    role: t.JSON,
  }, {
    hooks: {
      afterCreate: postSignupToVan,
      afterUpdate: putSignupToVan,
    },
  })

  signup.associate = (db: Models) => {
    signup.belongsTo(db.event)
    signup.belongsTo(db.shift)
    signup.belongsTo(db.person)
  }

  return signup
}

// CREATE

const postSignupToVan = async (signup: SignupInstance, options: object): Promise<any> => {
  const event = await signup.getEvent()
  const eventId = event.eventId
  const eventLocations = await event.getLocations()
  const locations = eventLocations.map( eventLocation => eventLocation.locationId)
  const personId = await postPersonToVan(signup)
  const shiftId = await postShiftToVan(eventId, signup)
  const childIds = { ...fromPairs([personId, shiftId]), eventId, locationId: locations[0] }

  const signupRequest = parseVanSignupRequest(signup, childIds)
  const eventSignupId = await vanApi.createSignup(signupRequest)
  await signup.update(eventSignupId)
}

const postPersonToVan = async (signup: SignupInstance): Promise<[string, number]> => {
  const person = await signup.getPerson()
  const {vanId} = await vanApi.createPerson(person.get())
  await person.update({vanId})
  return ["vanId", vanId]
}

const postShiftToVan = async (eventId: number, signup: SignupInstance): Promise<[string, number]> => {
  const shift = await signup.getShift()
  const eventShiftId =
    shift.eventShiftId ||
    await vanApi.createShift(eventId, shift.get()).then(r => r.eventShiftId)

  await shift.update({eventShiftId})
  return ["eventShiftId", eventShiftId]
}

declare interface VanSignupChildIds {
  eventId?: number,
  eventShiftId?: number,
  vanId?: number,
  locationId?: number,
}

const parseVanSignupRequest = (signup: SignupInstance, childIds: VanSignupChildIds): VanSignupCreateRequest => {
  const { eventId, eventShiftId, vanId, locationId } = childIds
  return {
    event: { eventId },
    person: { vanId },
    location: { locationId },
    role: pick(signup.role, ["roleId"]),
    shift: { eventShiftId },
    status: pick(signup.status, ["statusId"]),
  }
}

// UPDATE

const VALID_UPDATE_FIELDS = [
  "status",
  "shiftId",
  "role",
]

const putSignupToVan = async (signup: SignupInstance) => {
  if (isUpdated(signup)) {
    const signupUpdate = await parseVanSignupUpdate(signup)
    await vanApi.updateSignup(signupUpdate)
  }
}

const isUpdated = (signup: SignupInstance) =>
  validUpdateTimestampDiff(signup)
  && hasValidChangedField(signup)

const validUpdateTimestampDiff = (signup: SignupInstance): boolean =>
  signup.createdAt.valueOf() !== signup.updatedAt.valueOf()

const hasValidChangedField = (signup): boolean =>
  VALID_UPDATE_FIELDS
    .map(field => signup.changed(field) && !_.isEqual(signup.previous(field), signup[field]))
    .some(x => x)

const parseVanSignupUpdate = async (signup: SignupInstance): Promise<VanSignupUpdateRequest> => {
  const event = await signup.getEvent()
  const eventLocations = await event.getLocations()
  const locations = eventLocations.map( eventLocation => eventLocation.locationId)
  const person = await signup.getPerson()
  const shift = await signup.getShift()

  return {
    event: {
      eventId: event.eventId,
    },
    location: {
      locationId: locations[0],
    },
    person: {
      vanId: person.vanId,
    },
    role: pick(signup.role, ["roleId"]),
    shift: {
      eventShiftId: shift.eventShiftId,
    },
    status: pick(signup.status, ["statusId"]),
    eventSignupId: signup.eventSignupId,
  }
}
