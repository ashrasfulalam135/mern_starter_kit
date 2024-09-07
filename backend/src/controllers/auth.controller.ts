import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser, refreshUserAccessToken, verifyEmail } from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/httpStatusCode";
import { clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, setAuthCookie } from "../utils/cookies";
import { registerSchema, loginSchema, verificationCodeSchema } from "../schemas/auth.schemas";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";

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
	const accessToken = req.cookies.accessToken as string | undefined;
	//varify the access token and remove session
	const { payload } = verifyToken(accessToken || "");
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
	const refreshToken = req.cookies.refreshToken as string | undefined;
	appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

	//call a service
	const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

	// refresh
	if (newRefreshToken) {
		res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
	}

	//return response
	return res.status(OK).cookie("accessToken", accessToken, getAccessTokenCookieOptions()).json({
		message: "Refreshed access token successfully",
	});
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
	const verificationCode = verificationCodeSchema.parse(req.params.code);
	//call a service
	await verifyEmail(verificationCode);
	return res.status(OK).json({
		message: "Email verified successfully",
	});
});
