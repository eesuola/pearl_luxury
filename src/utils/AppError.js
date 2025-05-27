// /utils/AppError.js

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);

    // Restore the prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace, excluding this constructor
    Error.captureStackTrace(this);
  }
}
