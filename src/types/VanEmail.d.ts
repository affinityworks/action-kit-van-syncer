declare interface VanEmail {
    email: string,
    type?: "P" | "W" | "O",
    isPreferred?: boolean,
    isSubscribed?: boolean,
}
