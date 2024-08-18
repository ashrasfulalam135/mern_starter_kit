import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { CREATED, OK } from "../constants/httpStatusCode";
import { setAuthCookie } from "../utils/cookies";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";

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
