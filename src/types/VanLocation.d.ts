declare interface VanLocation {
  // locationId?: number, use vanId instead
  id?: number,
  vanId?: number,
  ////////////////////
  name: string,
  displayName?: string,
  address?: VanAddress,
}
