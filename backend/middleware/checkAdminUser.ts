import { Response, NextFunction } from "express";
import { TUserTokenRequest } from "../types/requestBodyControllersTypes";
import { handleControllerError } from "../utils/handleControllerError";

export default async function checkAdminUser(
  req: TUserTokenRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // check for a token on the request
    if (!req.user?.isAdmin) {
      res.status(401).json({
        message: "Unauthorized - User is not an admin",
        code: "USER_NOT_ADMIN",
      });
      return;
    }

    next();
  } catch (error) {
    handleControllerError(error, res, "checkAdminUser");
  }
}
