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
  const Address = s.define<AddressInstance, AddressAttributes>("Address", {
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
  }, {
    tableName: "addresses",
  })

  Address.associate = (db: Models) => {

    Address.belongsTo(db.Location, {
      foreignKey: "addressableId",
      constraints: false,
      as: "location",
    })

  }

  return Address
}
