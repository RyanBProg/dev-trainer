import express from "express";
import {
  getShortcuts,
  createNewShortcut,
  getShortcut,
  updateShortcut,
  deleteShortcut,
} from "../controllers/shortcuts/shortcutsControllers";
import checkUserToken from "../middleware/checkUserToken";
import checkAdminUser from "../middleware/checkAdminUser";

const router = express.Router();

// public routes
router.get("/", checkUserToken, getShortcuts);
router.get("/:id", checkUserToken, getShortcut);

// admin routes
router.post("/admin", checkUserToken, checkAdminUser, createNewShortcut);
router.put("/admin/:id", checkUserToken, checkAdminUser, updateShortcut);
router.delete("/admin/:id", checkUserToken, checkAdminUser, deleteShortcut);

export default router;
