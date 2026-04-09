import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const createInterview = async (userId: string) => {
  const roomId = uuidv4();

  const interview = await prisma.interview.create({
    data: {
      roomId,
      createdBy: userId,
    },
  });

  return interview;
};