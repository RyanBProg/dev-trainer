import { Router } from "express";
import { getGenerateSnippet } from "../controllers/snippets/snippetsControllers";
import { checkSession } from "../middleware/checkSession";

const router = Router();

router.post("/", getGenerateSnippet);

export default router;
