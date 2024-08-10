import { ErrorRequestHandler, Response } from "express";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "../constants/httpStatusCode";
import { z } from "zod";
import AppError from "../utils/appError";

const handleZodError = (res: Response, error: z.ZodError) => {
	const errorMessages: { [field: string]: string } = {};

	error.errors.forEach((e) => {
		const field = e.path[0];
		const message = e.message;

		errorMessages[field] = (errorMessages[field] || "") + (errorMessages[field] ? "\n" : "") + message;
	});

	// console.log("ZOD error:", errorMessages);
	return res.status(BAD_REQUEST).json({ errors: errorMessages });
};

const handleAppError = (res: Response, error: AppError) => {
	return res.status(error.statusCode).json({
		message: error.message,
		errorCode: error.errorCode,
	});
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	console.log(`PATH: ${req.path}`, error);
	if (error instanceof z.ZodError) {
		return handleZodError(res, error);
	}
	if (error instanceof AppError) {
		return handleAppError(res, error);
	}
	return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
