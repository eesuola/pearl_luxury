import express from "express"; //Anytime you want to use a router , you have to import these two items
import rateLimit from 'express-rate-limit'
import * as authController from "../controllers/auth.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/uploadMiddleware.js";



const routes = express.Router();

//Rate Limit
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Allow a max of 5 requests per IP in the 15-minute window
    message: "Too many login attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

routes.post("/register",loginLimiter,upload.single("profilePicture"), authController.register); // Admin-only
routes.post("/initial-admin", authController.createInitialAdmin); // No auth for first admin
routes.post("/login",loginLimiter, authController.login);
routes.post("/admin/login",loginLimiter, authController.loginAdmin);
routes.post("/refresh", authController.handleRefreshToken);
routes.post("/logout", authMiddleware, authController.logout);

routes.post("/forgot-password", authController.forgotPassword);
routes.post("/reset-password", authController.resetPassword);

export default routes;