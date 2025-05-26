import User from "../model/admin.model.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/appError.js";
import { generateTokens } from "../utils/token.js";
import crypto from 'crypto';



export const register = async (userData, requestingUser) => {
  console.log(
    "Register called with data:",
    userData,
    "by user:",
    requestingUser
  );
  if (requestingUser && requestingUser.role !== "admin") {
    throw new AppError("Only admins can register users", 403);
  }

  const { email, password, role } = userData;
  if (!email || !password || !role) {
    throw new AppError("Email, password, and role are required", 400);
  }

  if (!["admin", "customer"].includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const existingUser = await User.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  const { accessToken, refreshToken } = await generateTokens(user);
  return { user, accessToken, refreshToken };
};

export const createInitialAdmin = async (userData) => {
  console.log("CreateInitialAdmin called with data:", userData);
  const adminCount = await User.count({ where: { role: "admin" } });
  if (adminCount > 0) {
    throw new AppError("An admin already exists", 403);
  }

  const { email, password } = userData;
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const existingUser = await User.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    data: {
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  const { accessToken, refreshToken } = await generateTokens(user);
  return { user, accessToken, refreshToken };
};

export const login = async (email, password) => {
  console.log("Login called for email:", email);
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const { accessToken, refreshToken } = await generateTokens(user);
  return { user, accessToken, refreshToken };
};

export const loginAdmin = async (email, password) => {
  console.log("LoginAdmin called for email:", email);
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findUnique({ where: { email } });
  if (!user || user.role !== "admin") {
    throw new AppError("Invalid admin credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid admin credentials", 401);
  }

  const { accessToken, refreshToken } = await generateTokens(user);
  return { user, accessToken, refreshToken };
};

export const refreshToken = async (refreshToken) => {
  console.log("RefreshToken called with token:", refreshToken);
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const tokenRecord = await refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
    tokenRecord.user
  );
  await refreshToken.delete({ where: { token: refreshToken } });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (refreshToken) => {
  console.log("Logout called with token:", refreshToken);
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  await refreshToken.deleteMany({ where: { token: refreshToken } });
};


export const generateResetToken = async (email) => {
  const user = await User.findUnique({ where: { email } });
  if (!user) {return null;}
  const resetToken = crypto.randomBytes(20).toString("hex");
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour
  await resetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt,
    },
  })
  return resetToken;
}
export const resetPassword = async (token, newPassword) => {
  const resetToken = await resetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.expiresAt < new Date()) {
   return null;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password with the hashed password
  const user = await User.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword }, // Save the hashed password
  });

await resetToken.delete({ where: { token } });
return user;
};