import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { otpSchema } from "@/validations/auth";

export function useOTPVerification(email: string) {
  const [otpValue, setOTPValue] = useState("");
  const [otpError, setOTPError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setOTPError("");

    const result = otpSchema.safeParse({ otp: otpValue });

    if (!result.success) {
      setOTPError(result.error.issues[0]?.message || "Invalid OTP");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: otpValue,
      });

      if (error) {
        if (error.message?.includes("TOO_MANY_ATTEMPTS")) {
          setOTPError("Too many attempts. Please request a new code.");
        } else {
          setOTPError(
            error.message || "Invalid or expired OTP. Please try again."
          );
        }
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setOTPError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setOTPError("");

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        setOTPError("Failed to resend code. Please try again.");
      } else {
        setOTPError("");
        setOTPValue("");
      }
    } catch {
      setOTPError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (value: string) => {
    setOTPValue(value);
    setOTPError("");
  };

  return {
    otpValue,
    otpError,
    isLoading,
    handleOTPSubmit,
    handleResendOTP,
    handleOTPChange,
  };
}
