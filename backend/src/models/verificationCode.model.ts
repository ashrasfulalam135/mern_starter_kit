import mongoose from "mongoose";
import VerificationCodeType from "../constants/verificationCodeType";

export interface VerificationCodeDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	type: VerificationCodeType; // will use a constent enum for the token type
	createdAt: Date;
	expiredAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	type: { type: String, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	expiredAt: { type: Date, required: true },
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>("VerificationCode", verificationCodeSchema, "verification_codes");
export default VerificationCodeModel;
