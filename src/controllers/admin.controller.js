import * as adminService from "../services/admin.service.js";
import { refreshTokenService } from "../services/auth.service.js";
import { AppError } from "../utils/appError.js";

export const register = async (req, res, next) => {
    console.log("Register endpoint hit with body:", req.body);
    try {
        const { email, password, name, profilePicture } = req.body;
        if (!email || !password || !name) {
            throw new AppError("Email, password, and name are required", 400);
        }
        const { newUser, accessToken, refreshToken } = await adminService.register(
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
export const refreshToken = async (req, res, next) => {
    console.log("RefreshToken endpoint hit with body:", req.body);
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError("Refresh token is required", 400);
        }
        const newTokens = await refreshTokenService(refreshToken);
        res.status(200).json({
            message: "Tokens refreshed successfully",
            ...newTokens,
        });
    } catch (error) {
        console.error("RefreshToken error:", error);
        next(error);
    }
}
export const login = async (req, res, next) => {
    console.log("LoginAdmin endpoint hit with body:", req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }
        const { user, accessToken, refreshToken } = await adminService.loginAdmin(email, password);
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

export const searchCustomers = async (req, res, next) => {
    console.log("SearchCustomers endpoint hit with query:", req.query);
    try {
        const { query } = req.query;
        if (!query) {
            throw new AppError("Search query is required", 400);
        }
        const customers = await adminService.searchCustomers(query);
        res.status(200).json({
            message: "Customers retrieved successfully",
            customers,
        });
    } catch (error) {
        console.error("SearchCustomers error:", error);
        next(error);
    }
}