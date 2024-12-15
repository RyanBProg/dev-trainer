import { Response } from "express";
import UserModel from "../../db/models/UserModel";
import catchErrorMessage from "../../utils/catchErrorMessage";
import { TUserTokenRequest } from "../../types/requestBodyControllersTypes";

async function getUserData(req: TUserTokenRequest, res: Response) {
  try {
    const userId = req.user?.userId;

    const userData = await UserModel.findOne({ _id: userId }).select(
      "-password"
    );
    if (!userData) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    res.status(200).json(userData);
  } catch (error) {
    catchErrorMessage("Error in getUserData", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getUserData;
