import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

const getFromEmail = () =>
    NODE_ENV === "development" ? "onboarding@resend.com" : EMAIL_SENDER;

const getToEmail = (to: string) => 
    NODE_ENV === "development" ? "delivered@resend.com" : to;

export const sendEmail = async ({ to, subject, text, html }: Params) =>
	await resend.emails.send({
		from: getFromEmail(),
		to: getToEmail(to),
		subject,
		text,
		html,
	});
