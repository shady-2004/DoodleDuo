import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development")
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  else if (process.env.NODE_ENV === "production") {
    // if (err.name === "CastError") err = handleCastErrorDB(err);
    // if (err.code === 11000) err = handleDublicateFieldsDB(err);
    // if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    // if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    // if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);

    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.log("Error", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong",
      });
    }
  }
};
