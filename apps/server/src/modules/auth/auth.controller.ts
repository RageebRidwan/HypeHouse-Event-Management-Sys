import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { sendSuccess, sendCreated } from "../../utils/response";
import type { RegisterInput, LoginInput } from "./auth.validation";

export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendCreated(res, result, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        error: "Verification token is required",
      });
    }

    const result = await authService.verifyEmail(token);
    return sendSuccess(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const result = await authService.resendVerificationEmail(userId);
    return sendSuccess(res, result, result.message);
  } catch (error) {
    next(error);
  }
};
