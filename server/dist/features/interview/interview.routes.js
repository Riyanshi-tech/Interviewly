"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const interview_controller_1 = require("./interview.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/create", auth_middleware_1.authMiddleware, interview_controller_1.createInterviewHandler);
exports.default = router;
//# sourceMappingURL=interview.routes.js.map