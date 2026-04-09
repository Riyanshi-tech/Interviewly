import "dotenv/config"; // Restart trigger
import { prisma } from "./lib/prisma";
import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/auth.routes";
import { authMiddleware, authorizeRoles } from "./middlewares/auth.middleware";
import passport from "./lib/passport";
import session from "express-session";
import interviewRoutes from "./features/interview/interview.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/protected", authMiddleware, (req: any, res) => {
  res.json({
    message: "You are authenticated ",
    user: req.user,
  });
});
app.get(
  "/interviewer-only",
  authMiddleware,
  authorizeRoles("INTERVIEWER"),
  (req, res) => {
    res.send("Only interviewer can access");
  }
);
app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/interview", interviewRoutes);

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});









