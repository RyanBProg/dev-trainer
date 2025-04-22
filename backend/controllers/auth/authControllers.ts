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
import { encryptToken } from "../../utils/encryptToken";

const client = new OAuth2Client(
  env.OAUTH_CLIENT_ID,
  env.OAUTH_CLIENT_SECRET,
  env.OAUTH_REDIRECT_URL
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const oAuthSignIn: RequestHandler = async (req, res) => {
  try {
    const authUrl = client.generateAuthUrl({
      access_type: "offline", // For a refresh token
      scope: scopes,
      redirect_uri: env.OAUTH_REDIRECT_URL,
      // prompt: "consent",
    });

    res.redirect(authUrl);
  } catch (error) {
    handleControllerError(error, res, "oAuthSignIn");
  }
};

export const oAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      res.status(400).json({ message: "Missing authorization code" });
      return;
    }

    const { tokens } = await client.getToken(code as string);
    if (!tokens) {
      res.status(400).json({ message: "Failed to get tokens" });
      return;
    }

    client.setCredentials(tokens);
    const userTokenInfo = await client.getTokenInfo(
      tokens.access_token as string
    );
    if (!userTokenInfo) {
      res.status(400).json({ message: "Failed to get user info" });
      return;
    }

    // Check if user exists and was deleted
    const existingUser = await UserModel.findOne({
      email: userTokenInfo.email,
    })
      .select("wasDeleted oAuth_refresh_token")
      .lean();

    // If user was deleted but we didn't get a refresh token, redirect to sign in again
    if (
      existingUser &&
      !tokens.refresh_token &&
      !existingUser.oAuth_refresh_token
    ) {
      const newAuthUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        redirect_uri: env.OAUTH_REDIRECT_URL,
        prompt: "consent", // Force consent only for previously deleted users
      });
      return res.redirect(newAuthUrl);
    }

    const url = "https://www.googleapis.com/oauth2/v3/userinfo";
    const userProfile = await client.request({ url });
    const userData = userProfile.data as TOAUTH_USER_DATA;

    const updateData = {
      googleId: userTokenInfo.sub,
      email: userTokenInfo.email,
      fullName: userData.name || "Anonymous User",
      givenName: userData.given_name || "Anonymous",
      familyName: userData.family_name || "User",
      oAuth_access_token: encryptToken(tokens.access_token!),
      oAuth_refresh_token: encryptToken(
        tokens.refresh_token || existingUser?.oAuth_refresh_token!
      ),
      oAuth_token_expiry: new Date(tokens.expiry_date!),
      wasDeleted: false, // reset
    };

    // If user was deleted, update timestamps
    const options = existingUser?.wasDeleted
      ? { new: true, timestamps: true }
      : { new: true, setDefaultsOnInsert: true };

    // Update or create user
    const user = await UserModel.findOneAndUpdate(
      { email: userTokenInfo.email },
      { $set: updateData },
      { ...options, upsert: true }
    );

    // Set session
    req.session.userId = user?._id.toString();
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });

    // Set cookie
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
    const parsedResult = userSignupSchema.safeParse(req.body);
    if (!parsedResult.success) {
      res.status(422).json({
        message:
          parsedResult.error.errors[0]?.message || "Invalid sign up data",
        code: "AUTH_INVALID_REQUEST_DATA",
      });
      return;
    }

    const normalisedData = normaliseRequestBody(parsedResult.data);
    const { fullName, email, password } = normalisedData;

    // Check existing user
    const existingUser = await UserModel.findOne({ email })
      .select("wasDeleted")
      .lean();
    if (existingUser && !existingUser.wasDeleted) {
      res.status(409).json({
        message: "User already exists",
        code: "AUTH_USER_ALREADY_EXISTS",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update or create user
    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
          fullName,
          wasDeleted: false,
        },
        ...(existingUser?.wasDeleted && {
          $currentDate: {
            updatedAt: true,
            createdAt: true,
          },
        }),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    req.session.userId = user._id.toString();
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });

    res.cookie("session-id", req.sessionID, {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? "devtrainer.net" : undefined,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      fullName: user.fullName,
      isAdmin: user.isAdmin,
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

    if (!user.password) {
      res.status(401).json({
        message:
          "Login with Google - Login with your Google account and set a password to use password login",
        code: "ACCOUNT_ALREADY_REGISTERED",
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

    console.log("3");

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
    if (req.user?.isAdmin) {
      res.status(400).json({
        message: "User is already an admin",
        code: "USER_ALREADY_IS_ADMIN",
      });
      return;
    }

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
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized - No user ID",
        code: "AUTH_NO_USER_ID",
      });
      return;
    }

    // Get Redis store from session
    const redisStore = req.sessionStore as any;

    // Get all sessions more efficiently
    const deleteUserSessions = () =>
      new Promise((resolve, reject) => {
        // Use Redis scan instead of getting all sessions at once
        redisStore.ids((error: Error | null, ids: string[]) => {
          if (error) {
            return reject(error);
          }

          // Process sessions in batches
          const batchSize = 100;
          const batches = [];

          for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize).map(
              (sid) =>
                new Promise<void>((resolveSession) => {
                  redisStore.get(sid, (err: Error | null, session: any) => {
                    if (err || !session) {
                      resolveSession();
                      return;
                    }

                    if (session.userId === userId) {
                      redisStore.destroy(sid, (destroyErr: Error | null) => {
                        if (destroyErr) {
                          console.error(
                            `Failed to destroy session ${sid}:`,
                            destroyErr
                          );
                        }
                        resolveSession();
                      });
                    } else {
                      resolveSession();
                    }
                  });
                })
            );

            batches.push(Promise.all(batch));
          }

          Promise.all(batches).then(resolve).catch(reject);
        });
      });

    await deleteUserSessions();

    // Clear the current session cookie
    res.clearCookie("session-id", {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      domain: env.NODE_ENV === "production" ? "devtrainer.net" : undefined,
      path: "/",
    });

    res.status(200).json({
      message: "Logged out on all devices successfully",
      code: "AUTH_LOGGED_OUT_ON_ALL_DEVICES",
    });

    return;
  } catch (error) {
    handleControllerError(error, res, "logOutOnAllDevices");
  }
};
