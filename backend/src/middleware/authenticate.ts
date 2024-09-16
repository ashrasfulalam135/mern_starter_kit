import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/httpStatusCode";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";

const authenticate: RequestHandler = (req, res, next) => {
	const accessToken = req.cookies.accessToken as string;
	appAssert(accessToken, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidAccessToken);

	const { error, payload } = verifyToken(accessToken);
	appAssert(payload, UNAUTHORIZED, error === "jwt expired" ? "Token expired" : "Invalid Token", AppErrorCode.InvalidAccessToken);

	req.userId = payload.userId;
	req.sessionId = payload.sessionId;

	next();
};

export default authenticate;
