import express from "express";
import getUserData from "../controllers/users/usersControllers";

const router = express.Router();

router.get("/:id", getUserData);

export default router;
