import express from "express";
import {
  getShortcuts,
  createNewShortcut,
  getShortcut,
  updateShortcut,
  deleteShortcut,
  getShortcutsOfType,
  getShortcutTypes,
} from "../controllers/shortcuts/shortcutsControllers";
import checkUserToken from "../middleware/checkUserToken";
import checkAdminUser from "../middleware/checkAdminUser";

const router = express.Router();

router.get("/", checkUserToken, getShortcuts);
router.get("/type/:type", checkUserToken, getShortcutsOfType);
router.get("/types", checkUserToken, getShortcutTypes);
router.post("/admin", checkUserToken, checkAdminUser, createNewShortcut);
router.put("/admin/:id", checkUserToken, checkAdminUser, updateShortcut);
router.delete("/admin/:id", checkUserToken, checkAdminUser, deleteShortcut);
router.get("/:id", checkUserToken, getShortcut);

export default router;
