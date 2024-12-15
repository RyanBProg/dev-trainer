import jwt from "jsonwebtoken";
import catchErrorMessage from "../utils/catchErrorMessage";
import { Request, Response, NextFunction } from "express";
import UserModel from "../db/models/UserModel";

export default async function protectRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // check for a token on the request
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // find secret key
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.log("[server] protectRoute: No JWT_SECRET_KEY found");
      return res.status(500).json({ error: "Internal server error" });
    }

    // check that request token is valid
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // find user in db using decoded userId
    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // attach user to the request
    req.user = user;

    next();
  } catch (error) {
    catchErrorMessage("Error in protectRoute middleware", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
