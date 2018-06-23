import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {EventAttributes, EventInstance} from "./event"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface RoleAttributes extends AbstractAttributes, VanRole {
  rolable: string,
  rolableId: number,
  event: EventAttributes,
}

export interface RoleInstance extends Instance<RoleAttributes>, RoleAttributes {
  getEvent(): Bluebird<EventInstance>
}

export const roleFactory = (s: Sequelize, t: DataTypes): Model => {

  const Role = s.define<RoleInstance, RoleAttributes>("Role", {
    roleId: t.INTEGER,
    name: t.STRING,
    isEventLead: t.BOOLEAN,
    min: t.INTEGER,
    max: t.INTEGER,
    goal: t.INTEGER,
    rolable: t.STRING,
    rolableId: t.INTEGER,
  }, {
    tableName: "roles",
  })

  Role.associate = (db: Models) => {
    Role.belongsTo(db.Event, {
      foreignKey: "rolableId",
      constraints: false,
      as: "event",
    })
  }
  
  return Role
}
