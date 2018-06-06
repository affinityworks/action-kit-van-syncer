declare interface VanPhone {
    phoneNumber: string,
    phoneType?: "H" | "W" | "C" | "M" | "F"
    ext?: string,
    isPreferred?: string,
    phoneOptInStatus?: string,
}
