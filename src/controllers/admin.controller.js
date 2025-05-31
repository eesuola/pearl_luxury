import User from "../model/admin.model.js";
import { refreshTokenService } from "../services/auth.service.js";
import { AppError } from "../utils/appError.js";
import bcrypt from "bcryptjs"; // Replace 'bcrypt' with 'bcryptjs'
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { validationResult } from "express-validator";

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new AppError("User Already Exist", 400);
    }
    const { email, name, password } = req.body;
    if (!email || !name || password || role) {
      throw new AppError("Email, password, role, and name are required", 400);
    }
    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

export const login = async () => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const email = email.req.body;
    const password = password.req.body;

    const existingUser = await User.findOne({ email });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};
