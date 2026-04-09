"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterviewHandler = void 0;
const interview_service_1 = require("./interview.service");
const createInterviewHandler = async (req, res) => {
    try {
        const userId = req.user.userId;
        const interview = await (0, interview_service_1.createInterview)(userId);
        res.json({
            roomId: interview.roomId,
            link: `http://localhost:5173/room/${interview.roomId}`,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createInterviewHandler = createInterviewHandler;
//# sourceMappingURL=interview.controller.js.map