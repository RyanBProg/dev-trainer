import bcrypt from "bcryptjs";
import { RequestHandler, Response } from "express";
import { userSignupSchema } from "../../zod/userSignupSchema";
import UserModel from "../../db/models/UserModel";
import {
  TLoginRequestBody,
  TSignupRequestBody,
  TUserTokenRequest,
} from "../../types/requestBodyControllersTypes";
import { handleControllerError } from "../../utils/handleControllerError";
import { normaliseRequestBody } from "./utils";
import { signinSchema } from "../../zod/signinSchema";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens";
import { setTokenCookie } from "../../utils/setTokenCookie";

export const signup: RequestHandler<{}, {}, TSignupRequestBody, {}> = async (
  req,
  res
) => {
  try {
    const parsedData = userSignupSchema.parse(req.body);
    const normalisedData = normaliseRequestBody(parsedData);
    const { fullName, email, password } = normalisedData;

    // check if the user already exists
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const accessToken = generateAccessToken(
      savedUser._id.toString(),
      savedUser.isAdmin,
      res
    ) as string;
    const refreshToken = generateRefreshToken(
      savedUser._id.toString(),
      savedUser.isAdmin,
      savedUser.tokenVersion,
      res
    ) as string;

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    res.status(201).json({
      fullName: savedUser.fullName,
      isAdmin: savedUser.isAdmin,
      message: "Signed in successfully",
    });
  } catch (error) {
    handleControllerError(error, res, "signup");
  }
};

export const login: RequestHandler<{}, {}, TLoginRequestBody, {}> = async (
  req,
  res
) => {
  try {
    const parsedData = signinSchema.parse(req.body);
    const { email, password } = parsedData;

    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      res.status(400).json({ error: "Invalid login details" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid login details" });
      return;
    }

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.isAdmin,
      res
    ) as string;
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.isAdmin,
      user.tokenVersion,
      res
    ) as string;

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    res
      .status(200)
      .json({
        fullName: user.fullName,
        isAdmin: user.isAdmin,
        message: "Logged in successfully",
      });
  } catch (error) {
    handleControllerError(error, res, "login");
  }
};

export const logout: RequestHandler = async (_, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    handleControllerError(error, res, "logout");
  }
};

export const makeUserAdmin = async (req: TUserTokenRequest, res: Response) => {
  try {
    const { adminPassword } = req.body;
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      res.status(400).json({ error: "Invalid admin password" });
      return;
    }

    const userId = req.user?.userId;

    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { isAdmin: true } },
      { runValidators: true }
    ).lean();
    if (!user) {
      console.log("[server] makeUserAdmin: User cannot be found");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    res.status(201).json({
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      message: "User now admin",
    });
  } catch (error) {
    handleControllerError(error, res, "makeUserAdmin");
  }
};

export const logOutOnAllDevices = async (
  req: TUserTokenRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { tokenVersion: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    res.status(200).json({ message: "Logged out on all devices successfully" });
  } catch (error) {
    handleControllerError(error, res, "logOutOnAllDevices");
  }
};
