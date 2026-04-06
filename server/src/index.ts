import "dotenv/config"; // Restart trigger
import { prisma } from "./lib/prisma";
import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/auth.routes";
import { authMiddleware, authorizeRoles } from "./middlewares/auth.middleware";

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

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});









