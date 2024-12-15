import express from "express";
import getUserData from "../controllers/users/usersControllers";
import protectRoute from "../middleware/protectUserRoute";

const router = express.Router();

router.get("/:id", protectRoute, getUserData);

export default router;
