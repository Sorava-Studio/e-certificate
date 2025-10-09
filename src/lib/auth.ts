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

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
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
