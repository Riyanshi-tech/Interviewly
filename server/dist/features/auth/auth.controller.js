"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.signup = void 0;
const auth_service_1 = require("./auth.service");
const auth_service_2 = require("./auth.service");
const signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const result = await (0, auth_service_1.signupUser)(email, password, role);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginUser)(email, password);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await (0, auth_service_2.getCurrentUser)(userId);
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map