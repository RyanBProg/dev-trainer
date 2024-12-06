import express from "express";
import getShortcuts from "../controllers/shortcutsControllers";

const router = express.Router();

router.get("/", getShortcuts);

export default router;
