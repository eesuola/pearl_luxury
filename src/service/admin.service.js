import bcrypt from "bcrypt";
import User from "../model/admin.model.js";

import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export const registerAdmin = async (email, password, name) => {
  const existingAdmin = await Admin.findUnique({ where: { email } });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newAdmin = await Admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  return newAdmin;

  // const token = jwt.sign(
  //   { id: admin.id, email: admin.email, role: "admin" },
  //   JWT_SECRET,
  //   { expiresIn: "1h" }
  // );
  // return { token };
};

// Generate access token and refresh token
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

export const logInAdmin = async (email, password) => {
  try {
    const admin = await admin.findUnique({ where: { email } }); // Assuming you're using Sequelize or a similar ORM
    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid Credentials");
    }

    const { accessToken, refreshToken } = generateTokens(admin); // Use your helper function

    return { accessToken, refreshToken }; // Return tokens
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

// Refresh token function - Generates a new access token using a valid refresh token
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

export const searchCustomer = async (customerData, query) => {
  const customerData = await Customer.findMany({
    where: {
      OR: [
        { phoneNumber: query.phoneNumber },
        { name: { contains: query.name, mode: "insensitive" } },
      ],
    },
    include: {
      address: true,
    },
  });
};
