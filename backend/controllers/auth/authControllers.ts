import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import UserModel from "../../db/models/UserModel";
import { TLoginRequestBody, TSignupRequestBody } from "../../types/types";
import { handleControllerError } from "../../utils/handleControllerError";
import { normaliseRequestBody } from "./utils";
import {
  signinSchema,
  adminPasswordSchema,
  userSignupSchema,
} from "../../zod/schemas";
import { env } from "../../zod/envSchema";
import { OAuth2Client } from "google-auth-library";
import { TOAUTH_USER_DATA } from "../../types/types";

const client = new OAuth2Client(
  env.OAUTH_CLIENT_ID,
  env.OAUTH_CLIENT_SECRET,
  env.OAUTH_REDIRECT_URL
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const oAuthSignIn: RequestHandler = async (_, res) => {
  try {
    const authUrl = client.generateAuthUrl({
      access_type: "offline", // For a refresh token
      scope: scopes,
      redirect_uri: env.OAUTH_REDIRECT_URL,
      // prompt: "consent",
      // include_granted_scopes: true,
    });

    res.redirect(authUrl);
  } catch (error) {
    handleControllerError(error, res, "oAuthSignIn");
  }
};

export const oAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query; // The authorization code sent from the frontend
    if (!code) {
      res.status(400).json({ message: "Missing authorization code" });
      return;
    }
    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code as string);
    if (!tokens) {
      res.status(400).json({ message: "Failed to get tokens" });
      return;
    }

    // Set the credentials for the client
    client.setCredentials(tokens);

    // Get user info
    const userTokenInfo = await client.getTokenInfo(
      tokens.access_token as string
    );
    if (!userTokenInfo) {
      res.status(400).json({ message: "Failed to get user info" });
      return;
    }

    const url = "https://www.googleapis.com/oauth2/v3/userinfo";
    const userProfile = await client.request({ url });

    // Update user tokens if one exists
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userTokenInfo.email },
      {
        $set: {
          oAuth_access_token: tokens.access_token,
          oAuth_refresh_token: tokens.refresh_token,
          oAuth_token_expiry: new Date(tokens.expiry_date!),
        },
      },
      {
        new: true,
        sanitizeFilter: true,
      }
    );

    if (!updatedUser) {
      // Create and save new user
      const newUser = new UserModel({
        googleId: userTokenInfo.sub,
        email: userTokenInfo.email,
        fullName:
          (userProfile.data as TOAUTH_USER_DATA).name || "Anonymous User",
        givenName:
          (userProfile.data as TOAUTH_USER_DATA).given_name || "Anonymous",
        familyName:
          (userProfile.data as TOAUTH_USER_DATA).family_name || "User",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: new Date(tokens.expiry_date!),
      });

      const savedUser = await newUser.save();
      req.session.userId = savedUser._id.toString();
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          resolve(true);
        });
      });
    } else {
      req.session.userId = updatedUser._id.toString();
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          resolve(true);
        });
      });
    }

    // Explicitly set cookie options
    res.cookie("session-id", req.sessionID, {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? "devtrainer.net" : undefined,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(`${env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    handleControllerError(error, res, "oAuthCallback");
  }
};

export const signup: RequestHandler<{}, {}, TSignupRequestBody, {}> = async (
  req,
  res
) => {
  try {
    // zod validation
    const parsedResult = userSignupSchema.safeParse(req.body);
    if (!parsedResult.success) {
      res.status(422).json({
        message:
          parsedResult.error.errors[0]?.message ||
          "Invalid sign up input field(s)",
        code: "AUTH_INVALID_REQUEST_DATA",
      });
      return;
    }

    const normalisedData = normaliseRequestBody(parsedResult.data);
    const { fullName, email, password } = normalisedData;

    // Check if user exists and has password set
    const existingUser = await UserModel.findOne({ email })
      .select("password")
      .setOptions({
        sanitizeFilter: true,
      });

    if (existingUser?.password && existingUser.password.length > 0) {
      res.status(409).json({
        message: "User already exists",
        code: "AUTH_USER_ALREADY_EXISTS",
      });
      return;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upsert new or existing user
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        upsert: true,
        new: true,
        sanitizeFilter: true,
      }
    );

    // req.session.userId = updatedUser._id.toString();
    // req.session.save();

    req.session.userId = updatedUser._id.toString();
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });

    // Explicitly set cookie options
    res.cookie("session-id", req.sessionID, {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? "devtrainer.net" : undefined,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      fullName: updatedUser.fullName,
      isAdmin: updatedUser.isAdmin,
      message: "Signed up successfully",
      code: "AUTH_USER_SIGNED_UP",
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
    // zod validation
    const parsedResult = signinSchema.safeParse(req.body);
    if (!parsedResult.success) {
      res.status(422).json({
        message:
          parsedResult.error.errors[0]?.message ||
          "Invalid login input field(s)",
        code: "AUTH_INVALID_REQUEST_DATA",
      });
      return;
    }

    const { email, password } = parsedResult.data;

    const user = await UserModel.findOne({ email: email.toLowerCase() })
      .lean()
      .setOptions({ sanitizeFilter: true });
    if (!user) {
      res.status(401).json({
        message: "Email or password is incorrect",
        code: "AUTH_INVALID_CREDENTIALS",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password!);
    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Email or password is incorrect",
        code: "AUTH_INVALID_CREDENTIALS",
      });
      return;
    }

    // req.session.userId = user._id.toString();
    // req.session.save();

    req.session.userId = user._id.toString();
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });

    // Explicitly set cookie options
    res.cookie("session-id", req.sessionID, {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? "devtrainer.net" : undefined,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      message: "Logged in successfully",
      code: "AUTH_USER_LOGGED_IN",
    });
  } catch (error) {
    handleControllerError(error, res, "login");
  }
};

export const logout: RequestHandler = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction failed:", err);
      res.status(500).json({ error: "Logout failed" });
      return;
    }

    res.clearCookie("session-id", {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? "devtrainer.net" : undefined,
      path: "/",
    });
    res.json({ message: "Logged out successfully" });
  });
};

export const makeUserAdmin: RequestHandler = async (req, res) => {
  try {
    const parsedResult = adminPasswordSchema.safeParse(req.body);
    if (!parsedResult.success) {
      res.status(422).json({
        message:
          parsedResult.error.errors[0]?.message ||
          "Invalid admin password format",
        code: "AUTH_INVALID_ADMIN_PASSWORD_FORMAT",
      });
      return;
    }

    const { adminPassword } = parsedResult.data;
    if (adminPassword !== env.ADMIN_PASSWORD) {
      res.status(403).json({
        message: "Invalid admin password",
        code: "AUTH_INVALID_ADMIN_PASSWORD",
      });
      return;
    }

    const userId = req.user?.userId;

    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { isAdmin: true } },
      { new: true, runValidators: true }
    ).lean();
    if (!user) {
      res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    res.status(201).json({
      fullName: user.fullName,
      isAdmin: user.isAdmin,
      message: "User now admin",
      code: "AUTH_USER_NOW_ADMIN",
    });
  } catch (error) {
    handleControllerError(error, res, "makeUserAdmin");
  }
};

export const logOutOnAllDevices: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;

    // [todo] - implement

    res.status(200).json({
      message: "Logged out on all devices successfully",
      code: "AUTH_LOGGED_OUT_ON_ALL_DEVICES",
    });
  } catch (error) {
    handleControllerError(error, res, "logOutOnAllDevices");
  }
};
