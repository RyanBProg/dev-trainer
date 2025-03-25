import jwt from "jsonwebtoken";
import { env } from "../zod/envSchema";
import crypto from "crypto";

export const generateAccessToken = (userId: string, isAdmin: boolean) => {
  const token = jwt.sign(
    {
      userId,
      isAdmin,
    },
    env.ACCESS_SECRET_KEY,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
      algorithm: "HS256",
    }
  );

  return token;
};

export const generateRefreshToken = (
  userId: string,
  isAdmin: boolean,
  tokenVersion: number
) => {
  const token = jwt.sign(
    {
      userId,
      isAdmin,
      tokenVersion,
    },
    env.REFRESH_SECRET_KEY,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
      algorithm: "HS256",
    }
  );

  return token;
};
