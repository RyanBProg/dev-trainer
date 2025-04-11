import { InferSchemaType } from "mongoose";
import { shortcutSchema } from "../db/models/ShortcutModel";
import "express-session";
import { signinSchema, userSignupSchema } from "../zod/schemas";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        isAdmin: boolean;
      };
    }
  }
}

export type TOAUTH_USER_DATA = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};

export type TCreateShortcutRequestBody = Omit<
  InferSchemaType<typeof shortcutSchema>,
  "createdAt" | "updatedAt"
>;

export type TSignupRequestBody = z.infer<typeof userSignupSchema>;
export type TLoginRequestBody = z.infer<typeof signinSchema>;
