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
import { authenticateTokens } from "../middleware/authenticateTokens";

const router = express.Router();

// returns an array of all shortcuts
router.get("/", authenticateTokens, getShortcuts);
// returns an array of shortcuts of a specific type
router.get("/type/:type", authenticateTokens, getShortcutsOfType);
// returns an array of all types
router.get("/types", authenticateTokens, getShortcutTypes);
// admin route for creating a new shortcut, returns a success message
router.post("/admin", authenticateTokens, checkAdminUser, createNewShortcut);
// admin routes for updating a shortcut, returns a success message
router.put("/admin/:id", authenticateTokens, checkAdminUser, updateShortcut);
// admin routes for deleting a shortcut, returns a success message
router.delete("/admin/:id", authenticateTokens, checkAdminUser, deleteShortcut);
// returns a single shortcut
router.get("/:id", authenticateTokens, getShortcut);

export default router;
