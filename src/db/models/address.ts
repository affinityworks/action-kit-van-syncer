import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {LocationAttributes, LocationInstance} from "./location"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface AddressInstance extends Instance<AddressAttributes>, AddressAttributes {
  getLocation(): Bluebird<LocationInstance>
}

export interface AddressAttributes extends AbstractAttributes, VanAddress {
  addressableId: number,
  addressable: LocationAttributes | LocationInstance,
}

export const addressFactory = (s: Sequelize, t: DataTypes): Model => {
  const address = s.define<AddressInstance, AddressAttributes>("address", {
    addressable: t.STRING,
    addressableId: t.INTEGER,
    addressId: t.INTEGER, // van id
    addressLine1: t.STRING,
    addressLine2: t.STRING,
    addressLine3: t.STRING,
    city: t.STRING,
    stateOrProvince: t.STRING,
    zipOrPostalCode: t.STRING,
    countryCode: t.STRING,
    type: t.STRING,
    isPreferred: t.BOOLEAN,
  })

  address.associate = (db: Models) => {
    address.belongsTo(db.location, {
      foreignKey: "addressableId",
      constraints: false,
    })
  }

  return address
}
