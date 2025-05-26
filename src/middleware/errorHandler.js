// /middlewares/errorHandler.js

import { AppError } from "../utils/appError.js";

export const globalErrorHandler = (err, req, res, next) => {
  let customError = err;

  // If it's not an instance of AppError, create a generic internal error
  if (!(err instanceof AppError)) {
    customError = new AppError("Internal Server Error", 500, false);
  }

  const error = customError;

  // Prepare the error response
  const response = {
    status: error.statusCode,
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  // Send the response with error details
  res.status(error.statusCode).json(response);
};
