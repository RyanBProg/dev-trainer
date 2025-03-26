import { Response } from "express";
import { Types } from "mongoose";
import UserModel from "../../db/models/UserModel";
import { TUserTokenRequest } from "../../types/requestBodyControllersTypes";
import ShortcutModel from "../../db/models/ShortcutModel";
import { handleControllerError } from "../../utils/handleControllerError";
import sharp from "sharp";
import { env } from "../../zod/envSchema";
import { shortcutIdSchema, shortcutIdsSchema } from "../../zod/shortcutSchema";
import { userFullNameSchema } from "../../zod/userSignupSchema";

export const getUserInfo = async (req: TUserTokenRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const userData = await UserModel.findOne({ _id: userId })
      .select("-password -custom -_id -__v -profilePicture")
      .lean();
    if (!userData) {
      res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
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
    const parsedShortcutIds = shortcutIdsSchema.safeParse(req.body);
    if (!parsedShortcutIds.success) {
      res.status(400).json({
        message:
          parsedShortcutIds.error.errors[0]?.message || "Invalid shortcut IDs",
        code: "INVALID_SHORTCUT_IDS",
      });
      return;
    }

    const userId = req.user?.userId;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          "custom.shortcuts": { $each: parsedShortcutIds.data.shortcutIds },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      message: "User shortcuts updated",
      code: "USER_SHORTCUTS_UPDATED",
    });
  } catch (error) {
    handleControllerError(error, res, "addUserShortcuts");
  }
};

export const deleteUserShortcut = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const parsedShortcutId = shortcutIdSchema.safeParse(req.params.shortcutId);
    if (!parsedShortcutId.success) {
      res.status(400).json({
        message:
          parsedShortcutId.error.errors[0]?.message || "Invalid shortcut ID",
        code: "INVALID_SHORTCUT_ID",
      });
      return;
    }

    const userId = req.user?.userId;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { "custom.shortcuts": parsedShortcutId.data } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
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

    const userWithShortcuts = await UserModel.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $unwind: {
          path: "$custom.shortcuts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "shortcuts",
          localField: "custom.shortcuts",
          foreignField: "_id",
          as: "shortcutDetails",
        },
      },
      {
        $unwind: { path: "$shortcutDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          shortcuts: { $push: "$shortcutDetails" },
        },
      },
    ]);

    if (!userWithShortcuts.length) {
      res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(200).json(userWithShortcuts[0].shortcuts || []);
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
      res.status(400).json({
        message: "No image file uploaded",
        code: "NO_IMAGE_FILE_UPLOADED",
      });
      return;
    }

    // Minify and process the image using Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(100, 100) // Resize to 100x100 pixels
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    // Update the user's profile picture in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePicture: {
          data: processedImage,
          contentType: "image/jpeg",
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(200).json({
      message: "Profile picture updated successfully",
      code: "PROFILE_PICTURE_UPDATED",
    });
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
      res
        .status(400)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
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

export const addUserFullName = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const parsedFullName = userFullNameSchema.safeParse(req.body.fullName);
    if (!parsedFullName.success) {
      res.status(400).json({
        message: parsedFullName.error.errors[0]?.message || "Invalid Full Name",
        code: "INVALID_FULL_NAME",
      });
      return;
    }

    // Update the user's Full Name in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { fullName: parsedFullName.data.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    handleControllerError(error, res, "addUserFullName");
  }
};

export const deleteUser = async (req: TUserTokenRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    await UserModel.deleteOne({ _id: userId });

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    handleControllerError(error, res, "deleteUser");
  }
};
