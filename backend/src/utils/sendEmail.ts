// import mailtrap from "../config/mailtrap";
import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

const getFromEmail = () =>
	NODE_ENV === "development" ? "onboarding@resend.com" : EMAIL_SENDER; // for resend
	//NODE_ENV === "development" ? { name: "Onboard", email: "onboarding@resend.com" } : { name: "Onboard", email: EMAIL_SENDER }; //for mailtrap

const getToEmail = (to: string) =>
	NODE_ENV === "development" ? "delivered@resend.com" : to; //for resend
	//NODE_ENV === "development" ? [{ email: "delivered@resend.com" }] : [{email : to}]; //for mailtrap

export const sendEmail = async ({ to, subject, text, html }: Params) =>
	//send by resend
	await resend.emails.send({ from: getFromEmail(), to: getToEmail(to), subject, text, html});
	//send by mailtrap
	//await mailtrap.testing.send({ from: getFromEmail(), to: getToEmail(to), subject, text, html });
