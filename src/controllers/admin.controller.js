import {
  logInAdmin,
  registerAdmin,
  refreshTokenService,
  searchCustomer,
} from "../service/admin.service.js";
import { AppError } from "../utils/appError.js";

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Refresh token is required", 400));
  }

  try {
    const { newAccessToken } = await refreshTokenService(refreshToken);

    res.status(200).json({
      status: "success",
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return next(new AppError("All fields are required", 400));
    }
    const newAdmin = await registerAdmin(email, password, name);
    res.status(201).json({
      status: "success",
      message: "Admin registered successfully",
      data: newAdmin,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }
    const { admin, accessToken, refreshToken } = await logInAdmin(
      email,
      password
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: admin,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

export const searchCustomer = async (req, res, next) => {
  const { name, phoneNumber, address } =
    req.body;
    if (! phoneNumber ||name || address ) {
      return next(new AppError("Either one of the info is required", 400));
    }
};
