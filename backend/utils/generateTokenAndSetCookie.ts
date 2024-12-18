import jwt from "jsonwebtoken";
import { Response } from "express";

export function generateAccessTokenAndSetCookie(
  userId: string,
  isAdmin: boolean,
  res: Response
) {
  const secretKey = process.env.ACCESS_SECRET_KEY;
  if (!secretKey) {
    console.log(
      "[server] generateAccessTokenAndSetCookie: No ACCESS_SECRET_KEY found"
    );
    return res.status(500).json({ error: "Internal server error" });
  }

  const token = jwt.sign({ userId, isAdmin }, secretKey, {
    expiresIn: "1d",
  });

  res.cookie("accessToken", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
  });
}
