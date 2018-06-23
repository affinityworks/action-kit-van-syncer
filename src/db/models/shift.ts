import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {EventInstance} from "./event"
type Model = SequelizeStaticAndInstance["Model"]

export interface ShiftAttributes extends AbstractAttributes, VanShift {
  eventId?: number
}

export interface ShiftInstance extends Instance<ShiftAttributes>, ShiftAttributes {
  getEvent(): EventInstance
}

export const shiftFactory = (s: Sequelize, t: DataTypes): Model => {

  const shift = s.define<ShiftInstance, ShiftAttributes>("shift", {
    eventId: t.INTEGER,
    eventShiftId: t.INTEGER,
    name: t.STRING,
    startTime: t.DATE,
    endTime: t.DATE,
  })

  shift.associate = (db: Models) => {
    shift.belongsTo(db.event)
  }

  return shift
}
