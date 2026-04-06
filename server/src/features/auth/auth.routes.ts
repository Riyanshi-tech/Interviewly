import { Router } from "express";
import { signup, login } from "./auth.controller";
import { me } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
router.get("/me", authMiddleware, me);
router.post("/signup", signup);
router.post("/login", login);

export default router;