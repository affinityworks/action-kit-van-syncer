declare interface ActionKitSignup {
    attended: boolean,
    created_at: Date,
    // event: ActionKitEven | Uri
    // fields: [CustomField|Uri]
    id: number,
    // page: Uri
    resource_uri: string, // Uri
    role: string,
    // signupaction: [ActionKitSignupAction | Uri]
    // signupfields: [Uri]
    status: string,
    updated_at: Date,
    user: string
}
