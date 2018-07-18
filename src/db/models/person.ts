import {DataTypes, Instance, Models, Sequelize, SequelizeStaticAndInstance} from "sequelize"
import {AbstractAttributes} from "../../types/Attributes"
import {AddressInstance} from "./address"
import Bluebird = require("bluebird")
type Model = SequelizeStaticAndInstance["Model"]

export interface PersonAttributes extends AbstractAttributes, VanPerson {}
export interface PersonInstance extends Instance<PersonAttributes>, PersonAttributes {
  getAddresses(): Bluebird<AddressInstance[]>
}

export const personFactory = (s: Sequelize, t: DataTypes): Model => {

  return s.define<PersonInstance, PersonAttributes>("person", {
    actionKitId: t.INTEGER,
    vanId: t.INTEGER,
    firstName: t.STRING,
    middleName: t.STRING,
    lastName: t.STRING,
    salutation: t.STRING,
    suffix: t.STRING,
    emails: t.JSON,
    phones: t.JSON,
    addresses: t.JSON,
  }, {})
}
