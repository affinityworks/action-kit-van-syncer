declare interface VanAddress {
    addressId: number,
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    city: string,
    stateOrProvince: string,
    zipOrPostalCode: number,
    countryCode: string,
    type: "Mailing" | "Home" | "Voting" | "Work" | "Custom",
    isPreferred: true,
}
