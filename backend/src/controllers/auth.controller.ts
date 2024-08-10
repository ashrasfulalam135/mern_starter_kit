import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import { createAccount } from "../services/auth.service";
import { CREATED } from "../constants/httpStatusCode";
import { setAuthCookie } from "../utils/cookies";

const passwordValidation = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,}$/);

const registerSchema = z
	.object({
		email: z.string().email().min(1).max(255),
		password: z.string().min(8).max(16).regex(passwordValidation, {
			message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		}),
		confirmPassword: z.string().min(8).max(16).regex(passwordValidation, {
			message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		}),
		userAgent: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password do not match",
		path: ["confirmPassword"],
	});

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
