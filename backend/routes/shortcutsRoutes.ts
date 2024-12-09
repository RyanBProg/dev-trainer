import express from "express";
import {
  getShortcuts,
  createNewShortcut,
  getShortcut,
  updateShortcut,
  deleteShortcut,
} from "../controllers/shortcuts/shortcutsControllers";

const router = express.Router();

router.get("/", getShortcuts);
router.post("/", createNewShortcut);
router.get("/:id", getShortcut);
router.put("/:id", updateShortcut);
router.delete("/:id", deleteShortcut);

export default router;
