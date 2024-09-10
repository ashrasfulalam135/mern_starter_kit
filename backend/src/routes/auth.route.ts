import { Router } from "express";
import { sendPasswordResetHandler, loginHandler, logoutHandler, refreshHandler, registerHandler, verifyEmailHandler, resetPasswordHandler } from "../controllers/auth.controller";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forget", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
