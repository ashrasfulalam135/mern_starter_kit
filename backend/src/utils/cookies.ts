import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, oneWeekFromNow } from "./date";

const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
	httpOnly: true,
	secure,
	sameSite: "strict",
};

const getAccessTokenCookieOptions = (): CookieOptions => {
	return {
		...defaults,
		expires: fifteenMinutesFromNow(), // 15 minutes expiration
	};
};

const getRefreshTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: oneWeekFromNow(), // 7 days expiration
	path: "/auth/refresh", // only send refresh token to this route
});

type Params = {
	res: Response;
	accessToken: string;
	refreshToken: string;
};
export const setAuthCookie = ({ res, accessToken, refreshToken }: Params) => res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
