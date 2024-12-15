import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import { userSignupSchema } from "../../zod/userSignupSchema";
import UserModel from "../../db/models/UserModel";
import {
  TLoginRequestBody,
  TSignupRequestBody,
} from "../../types/requestBodyControllersTypes";
import { normaliseRequestBody } from "./utils";
import { handleControllerError } from "../shortcuts/utils";
import { signinSchema } from "../../zod/signinSchema";
import generateTokenAndSetCookie from "../../utils/generateTokenAndSetCookie";
import catchErrorMessage from "../../utils/catchErrorMessage";

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

    // create a new user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });

    // explicit check for the new user
    if (newUser) {
      const savedUser = await newUser.save();

      // send the created user details as a response
      res.status(201).json({
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        custom: savedUser.custom,
      });
      return;
    } else {
      res.status(400).json({ error: "Invalid user data" });
      return;
    }
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

    generateTokenAndSetCookie(user._id.toString(), res);

    // return user object
    res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      custom: user.custom,
    });
  } catch (error) {
    handleControllerError(error, res, "login");
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    catchErrorMessage("Error in getShortcut", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
