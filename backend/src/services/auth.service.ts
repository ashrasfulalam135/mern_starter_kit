import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/httpStatusCode";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { fourWeeksFromNow, oneWeekFromNow } from "../utils/date";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";

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

	const userId = user._id;

	//create verification token
	const verificationToken = await VerificationCodeModel.create({
		userId,
		type: VerificationCodeType.EmailVerification,
		expiredAt: fourWeeksFromNow(), // 4 Week expiration
	});

	//send verification email

	//create session
	const session = await SessionModel.create({
		userId,
		userAgent: data.userAgent,
	});

	//sign access token & refresh access token
	const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions);

	const accessToken = signToken({ userId, sessionId: session._id });

	//return user & tokens
	return {
		user: user.omitPassword(),
		accessToken,
		refreshToken,
	};
};

export type LoginUserParams = {
	email: string;
	password: string;
	userAgent?: string;
};

export const loginUser = async ({ email, password, userAgent }: LoginUserParams) => {
	//verify user by email
	const user = await UserModel.findOne({ email });
	appAssert(user, UNAUTHORIZED, "Invalid email or password");

	//verify password
	const isPasswordValid = await user.comparePassword(password);
	appAssert(isPasswordValid, UNAUTHORIZED, "Invalid email or password");

	//create session
	const userId = user._id;
	const session = await SessionModel.create({
		userId,
		userAgent,
	});

	//sign access token & refresh access token
	const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions);

	const accessToken = signToken({ sessionId: session._id, userId });

	return {
		user: user.omitPassword(),
		accessToken,
		refreshToken,
	};
};
