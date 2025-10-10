import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";
import Stripe from "stripe";
import { db } from "@/db"; // your drizzle instance

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
const COOKIE_CACHE_MINUTES = 5;

// Session configuration constants
const SESSION_EXPIRES_IN_SECONDS =
  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK; // 7 days
const SESSION_UPDATE_AGE_SECONDS =
  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY; // 1 day
const SESSION_COOKIE_CACHE_MAX_AGE_SECONDS =
  COOKIE_CACHE_MINUTES * SECONDS_IN_MINUTE; // 5 minutes

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
          return await Promise.resolve();
        }

        // TODO: Implement email sending logic for production
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
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
