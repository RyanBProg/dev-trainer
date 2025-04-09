import bcrypt from "bcryptjs";
import { RequestHandler, Response, Request } from "express";
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
import { env } from "../../zod/envSchema";
import { adminPasswordSchema } from "../../zod/adminRequestSchema";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  env.OAUTH_CLIENT_ID,
  env.OAUTH_CLIENT_SECRET,
  env.OAUTH_REDIRECT_URL
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const oAuthSignIn = async (_: Request, res: Response) => {
  try {
    const authUrl = client.generateAuthUrl({
      access_type: "offline", // This will ensure you get a refresh token
      scope: scopes,
      redirect_uri: env.OAUTH_REDIRECT_URL,
    });

    res.redirect(authUrl);
  } catch (error) {
    handleControllerError(error, res, "oAuthSignIn");
  }
};

export const oAuthCallback = async (req: Request, res: Response) => {
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
    const userInfo = await client.getTokenInfo(tokens.access_token as string);
    if (!userInfo) {
      res.status(400).json({ message: "Failed to get user info" });
      return;
    }

    const url = "https://www.googleapis.com/oauth2/v3/userinfo";
    const userProfile = await client.request({ url });

    // Save to DB
    // await saveUser({
    //   googleId: userInfo.sub,
    //   email: userInfo.email,
    //   name: userProfile.data.name,
    //   accessToken: tokens.access_token,
    //   refreshToken: tokens.refresh_token,
    //   tokenExpiry: new Date(tokens.expiry_date),
    // });

    // Set session
    // req.session.userId = userInfo.sub;

    // Wait for session to be saved
    // await new Promise((resolve, reject) => {
    //   req.session.save((err) => {
    //     if (err) reject(err);
    //     resolve();
    //   });
    // });

    // Redirect to frontend
    res.redirect(`${env.FRONTEND_URL}`);
  } catch (error) {
    handleControllerError(error, res, "oAuthCallback");
  }
};

// legacy
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

    // check if the user already exists
    const existingUser = await UserModel.findOne({ email })
      .lean()
      .setOptions({ sanitizeFilter: true });
    if (existingUser) {
      res.status(409).json({
        message: "User email already exists",
        code: "AUTH_USER_EMAIL_ALREADY_EXISTS",
      });
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
      savedUser.isAdmin
    );

    const refreshToken = generateRefreshToken(
      savedUser._id.toString(),
      savedUser.isAdmin,
      savedUser.tokenVersion
    );

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    res.status(201).json({
      fullName: savedUser.fullName,
      isAdmin: savedUser.isAdmin,
      message: "Signed up successfully",
      code: "AUTH_USER_SIGNED_UP",
    });
  } catch (error) {
    handleControllerError(error, res, "signup");
  }
};

// legacy
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Email or password is incorrect",
        code: "AUTH_INVALID_CREDENTIALS",
      });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.isAdmin);

    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.isAdmin,
      user.tokenVersion
    );

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

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

export const logout: RequestHandler = async (_, res) => {
  try {
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

    res.status(200).json({
      message: "Logged out successfully",
      code: "AUTH_USER_LOGGED_OUT",
    });
  } catch (error) {
    handleControllerError(error, res, "logout");
  }
};

export const makeUserAdmin = async (req: TUserTokenRequest, res: Response) => {
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
      res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
      return;
    }

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

    res.status(200).json({
      message: "Logged out on all devices successfully",
      code: "AUTH_LOGGED_OUT_ON_ALL_DEVICES",
    });
  } catch (error) {
    handleControllerError(error, res, "logOutOnAllDevices");
  }
};
