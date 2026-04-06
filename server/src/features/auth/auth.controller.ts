import { Request, Response } from "express";
import { signupUser, loginUser } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getCurrentUser } from "./auth.service";
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const result = await signupUser(email, password, role);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getCurrentUser(userId);

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};