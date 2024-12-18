import jwt from "jsonwebtoken";
import { Response } from "express";

export default function generateTokenAndSetCookie(
  userId: string,
  isAdmin: boolean,
  res: Response
) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    console.log("[server] generateTokenAndSetCookie: No JWT_SECRET_KEY found");
    return res.status(500).json({ error: "Internal server error" });
  }

  const token = jwt.sign({ userId, isAdmin }, secretKey, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 86400000, // 1d
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
  });
}
