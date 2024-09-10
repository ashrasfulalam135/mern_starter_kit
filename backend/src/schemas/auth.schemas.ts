import { z } from "zod";

const passwordValidation = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,}$/);
export const emailSchema = z.string().email().min(1).max(255);
const passwordSchema = z.string().min(8).max(16).regex(passwordValidation, {
	message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
});

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
	.extend({
		confirmPassword: passwordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password do not match",
		path: ["confirmPassword"],
	});

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	verificationCode: verificationCodeSchema,
});
