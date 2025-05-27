import * as authService from "../service/auth.service.js";
import { AppError } from "../utils/appError.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
    console.log("Register endpoint hit with body:", req.body);
    try {
        const { email, password, name, profilePicture } = req.body;
        if (!email || !password || !name) {
            throw new AppError("Email, password, and name are required", 400);
        }
        const { newUser, accessToken, refreshToken } = await authService.register(
            { email, password, name, profilePicture },
            req.user
        );
        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Register error:", error);
        next(error);
    }
}
export const createInitialAdmin = async (req, res, next) => {
    console.log("CreateInitialAdmin endpoint hit with body:", req.body);
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            throw new AppError("Email, password, and name are required", 400);
        }
        const newUser = await authService.createInitialAdmin({ email, password, name });
        res.status(201).json({
            message: "Initial admin created successfully",
            user: newUser,
        });
    } catch (error) {
        console.error("CreateInitialAdmin error:", error);
        next(error);
    }
}
export const loginAdmin = async (req, res, next) => {
    console.log("LoginAdmin endpoint hit with body:", req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }
        const { user, accessToken, refreshToken } = await authService.loginAdmin(email, password);
        res.status(200).json({
            message: "Admin login successful",
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("LoginAdmin error:", error);
        next(error);
    }
}
export const login = async (req, res, next) => {
    console.log("Login endpoint hit with body:", req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }
        const { user, accessToken, refreshToken } = await authService.login(email, password);
        res.status(200).json({
            message: "Login successful",
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
}
export const logout = async (req, res, next) => {
    console.log("Logout endpoint hit");
    try {
        // Invalidate the refresh token logic can be added here
        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        next(error);
    }
}
export const forgotPassword = async (req, res, next) => {
    console.log("ForgotPassword endpoint hit with body:", req.body);
    try {
        const { email } = req.body;
        if (!email) {
            throw new AppError("Email is required", 400);
        }
        const resetToken = await authService.forgotPassword(email);
        res.status(200).json({
            message: "Password reset token sent to email",
            resetToken,
        });
    } catch (error) {
        console.error("ForgotPassword error:", error);
        next(error);
    }
}
export const resetPassword = async (req, res, next) => {
    console.log("ResetPassword endpoint hit with body:", req.body);
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            throw new AppError("Reset token and new password are required", 400);
        }
        await authService.resetPassword(resetToken, newPassword);
        res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("ResetPassword error:", error);
        next(error);
    }
}
export const handleRefreshToken = async (req, res, next) => {
    console.log("HandleRefreshToken endpoint hit");
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError("Refresh token is required", 400);
        }
        const newAccessToken = await authService.refreshAccessToken(refreshToken);
        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error("HandleRefreshToken error:", error);
        next(error);
    }
}
export const sendEmail = async (req, res, next) => {
    console.log("SendEmail endpoint hit with body:", req.body);
    try {
        const { to, subject, text } = req.body;
        if (!to || !subject || !text) {
            throw new AppError("To, subject, and text are required", 400);
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: "Email sent successfully",
        });
    } catch (error) {
        console.error("SendEmail error:", error);
        next(error);
    }
}
export const getUserProfile = async (req, res, next) => {
    console.log("GetUserProfile endpoint hit");
    try {
        const user = req.user; // Assuming user is set in middleware
        if (!user) {
            throw new AppError("User not found", 404);
        }
        res.status(200).json({
            message: "User profile retrieved successfully",
            user,
        });
    } catch (error) {
        console.error("GetUserProfile error:", error);
        next(error);
    }
}