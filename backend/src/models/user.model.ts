import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
	email: string;
	password: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
	omitPassword(): Pick<UserDocument, "_id" | "email" | "verified" | "createdAt" | "updatedAt" | "__v">;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		verified: { type: Boolean, required: true, default: false },
	},
	{
		timestamps: true,
	}
);

// schema hookes use to check and certain occurence,
// here we are using "pre" so hash the password before saving
// instead of using bcrypt for hashing the password here we will use an utils so we can reuse it.
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	// hash the password before saving it to the database
	this.password = await hashValue(this.password);
	next();
});

// method to compare the password
userSchema.methods.comparePassword = async function (value: string) {
	return await compareValue(value, this.password);
};

// method to omit password from the response
userSchema.methods.omitPassword = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
