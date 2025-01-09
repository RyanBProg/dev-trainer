import { Response } from "express";
const jwt = require("jsonwebtoken");

const generateAccessToken = (
  userId: string,
  isAdmin: boolean,
  res: Response
) => {
  const secretKey = process.env.ACCESS_SECRET_KEY;
  if (!secretKey) {
    console.log("[server] generateAccessToken: No ACCESS_SECRET_KEY found");
    return res.status(500).json({ error: "Internal server error" });
  }

  const token = jwt.sign({ userId, isAdmin }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  return token;
};

const generateRefreshToken = (userId: string, res: Response) => {
  const secretKey = process.env.REFRESH_SECRET_KEY;
  if (!secretKey) {
    console.log("[server] generateAccessToken: No REFRESH_SECRET_KEY found");
    return res.status(500).json({ error: "Internal server error" });
  }

  const token = jwt.sign({ userId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
