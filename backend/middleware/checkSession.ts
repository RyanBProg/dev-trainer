import { Request, Response, NextFunction } from "express";
import UserModel from "../db/models/UserModel";
import { handleControllerError } from "../utils/handleControllerError";

export const checkSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if session exists
    if (!req.session.userId) {
      res.status(401).json({
        message: "Unauthorized - No session",
        code: "AUTH_NO_SESSION",
      });
      return;
    }

    // Verify user still exists in database
    const user = await UserModel.findById(req.session.userId)
      .select("_id isAdmin oAuth_token_expiry")
      .lean();
    if (!user) {
      req.session.destroy((err) => {
        if (err) console.error("Session destruction failed:", err);
      });
      res.status(401).json({
        message: "Unauthorized - Invalid session",
        code: "AUTH_INVALID_SESSION",
      });
      return;
    }

    // Attach user data to request for later use
    req.user = {
      userId: user._id.toString(),
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    handleControllerError(error, res, "checkSession");
  }
};
