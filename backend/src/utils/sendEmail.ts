import nodemailer from "../config/nodemailer";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
	to: string;
	subject: string;
	text: string;
	html: string;
};

const getFromEmail = () => (NODE_ENV === "development" ? "info@mern.com" : EMAIL_SENDER);
const getToEmail = (to: string) => (NODE_ENV === "development" ? "ashrafulalam135@gmail.com" : to);

export const sendEmail = async ({ to, subject, text, html }: Params) => await nodemailer.sendMail({ from: getFromEmail(), to: getToEmail(to), subject, text, html });
