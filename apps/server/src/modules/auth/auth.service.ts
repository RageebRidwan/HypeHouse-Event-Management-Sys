import { prisma } from "../../utils/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import { generateToken, verifyToken } from "../../utils/jwt";
import { ConflictError, UnauthorizedError, BadRequestError } from "../../utils/errors";
import { sendVerificationEmail, sendWelcomeEmail } from "../../utils/email";
import { sendWelcomeEmail as sendWelcomeNotification } from "../../services/notification.service";
import type { RegisterInput, LoginInput } from "./auth.validation";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    role: string;
    verified: boolean;
    emailVerified: boolean;
    acceptedHostTerms: boolean;
    createdAt: Date;
  };
}

export const registerUser = async (
  data: RegisterInput
): Promise<AuthResponse> => {
  const { email, password, name } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate verification token (expires in 24 hours)
  const verificationToken = generateToken(
    { email, purpose: "email-verification" },
    "24h"
  );
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiry,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      verified: true,
      emailVerified: true,
      acceptedHostTerms: true,
      createdAt: true,
    },
  });

  // Send verification email (don't wait for it)
  sendVerificationEmail(email, name, verificationToken).catch((error) =>
    console.error("Failed to send verification email:", error)
  );

  // Send welcome email with verification link
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  sendWelcomeNotification({ to: email, name, verificationUrl }).catch((error) =>
    console.error("Failed to send welcome email:", error)
  );

  // Generate JWT token for authentication
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user,
  };
};

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const { email, password } = data;

  // Find user with password
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Check if user is suspended
  if (user.suspended) {
    throw new ForbiddenError(
      user.suspendedReason || "Your account has been suspended. Please contact support."
    );
  }

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<{ message: string; user: any }> => {
  try {
    // Verify token
    const decoded: any = verifyToken(token);

    if (decoded.purpose !== "email-verification") {
      throw new BadRequestError("Invalid verification token");
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        email: decoded.email,
        verificationToken: token,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    // Check if token is expired
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      throw new BadRequestError("Verification token has expired. Please request a new one.");
    }

    // Check if already verified
    if (user.emailVerified) {
      return {
        message: "Email already verified",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: true,
        },
      };
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      },
    });

    // Send welcome email
    sendWelcomeEmail(user.email, user.name).catch((error) =>
      console.error("Failed to send welcome email:", error)
    );

    return {
      message: "Email verified successfully",
      user: updatedUser,
    };
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new BadRequestError("Invalid or expired verification token");
    }
    throw error;
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (userId: string): Promise<{ message: string }> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (user.emailVerified) {
    throw new BadRequestError("Email already verified");
  }

  // Generate new verification token
  const verificationToken = generateToken(
    { email: user.email, purpose: "email-verification" },
    "24h"
  );
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Update user with new token
  await prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken,
      verificationTokenExpiry,
    },
  });

  // Send verification email
  await sendVerificationEmail(user.email, user.name, verificationToken);

  return {
    message: "Verification email sent successfully",
  };
};
