"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_1 = require("./prisma");
const jwt_1 = require("../utils/jwt");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0].value;
        if (!email) {
            return done(new Error("No email found"), undefined);
        }
        let user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    email,
                    password: "",
                    role: "CANDIDATE",
                },
            });
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
        return done(null, { user, token });
    }
    catch (error) {
        return done(error, undefined);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map