import "dotenv/config";
import { prisma } from "./lib/prisma";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./features/auth/auth.routes";
import { authMiddleware, authorizeRoles } from "./middlewares/auth.middleware";
import passport from "./lib/passport";
import session from "express-session";
import interviewRoutes from "./features/interview/interview.routes";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", {
      message,
      sender: socket.id,
    });
  });
socket.on("code-change", ({ roomId, code }) => {
  socket.to(roomId).emit("code-update", code);
});
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
