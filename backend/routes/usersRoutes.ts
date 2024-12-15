import express from "express";
import {
  getUserData,
  addUserShortcut,
  deleteUserShortcut,
} from "../controllers/users/usersControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

router.get("/user", checkUserToken, getUserData);
router.post("/user/shortcuts", checkUserToken, addUserShortcut);
router.delete(
  "/user/shortcuts/:shortcutId",
  checkUserToken,
  deleteUserShortcut
);

export default router;
