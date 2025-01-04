import bcrypt from "bcryptjs";
import { z } from "zod";
import { RequestHandler, Response } from "express";
import { userSignupSchema } from "../../zod/userSignupSchema";
import UserModel from "../../db/models/UserModel";
import {
  TLoginRequestBody,
  TSignupRequestBody,
  TUserTokenRequest,
} from "../../types/requestBodyControllersTypes";
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

    // create a new user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });

    // explicit check for the new user
    if (newUser) {
      const savedUser = await newUser.save();
      generateAccessTokenAndSetCookie(
        savedUser._id.toString(),
        savedUser.isAdmin,
        res
      );

      // send the created user details as a response
      res.status(201).json({
        fullName: savedUser.fullName,
      });
      return;
    } else {
      res.status(400).json({ error: "Invalid user data" });
      return;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`[server] Error in signup: ${JSON.stringify(error.errors)}`);
    } else if (error instanceof Error) {
      console.log(`[server] Error in signup: ${error.message}`);
    } else {
      console.error("[server] Error in signup");
    }

    res.status(500).json({ error: "Internal server error" });
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

    // return user object
    res.status(200).json({
      fullName: user.fullName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`[server] Error in login: ${JSON.stringify(error.errors)}`);
    } else if (error instanceof Error) {
      console.log(`[server] Error in login: ${error.message}`);
    } else {
      console.error("[server] Error in login");
    }

    res.status(500).json({ error: "Internal server error" });
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
    if (error instanceof Error) {
      console.log(`[server] Error in logout: ${error.message}`);
    } else {
      console.error("[server] Error in logout");
    }

    res.status(500).json({ error: "Internal server error" });
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
    if (error instanceof Error) {
      console.log(`[server] Error in validateToken: ${error.message}`);
    } else {
      console.error("[server] Error in validateToken");
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
