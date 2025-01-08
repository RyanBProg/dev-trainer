import { InferSchemaType } from "mongoose";
import { shortcutSchema } from "../db/models/ShortcutModel";
import { Request } from "express";

// Inferred Types
type TShortcutBase = Omit<
  InferSchemaType<typeof shortcutSchema>,
  "createdAt" | "updatedAt"
>;

// Request Bodies
export type TCreateShortcutRequestBody = TShortcutBase;

export type TSignupRequestBody = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TLoginRequestBody = {
  email: string;
  password: string;
};

// User

type TUser = {
  userId: string;
  isAdmin: boolean;
};

export interface TUserTokenRequest extends Request {
  user?: TUser;
}
