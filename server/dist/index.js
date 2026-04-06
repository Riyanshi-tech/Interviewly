"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./features/auth/auth.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.get("/protected", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "You are authenticated ",
        user: req.user,
    });
});
app.get("/interviewer-only", auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizeRoles)("INTERVIEWER"), (req, res) => {
    res.send("Only interviewer can access");
});
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
//# sourceMappingURL=index.js.map