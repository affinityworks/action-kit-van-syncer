import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {LocationInstance} from "./location"
import {RoleInstance} from "./role"
import {ShiftInstance} from "./shift"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface EventAttributes extends AbstractAttributes, VanEvent {}
export interface EventInstance extends Instance<EventAttributes>, EventAttributes {
  getLocation(): Bluebird<LocationInstance>
  getShifts(): Bluebird<ShiftInstance[]>
  getRoles(): Bluebird<RoleInstance[]>
}

export const eventFactory = (s: Sequelize, t: DataTypes): Model => {

  const event = s.define<EventInstance, EventAttributes>("event", {
    actionKitId: t.INTEGER,
    vanId: t.INTEGER,
    eventId: t.INTEGER,
    name: t.STRING,
    shortName: t.STRING,
    description: t.STRING,
    startDate: t.DATE,
    endDate: t.DATE,
    eventType: t.JSON,
    codes: t.JSON,
    notes: t.JSON,
    createdDate: t.DATE,
  })

  event.associate = (db: Models) => {
    event.hasOne(db.location, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
    event.hasMany(db.shift, {
      hooks: true,
      onDelete: "cascade",
      foreignKey: "eventId",
    })
    event.hasMany(db.role, {
      foreignKey: "rolableId",
      scope: {
        rolable: "event",
      },
      hooks: true,
      onDelete: "cascade",
    })
  }

  return event
}
