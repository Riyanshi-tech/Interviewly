import { Request, Response } from "express";
import { createInterview } from "./interview.service";

export const createInterviewHandler = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const interview = await createInterview(userId);

    res.json({
      roomId: interview.roomId,
      link: `http://localhost:5173/room/${interview.roomId}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};