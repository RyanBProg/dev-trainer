import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { TUserTokenRequest } from "../types/requestBodyControllersTypes";
import { handleControllerError } from "../utils/handleControllerError";

export default async function checkUserToken(
  req: TUserTokenRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // check for a token on the request
    const token = req.cookies.accessToken;
    if (!token) {
      res.status(401).json({ error: "Unauthorized - No Token Provided" });
      return;
    }

    // find secret key
    const secretKey = process.env.ACCESS_SECRET_KEY;
    if (!secretKey) {
      console.log("[server] protectRoute: No ACCESS_SECRET_KEY found");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // check that request token is valid
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: "Unauthorized - Invalid Token" });
      return;
    }

    // attach user to the request
    req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };

    next();
  } catch (error) {
    handleControllerError(error, res, "checkUserToken");
  }
}
