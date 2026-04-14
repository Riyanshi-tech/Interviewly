import { Router } from "express";
import { runCode } from "./code.controller";

const router = Router();

router.post("/run", runCode);

export default router;