import { InferSchemaType, HydratedDocument } from "mongoose";
import { userSchema } from "../db/models/UserModel";
import { Request } from "express";

export type TCreateShortcutRequestBody = {
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
};

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

// USER

type TUser = {
  userId: string;
  role: string;
};

export interface TUserTokenRequest extends Request {
  user?: TUser;
}

// type TUserBase = InferSchemaType<typeof userSchema>;
// type TUserWithoutPassword = Omit<TUserBase, "password">;
// type TUserWithoutPasswordHYD = HydratedDocument<TUserWithoutPassword>;

// export interface TAuthenticatedRequest extends Request {
//   user?: TUserWithoutPasswordHYD;
// }
