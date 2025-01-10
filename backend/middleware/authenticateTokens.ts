import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { TUserTokenRequest } from "../types/requestBodyControllersTypes";
import { handleControllerError } from "../utils/handleControllerError";
import { generateAccessToken } from "../utils/generateTokens";
import { setTokenCookie } from "../utils/setTokenCookie";
import UserModel from "../db/models/UserModel";

export async function authenticateTokens(
  req: TUserTokenRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const accessSecretKey = process.env.ACCESS_SECRET_KEY;
    if (!accessSecretKey) {
      console.log("[server] generateAccessToken: No ACCESS_SECRET_KEY found");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
    if (!refreshSecretKey) {
      console.log("[server] generateAccessToken: No REFRESH_SECRET_KEY found");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // check for an access token on the request
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      // check for a refresh token on the request
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ error: "Unauthorized - No Refresh Token" });
        return;
      }

      // check that refresh token is valid
      const refreshDecoded = jwt.verify(
        refreshToken,
        refreshSecretKey
      ) as JwtPayload;
      if (!refreshDecoded || !refreshDecoded.userId) {
        res.status(403).json({ error: "Unauthorized - Invalid Token" });
        return;
      }

      // check refresh token matches version in db
      const user = await UserModel.findById(refreshDecoded.userId).lean();
      if (!user || user.tokenVersion !== refreshDecoded.tokenVersion) {
        res.status(403).json({ error: "Invalid refresh token" });
        return;
      }

      // create new access token
      const accessToken = generateAccessToken(
        refreshDecoded.userId,
        refreshDecoded.isAdmin,
        res
      ) as string;
      if (!accessToken) {
        console.log(
          "[server] authenticateTokens: failed to generate access token"
        );
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // set acces token in cookie
      setTokenCookie(res, "accessToken", accessToken);

      // attach user to the request
      req.user = {
        userId: refreshDecoded.userId,
        isAdmin: refreshDecoded.isAdmin,
      };

      next();
    } else {
      const accessDecoded = jwt.verify(
        accessToken,
        accessSecretKey
      ) as JwtPayload;
      if (!accessDecoded || !accessDecoded.userId) {
        res.status(403).json({ error: "Unauthorized - Invalid Token" });
        return;
      }

      // attach user to the request
      req.user = {
        userId: accessDecoded.userId,
        isAdmin: accessDecoded.isAdmin,
      };
      next();
    }
  } catch (error) {
    handleControllerError(error, res, "authenticateTokens");
  }
}
