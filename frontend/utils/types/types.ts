// client request types

import { z } from "zod";
import { userLoginSchema, userSignupSchema } from "../zod/formSchemas";

export type TUserData = {
  fullName: string;
  email: string;
  isAdmin: boolean;
  tokenVersion: string;
  createdAt: string;
  updatedAt: string;
};

export type TUserSignup = z.infer<typeof userSignupSchema>;
export type TUserLogin = z.infer<typeof userLoginSchema>;

// server response types

export type TUserContext = {
  fullName: string;
  isAdmin: boolean;
  custom: {
    shortcuts: TShortcut[];
  };
};

export type TShortcut = {
  _id: string;
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TShortcutForm = {
  shortDescription: string;
  description: string;
  keys: string[];
  type: string;
};
