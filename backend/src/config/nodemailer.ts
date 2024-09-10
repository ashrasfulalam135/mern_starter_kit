import { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD } from "../constants/env";

const { createTransport } = require("nodemailer");

const nodemailer = createTransport({
	host: MAIL_HOST,
	port: MAIL_PORT,
	auth: {
		user: MAIL_USERNAME,
		pass: MAIL_PASSWORD,
	},
});

export default nodemailer;
