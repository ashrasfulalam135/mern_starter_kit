import mongoose from "mongoose";

declare global {
	namespace Express {
		interface Request {
			userId: mongoose.Types.string;
			sessionId: mongoose.Types.string;
		}
	}
}

export {};
