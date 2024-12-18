import express from "express";
import {
  signup,
  login,
  logout,
  validateToken,
} from "../controllers/auth/authControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/validate-token", checkUserToken, validateToken);

export default router;
