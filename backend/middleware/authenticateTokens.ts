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
        console.log("[server] No Refresh Token Provided");
        res
          .status(401)
          .json({
            message: "Unauthorized - No Token Provided",
            code: "AUTH_NO_TOKEN",
          });
        return;
      }

      // check that refresh token is valid
      const refreshDecoded = jwt.verify(refreshToken, env.REFRESH_SECRET_KEY, {
        algorithms: ["HS256"],
      }) as JwtPayload;
      if (!refreshDecoded.userId) {
        console.log("[server] Invalid Refresh Token Credentials");
        res
          .status(401)
          .json({
            message: "Unauthorized - Invalid Token",
            code: "AUTH_INVALID_TOKEN",
          });
        return;
      }

      // check refresh token matches version in db
      const user = await UserModel.findById(refreshDecoded.userId).lean();
      if (!user) {
        console.log("[server] User could not be found in the database");
        res
          .status(401)
          .json({
            message: "Unauthorized - Invalid Token",
            code: "AUTH_INVALID_TOKEN",
          });
        return;
      }

      if (user.tokenVersion !== refreshDecoded.tokenVersion) {
        console.log("[server] Invalid Refresh Token Version");
        res
          .status(401)
          .json({
            message: "Unauthorized - Invalid Token",
            code: "AUTH_INVALID_TOKEN",
          });
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
      const accessDecoded = jwt.verify(accessToken, env.ACCESS_SECRET_KEY, {
        algorithms: ["HS256"],
      }) as JwtPayload;
      if (!accessDecoded.userId) {
        console.log("[server] Invalid Access Token Credentials");
        res
          .status(401)
          .json({
            message: "Unauthorized - Invalid Token",
            code: "AUTH_INVALID_TOKEN",
          });
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
