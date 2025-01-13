import express from "express";
import {
  getUserInfo,
  addUserShortcuts,
  deleteUserShortcut,
  getUserShortcuts,
} from "../controllers/user/userControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

// returns logged in user's information
router.get("/", checkUserToken, getUserInfo);
// adds a shortcut to the user's shortcuts, returns an array of user shortcuts
router.post("/shortcuts", checkUserToken, addUserShortcuts);
// deletes a shortcut from the user's shortcuts, returns an array of user shortcuts
router.delete("/shortcuts/:shortcutId", checkUserToken, deleteUserShortcut);
// returns an array of user shortcuts
router.get("/shortcuts", checkUserToken, getUserShortcuts);

export default router;
