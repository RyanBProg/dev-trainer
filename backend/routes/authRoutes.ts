import express from "express";
import {
  signup,
  login,
  logout,
  makeUserAdmin,
  logOutOnAllDevices,
  oAuthSignIn,
} from "../controllers/auth/authControllers";
import { authenticateTokens } from "../middleware/authenticateTokens";
import { loginAttemptLimiter } from "../utils/rateLimits";

const router = express.Router();

router.get("/oauth-signin", oAuthSignIn);
router.post("/signup", signup);
router.post("/login", loginAttemptLimiter, login);
router.post("/logout", logout);
router.post(
  "/make-user-admin",
  loginAttemptLimiter,
  authenticateTokens,
  makeUserAdmin
);
router.post("/logout-all", authenticateTokens, logOutOnAllDevices);

export default router;
