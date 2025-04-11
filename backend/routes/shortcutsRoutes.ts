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
import checkAdminUser from "../middleware/checkAdminUser";
import { checkSession } from "../middleware/checkSession";

const router = express.Router();

// returns an array of all shortcuts
router.get("/", checkSession, getShortcuts);
// returns an array of shortcuts of a specific type
router.get("/type/:type", checkSession, getShortcutsOfType);
// returns an array of all types
router.get("/types", checkSession, getShortcutTypes);
// admin route for creating a new shortcut, returns a success message
router.post("/admin", checkSession, checkAdminUser, createNewShortcut);
// admin routes for updating a shortcut, returns a success message
router.put("/admin/:id", checkSession, checkAdminUser, updateShortcut);
// admin routes for deleting a shortcut, returns a success message
router.delete("/admin/:id", checkSession, checkAdminUser, deleteShortcut);
// returns a single shortcut
router.get("/:id", checkSession, getShortcut);

export default router;
