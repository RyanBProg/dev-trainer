import express from "express";
import getUserData from "../controllers/userControllers";

const router = express.Router();

router.get("/:id", getUserData);

export default router;
