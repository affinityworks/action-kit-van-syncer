import * as Bluebird from "bluebird"
import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {VanSignup} from "../../types/VanSignup"
import {EventInstance} from "./event"
import {LocationInstance} from "./location"
import {PersonInstance} from "./person"
import {ShiftInstance} from "./shift"
type Model = SequelizeStaticAndInstance["Model"]

export interface SignupAttributes extends AbstractAttributes, VanSignup {
  personId: number,
  eventId: number,
  vanEventId: number,
  shiftId: number,
  vanShiftId: number,
  roleId: number,
  vanRoleId: number,
  locationId: number
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
    locationId: t.INTEGER,
  })

  signup.associate = (db: Models) => {
    signup.belongsTo(db.event)
    signup.belongsTo(db.location)
    signup.belongsTo(db.shift)
    signup.belongsTo(db.person)
  }

  return signup
}
