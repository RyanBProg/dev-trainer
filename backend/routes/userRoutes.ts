import express from "express";
import {
  getUserInfo,
  addUserShortcuts,
  deleteUserShortcut,
  getUserShortcuts,
  addProfilePicture,
  getUserProfilePicture,
  addUserFullName,
  deleteUser,
} from "../controllers/user/userControllers";
import { checkSession } from "../middleware/checkSession";
import { upload } from "../middleware/multerConfig";

const router = express.Router();

// returns logged in user's information
router.get("/", checkSession, getUserInfo);
// adds a shortcut to the user's shortcuts, returns an array of user shortcuts
router.post("/shortcuts", checkSession, addUserShortcuts);
// deletes a shortcut from the user's shortcuts, returns an array of user shortcuts
router.delete("/shortcuts/:shortcutId", checkSession, deleteUserShortcut);
// returns an array of user shortcuts
router.get("/shortcuts", checkSession, getUserShortcuts);
// minifys and then adds/updates the users profile picture
router.post(
  "/profile-picture",
  checkSession,
  upload.single("image"),
  addProfilePicture
);
// returns user's profile picture
router.get("/profile-picture", checkSession, getUserProfilePicture);
// updates the users fullName
router.post("/full-name", checkSession, addUserFullName);
// completely deletes a user from the database
router.delete("/delete-user", checkSession, deleteUser);

export default router;
