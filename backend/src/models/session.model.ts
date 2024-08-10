import mongoose from "mongoose";
import { oneWeekFromNow } from "../utils/date";

export interface SessionDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	userAgent?: string;
	createdAt: Date;
	expiredAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
	userAgent: { type: String },
	createdAt: { type: Date, required: true, default: Date.now },
	expiredAt: { type: Date, default: oneWeekFromNow },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
