/**
 * Email Test Utility
 *
 * Quick test to verify Resend email integration is working.
 *
 * Usage:
 * 1. Make sure RESEND_API_KEY is set in .env.local
 * 2. Update TEST_EMAIL with your email address
 * 3. Run from a server component or API route
 *
 * @note This is a test utility - console.log is intentionally used for debugging
 */

import { sendOTP, sendPasswordReset } from "@/app/actions/email";

// ⚠️ Update this with your test email address
const TEST_EMAIL = "your-test@email.com";

export async function testOTPEmail() {
  // biome-ignore lint/suspicious/noConsole: Test utility
  console.log("🧪 Testing OTP email...");

  const result = await sendOTP(TEST_EMAIL, "123456");

  if (result.success) {
    // biome-ignore lint/suspicious/noConsole: Test utility
    console.log("✅ OTP email sent successfully!");
    // biome-ignore lint/suspicious/noConsole: Test utility
    console.log("📧 Check your inbox at:", TEST_EMAIL);
  } else {
    // biome-ignore lint/suspicious/noConsole: Test utility
    console.error("❌ Failed to send OTP email:", result.error);
  }

  return result;
}

export async function testPasswordResetEmail() {
  // biome-ignore lint/suspicious/noConsole: Test utility
  console.log("🧪 Testing password reset email...");

  const testToken = `test-reset-token-${Date.now()}`;
  const result = await sendPasswordReset(TEST_EMAIL, testToken);

  if (result.success) {
    // biome-ignore lint/suspicious/noConsole: Test utility
    console.log("✅ Password reset email sent successfully!");
    // biome-ignore lint/suspicious/noConsole: Test utility
    console.log("📧 Check your inbox at:", TEST_EMAIL);
  } else {
    // biome-ignore lint/suspicious/noConsole: Test utility
    console.error("❌ Failed to send password reset email:", result.error);
  }

  return result;
}

export async function runAllEmailTests() {
  // biome-ignore lint/suspicious/noConsole: Test utility
  console.log("🚀 Running all email tests...\n");

  await testOTPEmail();
  // biome-ignore lint/suspicious/noConsole: Test utility
  console.log("\n");
  await testPasswordResetEmail();

  // biome-ignore lint/suspicious/noConsole: Test utility
  console.log("\n✨ All tests completed!");
  // biome-ignore lint/suspicious/noConsole: Test utility
  console.log("📊 Check Resend dashboard: https://resend.com/logs");
}

// Example usage in an API route:
//
// // src/app/api/test-email/route.ts
// import { NextResponse } from "next/server";
// import { runAllEmailTests } from "@/lib/test-email";
//
// export async function GET() {
//   const results = await runAllEmailTests();
//   return NextResponse.json({ success: true, results });
// }
