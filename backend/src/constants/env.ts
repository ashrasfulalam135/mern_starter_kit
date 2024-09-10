const getEnv = (key: string, defaultValue?: string): string => {
	const value = process.env[key] || defaultValue;

	if (value === undefined) {
		throw new Error(`Environment ${key} not found`);
	}

	return value;
};

export const NODE_ENV = getEnv("NODE_ENV");
export const PORT = getEnv("PORT");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const MAILTRAP_API_KEY = getEnv("MAILTRAP_API_KEY");
export const APP_ORIGIN = getEnv("APP_ORIGIN");

export const MAIL_MAILER = getEnv("MAIL_MAILER");
export const MAIL_HOST = getEnv("MAIL_HOST");
export const MAIL_PORT = getEnv("MAIL_PORT");
export const MAIL_USERNAME = getEnv("MAIL_USERNAME");
export const MAIL_PASSWORD = getEnv("MAIL_PASSWORD");
export const MAIL_ENCRYPTION = getEnv("MAIL_ENCRYPTION");
export const MAIL_FROM_ADDRESS = getEnv("MAIL_FROM_ADDRESS");
export const MAIL_FROM_NAME = getEnv("MAIL_FROM_NAME");
