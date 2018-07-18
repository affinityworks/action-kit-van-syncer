import {DataTypeAbstract, DefineAttributeColumnOptions} from "sequelize"
import {EventAttributes} from "../db/models/event"
import {LocationAttributes} from "../db/models/location"
import {ShiftAttributes} from "../db/models/shift"

declare type SequelizeAttributes<T extends{ [key: string]: any}> = {
  [P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions
}

declare interface AbstractAttributes {
  id?: number,
  vanId?: number,
  archived?: string,
  createdAt?: string,
  updatedAt?: string,
}

declare type Attributes =
  EventAttributes |
  LocationAttributes |
  ShiftAttributes
