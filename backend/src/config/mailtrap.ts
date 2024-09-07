import { MailtrapClient } from "mailtrap";
import { MAILTRAP_API_KEY } from "../constants/env";

const mailtrap = new MailtrapClient({ token: MAILTRAP_API_KEY, testInboxId: 832857 });

export default mailtrap;
