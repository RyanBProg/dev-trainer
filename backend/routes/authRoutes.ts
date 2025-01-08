import express from "express";
import {
  signup,
  login,
  logout,
  validateToken,
  makeUserAdmin,
} from "../controllers/auth/authControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

// route for signing up a new user, returns a success message
router.post("/signup", signup);
// route for logging in a user, returns an access token
router.post("/login", login);
// route for logging out a user, returns a success message and voids the access token
router.post("/logout", logout);
// route for validating an access token, returns a success message
router.post("/validate-token", checkUserToken, validateToken);
// route for making a user an admin, returns a success message
router.post("/make-user-admin", checkUserToken, makeUserAdmin);

export default router;
