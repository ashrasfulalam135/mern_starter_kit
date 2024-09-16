import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import UserModel from "../models/user.model";
import { NOT_FOUND, OK } from "../constants/httpStatusCode";

export const getUserHandler = catchErrors(async (req, res) => {
	const user = await UserModel.findById(req.userId);
	appAssert(user, NOT_FOUND, "User not found");
	return res.status(OK).json(user.omitPassword());
});
