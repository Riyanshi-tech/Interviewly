import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
export const generateToken = (payload: object, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
};