import * as authService from "../service/auth.service.js";
import { AppError } from "../utils/appError.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
  console.log(
    "Register endpoint hit with body:",
    req.body,
    "user:",
    req.newUser
  );
  try {
    const { email, password, role, firstName } = req.body;
    // Get uploaded file path
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!email || !password || !role) {
      throw new AppError("Email, password, and role are required", 400);
    }
    const { newUser, accessToken, refreshToken } = await authService.register(
      { email, password, role, firstName, profilePicture },
      req.user
    );
    res.status(201).json({
      message: "User registered",
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

export const createInitialAdmin = async (req, res, next) => {
  console.log("CreateInitialAdmin endpoint hit with body:", req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    const { user, accessToken, refreshToken } =
      await authService.createInitialAdmin({
        email,
        password,
      });
    res.status(201).json({
      message: "Initial admin created",
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("CreateInitialAdmin error:", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  console.log("Login endpoint hit with body:", req.body);
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password
    );
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  console.log("LoginAdmin endpoint hit with body:", req.body);
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginAdmin(
      email,
      password
    );
    res.status(200).json({
      message: "Admin login successful",
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("LoginAdmin error:", error);
    next(error);
  }
};

export const handleRefreshToken = async (req, res, next) => {
  console.log("RefreshToken endpoint hit with body:", req.body);
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("Refresh token is required", 400);

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.handleRefreshToken(refreshToken); // corrected
    res.status(200).json({
      message: "Token refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("RefreshToken error:", error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  console.log("Logout endpoint hit with body:", req.body);
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,

  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const forgotPassword = async (req, res, next) => {
  console.log("ForgotPassword endpoint hit with body:", req.body);
  try {
    const { email } = req.body || {};
    if (!email) {
      throw new AppError("Email is required", 400);
    }
    const token = await authService.generateResetToken(email);
    if (!token) throw new AppError("User not found", 404);

    const resetLink = `http://localhost:5050/reset-password?token=${token}`;
    const mailOptions = {
      from: "no-reply@schoolproject.com",
      to: email,
      subject: "Password Reset Request",
      text: `Click this link to reset your password: ${resetLink}\n\nThis link expires in 1 hour. If you didn’t request this, ignore this email.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      throw new AppError("Token and new password are required", 400);

    const user = await authService.resetPassword(token, newPassword);
    if (!user) throw new AppError("Invalid or expired token", 400);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("ResetPassword error:", error);
    next(error);
  }
};
