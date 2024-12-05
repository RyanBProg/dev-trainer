import { Request, Response } from "express";
import UserModel from "../db/models/UserModel";
import catchErrorMessage from "../utils/catchErrorMessage";

async function getUserData(req: Request, res: Response) {
  try {
    const userId = req.params._id;
    const userData = await UserModel.find({ _id: userId }).select("-password");
    if (!userData) throw new Error("User not found");

    res.status(200).json(userData);
  } catch (error) {
    catchErrorMessage("Error in getUsersForSidebar", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default getUserData;
