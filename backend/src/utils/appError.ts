import AppErrorCode from "../constants/appErrorCode";
import { HTTPStatusCode } from "../constants/httpStatusCode";

class AppError extends Error {
	constructor(public statusCode: HTTPStatusCode, public message: string, public errorCode?: AppErrorCode) {
		super(message);
	}
}

export default AppError;
