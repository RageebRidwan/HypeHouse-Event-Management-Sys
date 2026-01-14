import { Router } from "express";
import * as authController from "./auth.controller";
import { validateBody } from "../../middleware/validate";
import { registerSchema, loginSchema } from "./auth.validation";
import { authenticate } from "../../middleware/auth";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  validateBody(registerSchema),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  validateBody(loginSchema),
  authController.login
);

/**
 * @route   GET /api/auth/verify-email?token=XXX
 * @desc    Verify email with token
 * @access  Public
 */
router.get("/verify-email", authController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Protected
 */
router.post("/resend-verification", authenticate, authController.resendVerification);

export default router;
