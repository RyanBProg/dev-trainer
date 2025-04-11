import express from "express";
import {
  signup,
  login,
  logout,
  makeUserAdmin,
  logOutOnAllDevices,
  oAuthSignIn,
  oAuthCallback,
} from "../controllers/auth/authControllers";
import { checkSession } from "../middleware/checkSession";
import { loginAttemptLimiter } from "../utils/rateLimits";

const router = express.Router();

router.get("/oauth-signin", oAuthSignIn);
router.get("/oauth-callback", oAuthCallback);
router.post("/signup", signup);
router.post("/login", loginAttemptLimiter, login);
router.post("/logout", logout);
router.post(
  "/make-user-admin",
  loginAttemptLimiter,
  checkSession,
  makeUserAdmin
);
router.post("/logout-all", checkSession, logOutOnAllDevices);

export default router;
