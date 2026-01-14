import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to require specific role(s)
 * @param roles - Single role or array of roles
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      throw new ForbiddenError("Authentication required");
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenError("You don't have permission to access this resource");
    }

    next();
  };
};
