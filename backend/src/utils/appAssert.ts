import assert from "node:assert";
import { HTTPStatusCode } from "../constants/httpStatusCode";
import AppErrorCode from "../constants/appErrorCode";
import AppError from "./appError";

type AppAssert = (condition: any, httpStatusCode: HTTPStatusCode, message: string, appErrorCode?: AppErrorCode) => asserts condition;

const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
