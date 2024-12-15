import catchErrorMessage from "../utils/catchErrorMessage";
import { Response, NextFunction } from "express";
import { TUserTokenRequest } from "../types/requestBodyControllersTypes";

export default async function checkAdminUser(
  req: TUserTokenRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // check for a token on the request
    const role = req.user?.role;
    if (role !== "admin") {
      res.status(401).json({ error: "Unauthorized - User is not an admin" });
      return;
    }

    next();
  } catch (error) {
    catchErrorMessage("Error in checkAdminUser middleware", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
