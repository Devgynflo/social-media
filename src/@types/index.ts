export interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  SKELETON = "skeleton",
  PASSWORD = "password",
}
