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

// returns an array of all shortcuts
router.get("/", checkUserToken, getShortcuts);
// returns an array of shortcuts of a specific type
router.get("/type/:type", checkUserToken, getShortcutsOfType);
// returns an array of all types
router.get("/types", checkUserToken, getShortcutTypes);
// admin route for creating a new shortcut, returns a success message
router.post("/admin", checkUserToken, checkAdminUser, createNewShortcut);
// admin routes for updating a shortcut, returns a success message
router.put("/admin/:id", checkUserToken, checkAdminUser, updateShortcut);
// admin routes for deleting a shortcut, returns a success message
router.delete("/admin/:id", checkUserToken, checkAdminUser, deleteShortcut);
// returns a single shortcut
router.get("/:id", checkUserToken, getShortcut);

export default router;
