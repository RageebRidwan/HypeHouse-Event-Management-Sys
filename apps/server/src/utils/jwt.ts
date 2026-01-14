import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required for security. Please set it in your .env file.");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  purpose?: string;
}

export const generateToken = (payload: JwtPayload, expiresIn?: string): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn || JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid token");
    }
    throw new UnauthorizedError("Token verification failed");
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
