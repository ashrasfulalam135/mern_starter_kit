import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, oneWeekFromNow } from "./date";

export const REFRESH_PATH = "/auth/refresh";
const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
	httpOnly: true,
	secure,
	sameSite: "strict",
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
	return {
		...defaults,
		expires: fifteenMinutesFromNow(), // 15 minutes expiration
	};
};

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: oneWeekFromNow(), // 7 days expiration
	path: REFRESH_PATH, // only send refresh token to this route
});

type Params = {
	res: Response;
	accessToken: string;
	refreshToken: string;
};
export const setAuthCookie = ({ res, accessToken, refreshToken }: Params) => res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
export const clearAuthCookies = (res: Response) => res.clearCookie("accessToken").clearCookie("refreshToken", { path: REFRESH_PATH });

