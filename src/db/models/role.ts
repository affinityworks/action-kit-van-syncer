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

  const role = s.define<RoleInstance, RoleAttributes>("role", {
    roleId: t.INTEGER,
    name: t.STRING,
    isEventLead: t.BOOLEAN,
    min: t.INTEGER,
    max: t.INTEGER,
    goal: t.INTEGER,
    rolable: t.STRING,
    rolableId: t.INTEGER,
  })

  role.associate = (db: Models) => {
    role.belongsTo(db.event, {
      foreignKey: "rolableId",
      constraints: false
    })
  }
  
  return role
}
