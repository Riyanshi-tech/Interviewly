"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_controller_2 = require("./auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/me", auth_middleware_1.authMiddleware, auth_controller_2.me);
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map