import {prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";
export const signupUser = async(email:string,password:string,role:any)=>{
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role
        }
    });
    const token = generateToken({ userId: user.id, role: user.role });
    return { user,token };
};
export const loginUser = async(email:string,password:string)=>{
    console.log("DEBUG: loginUser attempt with email:", email);
    if (!email) {
        throw new Error("Email is required for login");
    }
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = generateToken({ userId: user.id, role: user.role });
    return { user, token };
}
export const getCurrentUser = async(userId : string) => {
    const user = await prisma.user.findUnique({ where: { id: userId },
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