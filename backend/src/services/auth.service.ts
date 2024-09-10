import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUEST, UNAUTHORIZED } from "../constants/httpStatusCode";
import VerificationCodeType from "../constants/verificationCodeType";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel from "../models/verificationCode.model";
import appAssert from "../utils/appAssert";
import { fourWeeksFromNow, oneDayInMS, fiveMinutesAgo, oneHourFromNow } from "../utils/date";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import { sendEmail } from "../utils/sendEmail";

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
	const url = `${APP_ORIGIN}/email/verify/${verificationToken._id}`;
	const res = await sendEmail({
		to: user.email,
		...getVerifyEmailTemplate(url),
	});
	appAssert(res?.messageId, INTERNAL_SERVER_ERROR, "There is an internal server issue, please try again later");

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

export const refreshUserAccessToken = async (refreshToken: string) => {
	const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
		secret: refreshTokenSignOptions.secret,
	});
	appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

	//verify session
	const session = await SessionModel.findById(payload.sessionId);
	const now = Date.now();
	appAssert(session && session.expiredAt.getTime() > now, UNAUTHORIZED, "Expired session");

	//check refresh token expire in one day then refresh token
	const sessionNeedsRefresh = session.expiredAt.getTime() - now <= oneDayInMS();
	if (sessionNeedsRefresh) {
		session.expiredAt = fourWeeksFromNow();
		await session.save();
	}

	const newRefreshToken = sessionNeedsRefresh ? signToken({ sessionId: session._id }, refreshTokenSignOptions) : undefined;
	const accessToken = signToken({ sessionId: session._id, userId: session.userId });
	return {
		accessToken,
		newRefreshToken,
	};
};

export const verifyEmail = async (code: string) => {
	// get the verification code
	const vaildCode = await VerificationCodeModel.findOne({
		_id: code,
		type: VerificationCodeType.EmailVerification,
		expiredAt: { $gt: new Date() },
	});
	appAssert(vaildCode, UNAUTHORIZED, "Invalid verification code");

	// get user by id and update user to verified true
	const updatedUser = await UserModel.findByIdAndUpdate(vaildCode.userId, { verified: true }, { new: true });
	appAssert(updatedUser, UNAUTHORIZED, "Failed to verify email");

	// delete verification code
	await vaildCode.deleteOne();

	// return user
	return {
		user: updatedUser.omitPassword(),
	};
};

export const sendPasswordResetEmail = async (email: string) => {
	// verify user by email
	const user = await UserModel.findOne({ email });
	appAssert(user, NOT_FOUND, "User not found");

	// check email rate limit
	const fiveMinAgo = fiveMinutesAgo();
	const count = await VerificationCodeModel.countDocuments({
		userId: user._id,
		type: VerificationCodeType.PasswordReset,
		createdAt: { $gte: fiveMinAgo },
	});
	appAssert(count <= 1, TOO_MANY_REQUEST, "Too many password reset requests. Please try again later");

	// create verification Code
	const expiredAt = oneHourFromNow();
	const verificationCode = await VerificationCodeModel.create({
		userId: user._id,
		type: VerificationCodeType.PasswordReset,
		expiredAt, // 1 hour expiration
	});

	//send password reset email
	const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiredAt.getTime()}`;
	const data = await sendEmail({
		to: user.email,
		...getPasswordResetTemplate(url),
	});
	appAssert(data?.messageId, INTERNAL_SERVER_ERROR, "There is an internal server issue, please try again later");

	// return response
	return {
		url,
		emailId: data.accepted[0],
	};
};
