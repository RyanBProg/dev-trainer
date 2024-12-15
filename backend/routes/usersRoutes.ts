import express from "express";
import getUserData from "../controllers/users/usersControllers";
import checkUserToken from "../middleware/checkUserToken";

const router = express.Router();

router.get("/user", checkUserToken, getUserData);

export default router;
