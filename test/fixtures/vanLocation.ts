import {LocationAttributes} from "../../src/db/models/location"

export const locationAttrs: LocationAttributes[] = [
  {
    name: "Space Jam",
    address: {
      addressLine1: "123 Albany Avenue",
      addressLine2: "",
      city: "New York",
      stateOrProvince: "NY",
      zipOrPostalCode: "11215-1104",
      countryCode: "US", // hmm.. must be "USA"?
      type: "Custom",
    },
  },
  {
    address: {
      addressLine1: "789 Dean Road",
      addressLine2: "",
      city: "Nashville",
      countryCode: "US",
      stateOrProvince: "TN",
      type: "Custom",
      zipOrPostalCode: "37201-1104",
    },
    name: "Barn",
  },
]
