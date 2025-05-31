import { verifyToken } from "../utils/token.js";
import { AppError } from "../utils/appError.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("No token provided", 401));
  }
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
export const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized - please login." });
  }
};
