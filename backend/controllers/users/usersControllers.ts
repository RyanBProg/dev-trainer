import { Response } from "express";
import UserModel from "../../db/models/UserModel";
import catchErrorMessage from "../../utils/catchErrorMessage";
import { TUserTokenRequest } from "../../types/requestBodyControllersTypes";

export const getUserData = async (req: TUserTokenRequest, res: Response) => {
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
};

export const addUserShortcut = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const shortcutId = req.body.shortcutId;
    if (!shortcutId) {
      res.status(400).json({ error: "Shortcut ID is required" });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { "custom.shortcuts": shortcutId } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    catchErrorMessage("Error in addUserShortcut", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUserShortcut = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const shortcutId = req.params.shortcutId;
    if (!shortcutId) {
      res.status(400).json({ error: "Shortcut ID is required" });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { "custom.shortcuts": shortcutId } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    catchErrorMessage("Error in deleteUserShortcut", error);
    res.status(500).json({ error: "Internal server error" });
  }
};