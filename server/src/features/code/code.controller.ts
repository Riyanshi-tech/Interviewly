import { Request, Response } from "express";
import { executeCode } from "./code.service";

export const runCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const result = await executeCode(code);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};