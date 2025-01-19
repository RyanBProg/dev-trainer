import { Response } from "express";
import UserModel from "../../db/models/UserModel";
import { TUserTokenRequest } from "../../types/requestBodyControllersTypes";
import ShortcutModel from "../../db/models/ShortcutModel";
import { handleControllerError } from "../../utils/handleControllerError";
import sharp from "sharp";

export const getUserInfo = async (req: TUserTokenRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const userData = await UserModel.findOne({ _id: userId })
      .select("-password -custom -_id -__v -profilePicture")
      .lean();
    if (!userData) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    res.status(200).json(userData);
  } catch (error) {
    handleControllerError(error, res, "getUserInfo");
  }
};

export const addUserShortcuts = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const shortcutIds = req.body.shortcutIds;

    if (!Array.isArray(shortcutIds) || shortcutIds.length === 0) {
      res.status(400).json({ error: "Shortcut IDs are required" });
      return;
    }

    const userId = req.user?.userId;
    const user = await UserModel.findById(userId).select("custom.shortcuts");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { "custom.shortcuts": { $each: shortcutIds } },
      },
      { new: true }
    );

    res.status(200).json({ message: "User shortcuts updated" });
  } catch (error) {
    handleControllerError(error, res, "addUserShortcuts");
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

    const userCustom = await UserModel.findOne({ _id: userId })
      .select("custom.shortcuts")
      .lean();
    if (!userCustom) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const shortcutIds = userCustom.custom?.shortcuts || [];

    const shortcuts = await ShortcutModel.find({
      _id: { $in: shortcutIds },
    }).lean();

    res.status(200).json(shortcuts);
  } catch (error) {
    handleControllerError(error, res, "getUserShortcuts");
  }
};

export const addProfilePicture = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    // Ensure a file is uploaded
    if (!req.file) {
      res.status(400).json({ error: "No image file uploaded" });
      return;
    }

    // Minify and process the image using Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(100, 100) // Resize to 100x100 pixels
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    // Update the user's profile picture in the database
    await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePicture: {
          data: processedImage,
          contentType: "image/jpeg",
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    handleControllerError(error, res, "addProfilePicture");
  }
};

export const getUserProfilePicture = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const userData = await UserModel.findOne({ _id: userId })
      .select("profilePicture")
      .lean();
    if (!userData) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (!userData.profilePicture?.data) {
      res.status(200).json({ profilePicture: null });
      return;
    }

    const imageBase64 = userData.profilePicture.data.toString("base64");
    const contentType = userData.profilePicture.contentType;
    const imageSrc = `data:${contentType};base64,${imageBase64}`;

    res.status(200).json({ profilePicture: imageSrc });
  } catch (error) {
    handleControllerError(error, res, "getUserProfilePicture");
  }
};
