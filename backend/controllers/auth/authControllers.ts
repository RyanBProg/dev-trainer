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
import { generateAccessTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie";

export const signup: RequestHandler<{}, {}, TSignupRequestBody, {}> = async (
  req,
  res
) => {
  try {
    // validate the request body using Zod
    const parsedData = userSignupSchema.parse(req.body);

    // normalise request body to lowercase
    const normalisedData = normaliseRequestBody(parsedData);
    const { fullName, email, password } = normalisedData;

    // check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create an save a new user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    generateAccessTokenAndSetCookie(
      savedUser._id.toString(),
      savedUser.isAdmin,
      res
    );

    res.status(201).json({ fullName: savedUser.fullName });
  } catch (error) {
    handleControllerError(error, res, "signup");
  }
};

export const login: RequestHandler<{}, {}, TLoginRequestBody, {}> = async (
  req,
  res
) => {
  try {
    // validate the request body using Zod
    const parsedData = signinSchema.parse(req.body);
    const { email, password } = parsedData;

    // find the user in the database
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(400).json({ error: "Invalid login details" });
      return;
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid login details" });
      return;
    }

    generateAccessTokenAndSetCookie(user._id.toString(), user.isAdmin, res);

    res.status(200).json({ fullName: user.fullName });
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

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    handleControllerError(error, res, "logout");
  }
};

export const validateToken = async (req: TUserTokenRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const userData = await UserModel.findOne({ _id: userId }).select(
      "-password -custom -_id -__v"
    );
    if (!userData) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Access Token Valid" });
  } catch (error) {
    handleControllerError(error, res, "validateToken");
  }
};

export const makeUserAdmin = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      res.status(400).json({ error: "Invalid admin password" });
      return;
    }

    // get current user

    // if password matches make a db call for current user to change isAdmin to true
  } catch (error) {
    handleControllerError(error, res, "makeUserAdmin");
  }
};
