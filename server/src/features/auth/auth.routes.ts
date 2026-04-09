import { Router } from "express";
import { signup, login } from "./auth.controller";
import { me } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import passport from "passport";

const router = Router();
router.get("/me", authMiddleware, me);
router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    res.json(req.user); // contains user + token
  }
);
export default router;