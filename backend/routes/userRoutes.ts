import express from "express";
import {
  getUserInfo,
  addUserShortcuts,
  deleteUserShortcut,
  getUserShortcuts,
} from "../controllers/user/userControllers";
import { authenticateTokens } from "../middleware/authenticateTokens";

const router = express.Router();

// returns logged in user's information
router.get("/", authenticateTokens, getUserInfo);
// adds a shortcut to the user's shortcuts, returns an array of user shortcuts
router.post("/shortcuts", authenticateTokens, addUserShortcuts);
// deletes a shortcut from the user's shortcuts, returns an array of user shortcuts
router.delete("/shortcuts/:shortcutId", authenticateTokens, deleteUserShortcut);
// returns an array of user shortcuts
router.get("/shortcuts", authenticateTokens, getUserShortcuts);

export default router;
