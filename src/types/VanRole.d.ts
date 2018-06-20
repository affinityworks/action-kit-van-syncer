declare interface VanRole {
    roleId?: number,
    name?: "Attendee" | "Host",
    isEventLead?: boolean,
    min?: number,
    max?: number,
    goal?: number,
}
