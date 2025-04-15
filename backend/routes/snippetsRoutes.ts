import { Router } from "express";
import { getGenerateSnippet } from "../controllers/snippets/snippetsControllers";
import { checkSession } from "../middleware/checkSession";
import { snippetRequestLimiter } from "../utils/rateLimits";

const router = Router();

router.post("/", checkSession, snippetRequestLimiter, getGenerateSnippet);

export default router;
