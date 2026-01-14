import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { UserRole } from "@prisma/client";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("No authorization token provided");
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization format. Use: Bearer <token>");
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      if (!roles.includes(req.user.role as UserRole)) {
        throw new ForbiddenError("Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
