import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import { z } from "zod";
import { userSignupSchema } from "../zod/userSignupSchema";
import UserModel from "../db/models/UserModel";
import catchErrorMessage from "../utils/catchErrorMessage";
import { TSignupRequestBody } from "../types/requestBodyControllersTypes";
import { normaliseRequestBody } from "./auth/utils";

// define the signup controller
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
    if (error instanceof z.ZodError) {
      // handle validation errors from Zod
      console.log(
        `[server] Error in zod userSignupSchema: ${JSON.stringify(
          error.errors
        )}`
      );
      res.status(400).json({ error: error.errors });
      return;
    }

    // handle other errors
    catchErrorMessage("Error in signup controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
