declare interface VanAddress {
  addressId?: number,
  addressLine1: string,
  addressLine2?: string,
  addressLine3?: string,
  city: string,
  stateOrProvince: string,
  zipOrPostalCode: string,
  countryCode: string,
  type: "Mailing" | "Home" | "Voting" | "Work" | "Custom",
  isPreferred?: boolean,
}
