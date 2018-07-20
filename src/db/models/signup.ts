import * as Bluebird from "bluebird"
import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {VanSignup, VanSignupStatus} from "../../types/VanSignup"
import {EventAttributes, EventInstance} from "./event"
import {LocationInstance} from "./location"
import {PersonInstance} from "./person"
import {ShiftInstance} from "./shift"
type Model = SequelizeStaticAndInstance["Model"]
import * as vanApi from "../../api/vanApi"
import {fromPairs, pick} from "lodash"

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
    },
  })

  signup.associate = (db: Models) => {
    signup.belongsTo(db.event)
    signup.belongsTo(db.shift)
    signup.belongsTo(db.person)
  }

  return signup
}

const postSignupToVan = (signup: SignupInstance, options: object): Promise<any> =>
  Promise.all([
    postEventToVan(signup),
    postPersonToVan(signup),
    postShiftToVan(signup),
  ])
    .then(fromPairs)
    .then(childIds => vanApi.createSignup(parseVanSignupRequest(signup, childIds)))
    .then(({eventSignupId}) => signup.update({eventSignupId}))

const postEventToVan = async (signup: SignupInstance): Promise<[string, number]> => {
  const event = await signup.getEvent()
  const eventId =
    event.eventId ||
    await vanApi.createEvent(event.get()).then(r => r.eventId)
  await event.update({eventId})
  return ["eventId", eventId]
}

const postPersonToVan = async (signup: SignupInstance): Promise<[string, number]> => {
  const person = await signup.getPerson()
  const {vanId} = await vanApi.createPerson(person.get())
  await person.update({vanId})
  return ["vanId", vanId]
}

const postShiftToVan = async (signup: SignupInstance): Promise<[string, number]> => {
  const shift = await signup.getShift()
  const eventShiftId =
    shift.eventShiftId ||
    await vanApi.createShift(shift.get()).then(r => r.eventShiftId)
  await shift.update({eventShiftId})
  return ["eventShiftId", eventShiftId]
}

declare interface VanSignupChildIds {
  eventId?: number,
  eventShiftId?: number,
  vanId?: number,
}

const parseVanSignupRequest = (signup: SignupInstance, childIds: VanSignupChildIds): VanSignupCreateRequest => {
  const {eventId, eventShiftId, vanId } = childIds
  return {
    event: { eventId },
    person: { vanId },
    role: pick(signup.role, ["roleId"]),
    shift: { eventShiftId },
    status: pick(signup.status, ["statusId"]),
  }
}
