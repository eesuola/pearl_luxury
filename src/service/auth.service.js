import User from "../model/admin.model.js";
import RefreshToken from "../model/refreshToken.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError.js";
import { generateTokens } from "../utils/token.js";
import crypto from "crypto";


export const register = async (userData, user) => {
    console.log("Register called with data:", userData, "by user:", user);
    if (user && user.role !== 'admin') {
        throw new AppError("Only admins can register users", 403);
    }

    const { email, password, name, profilePicture } = userData;
    if (!email || !password || !name) {
        throw new AppError("Email, password, and name are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        profilePicture: profilePicture || "https://via.placeholder.com/150",
    });

    const { accessToken, refreshToken } = generateTokens(newUser);

    return { newUser, accessToken, refreshToken };
}
export const createInitialAdmin = async (userData) => {
    console.log("CreateInitialAdmin called with data:", userData);
    const { email, password, name } = userData;
    if (!email || !password || !name) {
        throw new AppError("Email, password, and name are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        profilePicture: "https://via.placeholder.com/150",
    });

    return newUser;
};
export const login = async (email, password) => {
    console.log("Login called with email:", email);
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }
    const { accessToken, refreshToken } = generateTokens(user);
    return { user, accessToken, refreshToken };

}
export const loginAdmin = async (email, password) => {
    console.log("LoginAdmin called with email:", email);
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
        throw new AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }
    const { accessToken, refreshToken } = generateTokens(user);
    return { user, accessToken, refreshToken };
};
export const refreshAccessToken = async (refreshToken) => {
    console.log("RefreshAccessToken called with token:", refreshToken);
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }
    const token = await RefreshToken.findOne({ token: refreshToken });
    if (!token) {
        throw new AppError("Invalid refresh token", 401);
    }
    const user = await User.findByPk(token.userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const { accessToken } = generateTokens(user);
    return { accessToken }; 
}
export const logout = async (refreshToken) => {
    console.log("Logout called with token:", refreshToken);
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }
    const token = await RefreshToken.findOne({ token: refreshToken });
    if (!token) {
        throw new AppError("Invalid refresh token", 401);
    }
    await RefreshToken.destroy({ where: { token: refreshToken } });
    return { message: "Logged out successfully" };
};
export const generateResetToken = async (email) => {
    console.log("GenerateResetToken called with email:", email);
    if (!email) {
        throw new AppError("Email is required", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    return { resetToken };
}
export const resetPassword = async (email, resetToken, newPassword) => {
    console.log("ResetPassword called with email:", email);
    if (!email || !resetToken || !newPassword) {
        throw new AppError("Email, reset token, and new password are required", 400);
    }
    const user = await User.findOne({ email });
    if (!user || user.resetToken !== resetToken || user.resetTokenExpiry < Date.now()) {
        throw new AppError("Invalid or expired reset token", 401);
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    return { message: "Password reset successfully" };
}
export const getUserProfile = async (userId) => {
    console.log("GetUserProfile called with userId:", userId);
    if (!userId) {
        throw new AppError("User ID is required", 400);
    }
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return user;
}