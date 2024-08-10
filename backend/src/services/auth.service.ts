import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT } from "../constants/httpStatusCode";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { fourWeeksFromNow, oneWeekFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

export type CreateAccountParams = {
	email: string;
	password: string;
	userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
	//verify existing user by email (we need model for that to work)
	const existingUser = await UserModel.exists({ email: data.email });
	appAssert(!existingUser, CONFLICT, "Email already in use");

	//create new user
	const user = await UserModel.create({
		email: data.email,
		password: data.password,
	});

	//create verification token
	const verificationToken = await VerificationCodeModel.create({
		userId: user._id,
		type: VerificationCodeType.EmailVerification,
		expiredAt: fourWeeksFromNow(), // 4 Week expiration
	});

	//send verification email

	//create session
	const session = await SessionModel.create({
		userId: user._id,
		userAgent: data.userAgent,
	});

	//sign access token & refresh access token
	const refreshToken = jwt.sign({ sessionId: session._id }, JWT_REFRESH_SECRET, {
		audience: ["user"],
		expiresIn: "7d", // 7 days expiration
	});

	const accessToken = jwt.sign({ userId: user._id, sessionId: session._id }, JWT_SECRET, {
		audience: ["user"],
		expiresIn: "15m", // 15 minutes expiration
	});

	//return user & tokens
	return {
		user: user.omitPassword(),
		accessToken,
		refreshToken,
	};
};
