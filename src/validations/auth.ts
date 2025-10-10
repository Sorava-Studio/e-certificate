import { z } from "zod";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const OTP_LENGTH = 6;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(MIN_NAME_LENGTH, "Full name must be at least 2 characters")
      .max(MAX_NAME_LENGTH, "Full name must not exceed 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().length(OTP_LENGTH, "OTP must be exactly 6 digits"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordEmailFormData = z.infer<
  typeof forgotPasswordEmailSchema
>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
