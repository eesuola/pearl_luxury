import User from "../model/admin.model.js";
import { AppError } from "../utils/appError.js";
import { generateTokens } from "../utils/token.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const createAdmin = async (adminData, user) => {
    console.log("CreateAdmin called with data:", adminData, "by user:", user);
    if (user && user.role !== 'admin') {
        throw new AppError("Only admins can create other admins", 403);
    }

    const { email, password, name } = adminData;
    if (!email || !password || !name) {
        throw new AppError("Email, password, and name are required", 400);
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
        throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
        email,
        password: hashedPassword,
        name,
        role: 'admin',
        profilePicture: "https://via.placeholder.com/150",
    });

    return newAdmin;
}
export const updateAdmin = async (id, adminData, user) => {
    console.log("UpdateAdmin called with id:", id, "data:", adminData, "by user:", user);
    if (user && user.role !== 'admin') {
        throw new AppError("Only admins can update other admins", 403);
    }

    const { email, password, name } = adminData;
    if (!email || !password || !name) {
        throw new AppError("Email, password, and name are required", 400);
    }

    const admin = await User.findByPk(id);
    if (!admin) {
        throw new AppError("Admin not found", 404);
    }

    admin.email = email;
    admin.name = name;
    if (password) {
        admin.password = await bcrypt.hash(password, 10);
    }
    await admin.save();

    return admin;
}

export const loginAdmin = async (email, password) => {
    console.log("LoginAdmin called with email:", email);
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const admin = await User.findOne({ email });
    if (!admin) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const { accessToken, refreshToken } = generateTokens(admin);

    return { admin, accessToken, refreshToken };
}
export const refreshAccessToken = async (refreshToken) => {
    console.log("RefreshAccessToken called with token:", refreshToken);
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }
    const token = await RefreshToken.findOne({ token: refreshToken });
    if (!token) {
        throw new AppError("Invalid refresh token", 401);
    }
    const admin = await User.findByPk(token.userId);
    if (!admin) {
        throw new AppError("Admin not found", 404);
    }
    const { accessToken } = generateTokens(admin);
    return { accessToken };
}

export const generateTokens = (admin) => {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role || "admin",
  };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const refreshTokenService = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET); // Verify refresh token
    const user = { id: decoded.id, role: decoded.role };

    // Generate new access token
    const newAccessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

    return { newAccessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
export const searchCustomers = async (query) => {
    console.log("SearchCustomers called with query:", query);
    if (!query) {
        throw new AppError("Search query is required", 400);
    }

    const customers = await User.findAll({
        where: {
            role: 'customer',
            [Op.or]: [
                { name: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } },
            ],
        },
    });

    return customers;
}