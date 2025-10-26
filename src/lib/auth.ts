import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";
import Stripe from "stripe";
import { db } from "@/db"; // your drizzle instance
import { sendOTPEmail, sendPasswordResetEmail } from "@/lib/email";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!stripeWebhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET environment variable is not set");
}

const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: "2025-09-30.clover",
});

// Time constants
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const COOKIE_CACHE_SECONDS = 10; // Reduced to 10 seconds for faster role updates

// Session configuration constants
const SESSION_EXPIRES_IN_SECONDS =
  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK; // 7 days
const SESSION_UPDATE_AGE_SECONDS =
  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY; // 1 day
const SESSION_COOKIE_CACHE_MAX_AGE_SECONDS = COOKIE_CACHE_SECONDS; // 10 seconds

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
    cookieCache: {
      enabled: true,
      maxAge: SESSION_COOKIE_CACHE_MAX_AGE_SECONDS,
    },
  },
  // Set base URL for proper cookie domain handling
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  advanced: {
    cookieAttributes: {
      // Use 'lax' for better compatibility with email links
      // Lax allows cookies to be sent when navigating from external sites (like email)
      sameSite: "lax" as const,
      // Ensure secure cookies in production
      secure: process.env.NODE_ENV === "production",
    },
  } as Record<string, unknown>,
  // Allow cross-origin requests by configuring trusted origins
  trustedOrigins: process.env.NEXT_PUBLIC_APP_URL
    ? [process.env.NEXT_PUBLIC_APP_URL]
    : [],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        // Log in development for debugging
        if (process.env.NODE_ENV === "development") {
          // biome-ignore lint/suspicious/noConsole: Development OTP logging
          console.info("=== OTP Verification ===");
          // biome-ignore lint/suspicious/noConsole: Development OTP logging
          console.info(`Type: ${type}`);
          // biome-ignore lint/suspicious/noConsole: Development OTP logging
          console.info(`Email: ${email}`);
          // biome-ignore lint/suspicious/noConsole: Development OTP logging
          console.info(`OTP Code: ${otp}`);
          // biome-ignore lint/suspicious/noConsole: Development OTP logging
          console.info("=======================");
        }

        // Send email using Resend
        try {
          if (type === "sign-in" || type === "email-verification") {
            // Send OTP for sign in or email verification
            const result = await sendOTPEmail({ to: email, code: otp });

            if (!result.success) {
              throw new Error(result.error || "Failed to send OTP email");
            }
          } else if (type === "forget-password") {
            // For password reset, we need to send a link instead of just OTP
            // The OTP can be used as the reset token
            const baseUrl =
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const resetLink = `${baseUrl}/reset-password?token=${otp}`;

            const result = await sendPasswordResetEmail({
              to: email,
              resetLink,
            });

            if (!result.success) {
              throw new Error(
                result.error || "Failed to send password reset email"
              );
            }
          }
        } catch (error) {
          // In development, still allow the process to continue even if email fails
          if (process.env.NODE_ENV === "development") {
            // biome-ignore lint/suspicious/noConsole: Development error logging
            console.error(
              "Email sending failed (continuing in dev mode):",
              error
            );
            return await Promise.resolve();
          }

          // In production, throw the error
          throw error;
        }
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret,
      createCustomerOnSignUp: true,
    }),
  ],
});
