import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string, isAdmin: boolean) => {
  const accessSecretKey = process.env.ACCESS_SECRET_KEY;
  if (!accessSecretKey) {
    console.log("[server] generateAccessToken: No ACCESS_SECRET_KEY found");
    return { error: "Internal server error" };
  }

  const token = jwt.sign({ userId, isAdmin }, accessSecretKey, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  return { token };
};

export const generateRefreshToken = (
  userId: string,
  isAdmin: boolean,
  tokenVersion: number
) => {
  const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
  if (!refreshSecretKey) {
    console.log("[server] generateRefreshToken: No REFRESH_SECRET_KEY found");
    return { error: "Internal server error" };
  }

  const token = jwt.sign({ userId, isAdmin, tokenVersion }, refreshSecretKey, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return { token };
};
