import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { TUserTokenRequest } from "../types/requestBodyControllersTypes";
import { handleControllerError } from "../utils/handleControllerError";
import { generateAccessToken } from "../utils/generateTokens";
import { setTokenCookie } from "../utils/setTokenCookie";
import UserModel from "../db/models/UserModel";
import { env } from "../zod/envSchema";

export async function authenticateTokens(
  req: TUserTokenRequest,
  res: Response,
  next: NextFunction
) {
  try {
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
        env.REFRESH_SECRET_KEY
      ) as JwtPayload;
      if (!refreshDecoded || !refreshDecoded.userId) {
        res.status(403).json({ error: "Unauthorized - Invalid Token" });
        return;
      }

      // check refresh token matches version in db
      const user = await UserModel.findById(refreshDecoded.userId).lean();
      if (!user || user.tokenVersion !== refreshDecoded.tokenVersion) {
        console.log("[server] User could not be found");
        res.status(403).json({ error: "Invalid refresh token" });
        return;
      }

      // create new access token
      const newAccessToken = generateAccessToken(
        refreshDecoded.userId,
        refreshDecoded.isAdmin
      );

      setTokenCookie(res, "accessToken", newAccessToken);

      // attach user to the request
      req.user = {
        userId: refreshDecoded.userId,
        isAdmin: refreshDecoded.isAdmin,
      };

      next();
    } else {
      const accessDecoded = jwt.verify(
        accessToken,
        env.ACCESS_SECRET_KEY
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
