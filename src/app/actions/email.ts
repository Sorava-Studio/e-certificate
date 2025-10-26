"use server";

import { sendOTPEmail, sendPasswordResetEmail } from "@/lib/email";

type SendOTPResult = {
  success: boolean;
  error?: string;
};

// Regex patterns at top level for performance
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_CODE_REGEX = /^\d{6}$/;

/**
 * Send OTP verification code via email
 */
export async function sendOTP(
  email: string,
  code: string
): Promise<SendOTPResult> {
  const hasRequiredFields = Boolean(email && code);
  if (!hasRequiredFields) {
    return { success: false, error: "Email et code requis" };
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Format d'email invalide" };
  }

  // Validate code format (6 digits)
  if (!OTP_CODE_REGEX.test(code)) {
    return { success: false, error: "Le code doit contenir 6 chiffres" };
  }

  const result = await sendOTPEmail({ to: email, code });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}

/**
 * Send password reset link via email
 */
export async function sendPasswordReset(
  email: string,
  resetToken: string
): Promise<SendOTPResult> {
  const hasRequiredFields = Boolean(email && resetToken);
  if (!hasRequiredFields) {
    return { success: false, error: "Email et token requis" };
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return { success: false, error: "Format d'email invalide" };
  }

  // Build reset link
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

  const result = await sendPasswordResetEmail({ to: email, resetLink });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
