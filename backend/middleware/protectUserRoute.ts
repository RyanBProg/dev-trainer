import jwt, { JwtPayload } from "jsonwebtoken";
import catchErrorMessage from "../utils/catchErrorMessage";
import { Response, NextFunction } from "express";
import UserModel from "../db/models/UserModel";
import { TAuthenticatedRequest } from "../types/requestBodyControllersTypes";

export default async function protectRoute(
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // check for a token on the request
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });
      return;
    }

    // find secret key
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.log("[server] protectRoute: No JWT_SECRET_KEY found");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // check that request token is valid
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized - Invalid Token" });
      return;
    }

    // find user in db using decoded userId
    const user = await UserModel.findById({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // attach user to the request
    req.user = user;

    next();
  } catch (error) {
    catchErrorMessage("Error in protectRoute middleware", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
