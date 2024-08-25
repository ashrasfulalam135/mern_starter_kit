import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/httpStatusCode";
import { clearAuthCookies, setAuthCookie } from "../utils/cookies";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";

export const registerHandler = catchErrors(async (req, res) => {
	//Validation request
	const request = registerSchema.parse({
		...req.body,
		userAgent: req.headers["user-agent"],
	});
	//Call service
	const { user, accessToken, refreshToken } = await createAccount(request);

	//return response
	return setAuthCookie({ res, accessToken, refreshToken }).status(CREATED).json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
	//validation request
	const request = loginSchema.parse({
		...req.body,
		userAgent: req.headers["user-agent"],
	});
	//Call service
	const { accessToken, refreshToken } = await loginUser(request);

	//return response
	return setAuthCookie({ res, accessToken, refreshToken }).status(OK).json({
		message: "Logged in successfully",
	});
});

export const logoutHandler = catchErrors(async (req, res) => {
	const accessToken = req.cookies.accessToken;
	//varify the access token and remove session
	const { payload } = verifyToken(accessToken);
	if (payload) {
		//remove session from database
		await SessionModel.findByIdAndDelete(payload.sessionId);
	}
	//clear cookies
	return clearAuthCookies(res).status(OK).json({
		message: "Logged out successfully",
	});
});

export const refreshHandler = catchErrors(async (req, res) => {
	
});
