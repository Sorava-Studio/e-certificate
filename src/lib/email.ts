import { render } from "@react-email/components";
import { Resend } from "resend";
import { ForgotPasswordEmail } from "@/emails/forgot-password";
import { OTPVerificationEmail } from "@/emails/otp-verification";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const APP_NAME = "E-Certificate";

type SendOTPEmailParams = {
  to: string;
  code: string;
};

type SendPasswordResetEmailParams = {
  to: string;
  resetLink: string;
};

/**
 * Send OTP verification email
 */
export async function sendOTPEmail({ to, code }: SendOTPEmailParams) {
  try {
    const emailHtml = await render(
      OTPVerificationEmail({
        code,
        email: to,
      })
    );

    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: "Votre code de vérification",
      html: emailHtml,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  to,
  resetLink,
}: SendPasswordResetEmailParams) {
  try {
    const emailHtml = await render(
      ForgotPasswordEmail({
        resetLink,
        email: to,
      })
    );

    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject: "Réinitialisation de votre mot de passe",
      html: emailHtml,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
