import express from "express";
import {
  getUserInfo,
  addUserShortcut,
  deleteUserShortcut,
  getUserShortcuts,
} from "../controllers/user/userControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

router.get("/", checkUserToken, getUserInfo);
router.post("/shortcuts", checkUserToken, addUserShortcut);
router.delete("/shortcuts/:shortcutId", checkUserToken, deleteUserShortcut);
router.get("/shortcuts", checkUserToken, getUserShortcuts);

export default router;
