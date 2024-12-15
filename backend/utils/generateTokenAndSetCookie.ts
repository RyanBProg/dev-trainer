import jwt from "jsonwebtoken";
import { Response } from "express";

export default function generateTokenAndSetCookie(
  userId: string,
  res: Response
) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return;
  }

  const token = jwt.sign({ userId }, secretKey, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 86400000, // 1d
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}
