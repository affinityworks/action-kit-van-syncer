declare interface ActionKitPhone {
    created_at: Date | string,
    id: number,
    normalized_phone: string,
    phone: string,
    resource_uri: string,
    source: string,
    type: ActionKitPhoneType
    updated_at: Date | string,
    user: string // ActionKitPerson
}

declare type ActionKitPhoneType = "home" | "work" | "mobile" | "emergency" | "home_fax" | "mobile_fax" | "batphone"
