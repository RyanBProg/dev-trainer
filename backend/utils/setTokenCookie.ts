import { Response } from "express";

type TokenName = "accessToken" | "refreshToken";

export function setTokenCookie(
  res: Response,
  tokenName: TokenName,
  token: string
) {
  const maxAgeAccessToken = 15 * 60 * 1000; // 15 minutes (in milliseconds)
  const maxAgeRefreshToken = 7 * 24 * 60 * 60 * 1000; // 7 days (in milliseconds)

  res.cookie(tokenName, token, {
    maxAge:
      tokenName === "accessToken" ? maxAgeAccessToken : maxAgeRefreshToken,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
  });
}
