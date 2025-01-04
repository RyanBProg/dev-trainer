import { Response } from "express";
import UserModel from "../../db/models/UserModel";
import { TUserTokenRequest } from "../../types/requestBodyControllersTypes";
import ShortcutModel from "../../db/models/ShortcutModel";
import { handleControllerError } from "../../utils/handleControllerError";

export const getUserInfo = async (req: TUserTokenRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const userData = await UserModel.findOne({ _id: userId }).select(
      "-password -custom -_id -__v"
    );
    if (!userData) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    res.status(200).json(userData);
  } catch (error) {
    handleControllerError(error, res, "getUserInfo");
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
    handleControllerError(error, res, "addUserShortcut");
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
    handleControllerError(error, res, "deleteUserShortcut");
  }
};

export const getUserShortcuts = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const userCustom = await UserModel.findOne({ _id: userId }).select(
      "custom.shortcuts"
    );
    if (!userCustom) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const shortcutIds = userCustom.custom?.shortcuts;

    const shortcuts = await ShortcutModel.find({ _id: { $in: shortcutIds } });

    res.status(200).json(shortcuts);
  } catch (error) {
    handleControllerError(error, res, "getUserShortcuts");
  }
};
