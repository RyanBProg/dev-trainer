import bcrypt from "bcryptjs";
import UserModel from "../db/models/UserModel";
import { Request, Response } from "express";
import catchErrorMessage from "../utils/catchErrorMessage";

async function signup(req: Request, res: Response) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // check inputs
    if (password.length < 8)
      res
        .status(400)
        .json({ error: "Passwords must be longer than 8 characters" });

    if (password !== confirmPassword)
      res.status(400).json({ error: "Passwords don't match" });

    const user = await UserModel.findOne({ email });
    if (user) res.status(400).json({ error: "Email already exists" });

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      custom: savedUser.custom,
    });
  } catch (error) {
    catchErrorMessage("Error in signup controller", error);
  }
}

export default signup;
