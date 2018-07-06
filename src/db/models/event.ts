import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {VanEvent} from "../../types/VanEvent"
import {VanSignup} from "../../types/VanSignup"
import {LocationAttributes, LocationInstance} from "./location"
import {ShiftAttributes, ShiftInstance} from "./shift"
import {SignupAttributes} from "./signup"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface EventAttributes extends AbstractAttributes, VanEvent {
  locations?: LocationAttributes[],
  shifts?: ShiftAttributes[],
  signups?: SignupAttributes[],
}
export interface EventInstance extends Instance<EventAttributes>, EventAttributes {
  getLocations(): Bluebird<LocationInstance[]>
  getShifts(): Bluebird<ShiftInstance[]>
}

export const eventFactory = (s: Sequelize, t: DataTypes): Model => {

  const event = s.define<EventInstance, EventAttributes>("event", {
    actionKitId: t.INTEGER,
    codes: t.JSON,
    createdDate: t.DATE,
    description: t.STRING,
    endDate: t.DATE,
    eventId: t.INTEGER,
    eventType: t.JSON,
    name: t.STRING,
    notes: t.JSON,
    roles: t.JSON,
    shortName: t.STRING,
    startDate: t.DATE,
    vanId: t.INTEGER,
  })

  event.associate = (db: Models) => {
    event.hasMany(db.location, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
    event.hasMany(db.shift, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
  }

  return event
}
