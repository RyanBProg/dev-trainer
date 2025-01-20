import express from "express";
import {
  getUserInfo,
  addUserShortcuts,
  deleteUserShortcut,
  getUserShortcuts,
  addProfilePicture,
  getUserProfilePicture,
  addUserFullName,
} from "../controllers/user/userControllers";
import { authenticateTokens } from "../middleware/authenticateTokens";
import { upload } from "../middleware/multerConfig";

const router = express.Router();

// returns logged in user's information
router.get("/", authenticateTokens, getUserInfo);
// adds a shortcut to the user's shortcuts, returns an array of user shortcuts
router.post("/shortcuts", authenticateTokens, addUserShortcuts);
// deletes a shortcut from the user's shortcuts, returns an array of user shortcuts
router.delete("/shortcuts/:shortcutId", authenticateTokens, deleteUserShortcut);
// returns an array of user shortcuts
router.get("/shortcuts", authenticateTokens, getUserShortcuts);
// minifys and then adds/updates the users profile picture
router.post(
  "/profile-picture",
  authenticateTokens,
  upload.single("image"),
  addProfilePicture
);
// returns user's profile picture
router.get("/profile-picture", authenticateTokens, getUserProfilePicture);
// updates the users fullName
router.post("/full-name", authenticateTokens, addUserFullName);

export default router;
