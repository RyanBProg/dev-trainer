import { Request, Response } from "express";
import UserModel from "../../db/models/UserModel";
import catchErrorMessage from "../../utils/catchErrorMessage";
import { TAuthenticatedRequest } from "../../types/requestBodyControllersTypes";

async function getUserData(req: TAuthenticatedRequest, res: Response) {
  try {
    const userData = req.user;
    if (!userData) throw new Error("User not found");

    res.status(200).json(userData);
  } catch (error) {
    catchErrorMessage("Error in getUserData", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getUserData;
