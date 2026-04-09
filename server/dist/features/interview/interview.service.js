"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterview = void 0;
const prisma_1 = require("../../lib/prisma");
const uuid_1 = require("uuid");
const createInterview = async (userId) => {
    const roomId = (0, uuid_1.v4)();
    const interview = await prisma_1.prisma.interview.create({
        data: {
            roomId,
            createdBy: userId,
        },
    });
    return interview;
};
exports.createInterview = createInterview;
//# sourceMappingURL=interview.service.js.map