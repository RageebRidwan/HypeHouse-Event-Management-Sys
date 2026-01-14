import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must not exceed 100 characters"),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
