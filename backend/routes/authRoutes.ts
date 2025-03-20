import express from "express";
import {
  signup,
  login,
  logout,
  makeUserAdmin,
  logOutOnAllDevices,
} from "../controllers/auth/authControllers";
import { authenticateTokens } from "../middleware/authenticateTokens";
import { attemptLimiter } from "../utils/attemptLimiter";

const router = express.Router();

// route for signing up a new user, returns a success message
router.post("/signup", signup);
// route for logging in a user, returns an access token
router.post("/login", attemptLimiter, login);
// route for logging out a user, returns a success message and voids the access token
router.post("/logout", logout);
// route for making a user an admin, returns a success message
router.post(
  "/make-user-admin",
  attemptLimiter,
  authenticateTokens,
  makeUserAdmin
);
// route for logging out user on all devices by increasing version on refresh token
router.post("/logout-all", authenticateTokens, logOutOnAllDevices);

export default router;
