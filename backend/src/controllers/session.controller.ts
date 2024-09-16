import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { NOT_FOUND, OK } from "../constants/httpStatusCode";
import SessionModel from "../models/session.model";
import { z } from "zod";

export const getSessionsHandler = catchErrors(async (req, res) => {
	const sessions = await SessionModel.find(
		{
			userId: req.userId,
			expiredAt: { $gt: new Date() },
		},
		{
			_id: 1,
			userAgent: 1,
			expiredAt: 1,
		},
		{
			sort: { createdAt: -1 },
		}
	);
	appAssert(sessions.length != 0, NOT_FOUND, "There is no session");

	const responseData = sessions.map((session) => ({
		...session.toObject(),
		...(session.id === req.sessionId && { isCurrent: true }),
	}));

	return res.status(OK).json(responseData);
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
	const sessionId = z.string().parse(req.params.id);
	const deletedSession = await SessionModel.findOneAndDelete({
		_id: sessionId,
		userId: req.userId,
	});
	appAssert(deletedSession, NOT_FOUND, "Session not found");

	return res.status(OK).json({
		message: "Session deleted successfully",
	});
});
