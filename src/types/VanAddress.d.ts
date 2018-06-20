declare interface VanAddress {
  addressId?: number,
  addressLine1: string,
  addressLine2?: string,
  addressLine3?: string,
  city: string,
  stateOrProvince: string,
  zipOrPostalCode: string,
  countryCode: string,
  type: VanAddressType
  isPreferred?: boolean,
}

declare type VanAddressType = "Mailing" | "Home" | "Voting" | "Work" | "Custom"
