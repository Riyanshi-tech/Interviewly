import {Request ,Response , NextFunction} from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
 export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
    };
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Authorization header missing" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Token missing" });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
       (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
};
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        if (!authReq.user || !roles.includes(authReq.user.role)) {
            res.status(403).json({ error: "Access denied: Unauthorized role" });
            return;
        }
        next();
    };
};
