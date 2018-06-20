declare interface VanRole {
    roleId?: number,
    name?: "Attendee" | "Host",
    isEventLead?: number,
    min?: number,
    max?: number,
    goal?: number,
}
