import { Router } from "express";
import { createInterviewHandler } from "./interview.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, createInterviewHandler);

export default router;