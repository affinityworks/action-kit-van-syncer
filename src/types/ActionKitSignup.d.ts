declare interface AbstractActionKitSignup {
  attended: boolean,
  created_at: Date | string,
  id: number,
  role: string,
  status: ActionKitSignupStatus,
  updated_at: Date | string,
}

declare type ActionKitSignupStatus = "active" | "deleted" | "cancelled"

declare interface ActionKitSignupResponse extends AbstractActionKitSignup {
  event: string,
  fields: object | object[],
  page: string,
  resource_uri: string,
  signupaction: string[],
  signupfields: object[],
  user: string,
}

declare interface ActionKitSignup extends AbstractActionKitSignup {
  user: ActionKitPerson,
}
