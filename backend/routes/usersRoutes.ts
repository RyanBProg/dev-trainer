import express from "express";
import {
  getUserInfo,
  addUserShortcut,
  deleteUserShortcut,
  getUserShortcuts,
} from "../controllers/users/usersControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

router.get("/user", checkUserToken, getUserInfo);
router.post("/user/shortcuts", checkUserToken, addUserShortcut);
router.delete(
  "/user/shortcuts/:shortcutId",
  checkUserToken,
  deleteUserShortcut
);
router.get("/user/shortcuts", checkUserToken, getUserShortcuts);

export default router;
