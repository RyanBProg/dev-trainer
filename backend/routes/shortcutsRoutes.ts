import express from "express";
import {
  getShortcuts,
  createNewShortcut,
  getShortcut,
} from "../controllers/shortcutsControllers";

const router = express.Router();

router.get("/", getShortcuts);
router.post("/", createNewShortcut);
router.get("/:id", getShortcut);
// router.put("/:id", updateShortcut);
// router.post("/:id", deleteShortcut);

export default router;
