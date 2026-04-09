"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.loginUser = exports.signupUser = void 0;
const prisma_1 = require("../../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const signupUser = async (email, password, role) => {
    const existingUser = await prisma_1.prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role
        }
    });
    const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
    return { user, token };
};
exports.signupUser = signupUser;
const loginUser = async (email, password) => {
    console.log("DEBUG: loginUser attempt with email:", email);
    if (!email) {
        throw new Error("Email is required for login");
    }
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
    return { user, token };
};
exports.loginUser = loginUser;
const getCurrentUser = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.service.js.map