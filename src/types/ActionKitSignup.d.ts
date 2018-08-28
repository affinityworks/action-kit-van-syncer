declare interface AbstractActionKitSignup {
  attended: boolean,
  created_at: Date | string,
  event: string,
  fields: object | object[],
  id: number,
  page: string,
  resource_uri: string,
  role: string,
  signupaction: string[],
  signupfields: object[],
  status: ActionKitSignupStatus,
  updated_at: Date | string,
}

declare type ActionKitSignupStatus = "active" | "deleted" | "cancelled" | "complete"

declare interface ActionKitSignupResponse extends AbstractActionKitSignup {
  user: string,
}

declare interface ActionKitSignup extends AbstractActionKitSignup {
  user: ActionKitPerson,
}
