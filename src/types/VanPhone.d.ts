declare interface VanPhone {
    /////////////
    actionKitId?: number,
    vanId?: number,
    id?: number,
    /////////////
    phoneNumber: string,
    phoneType?: "H" | "W" | "C" | "M" | "F"
    ext?: string,
    isPreferred?: boolean,
    phoneOptInStatus?: string,
}
