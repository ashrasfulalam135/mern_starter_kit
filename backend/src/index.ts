import { OK } from "./constants/httpStatusCode";

require("dotenv").config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import connectToDatabase from "./config/db";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: APP_ORIGIN,
		credentials: true,
	})
);
app.use(cookieParser());

app.get("/", (req, res, next) => {
	return res.status(OK).json({
		message: "Welcome to the API",
	});
});

// auth routes
app.use("/auth", authRoutes);

// error handler
app.use(errorHandler);

app.listen(PORT, async () => {
	console.log(`Listening on port ${PORT} on ${NODE_ENV} environment`);
	await connectToDatabase();
});
