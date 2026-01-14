import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "A record with this value already exists",
      });
    }

    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Record not found",
      });
    }

    // Foreign key constraint failed
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        error: "Invalid reference to related record",
      });
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: "Invalid data provided",
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message,
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
