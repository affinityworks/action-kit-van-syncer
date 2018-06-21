import {DataTypeAbstract, DefineAttributeColumnOptions} from "sequelize"

declare type SequelizeAttributes<T extends{ [key: string]: any}> = {
  [P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions
}

declare interface Attributes {
  actionKitId: number,
  id?: number,
  vanId?: number,
  archived?: string,
  createdAt?: string,
  updatedAt?: string,
}
