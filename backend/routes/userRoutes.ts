import express from "express";
import getUserData from "../controllers/userContollers";

const router = express.Router();

router.get("/:id", getUserData);

export default router;
