import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { type RegisterFormData, registerSchema } from "@/validations/auth";

export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const validateForm = () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      for (const error of result.error.issues) {
        const path = error.path[0] as keyof RegisterFormData;
        fieldErrors[path] = error.message;
      }
      setErrors(fieldErrors);
      setGeneralError("Please fix the errors above to continue.");
      return false;
    }
    return true;
  };

  const sendVerificationOtp = async () => {
    const otpResult = await authClient.emailOtp.sendVerificationOtp({
      email: formData.email,
      type: "email-verification",
    });

    if (otpResult.error) {
      setGeneralError(
        "Account created but failed to send verification code. Please try again."
      );
      return false;
    }
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setGeneralError(
          error.message || "Failed to create account. Please try again."
        );
        setIsLoading(false);
        return;
      }

      const otpSent = await sendVerificationOtp();
      if (!otpSent) {
        setIsLoading(false);
        return;
      }

      setErrors({});
      setGeneralError("");
      setShowOTP(true);
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSocialSignIn = async (provider: "apple" | "google") => {
    await authClient.signIn.social({ provider });
  };

  return {
    formData,
    errors,
    generalError,
    isLoading,
    showOTP,
    handleRegisterSubmit,
    handleInputChange,
    handleSocialSignIn,
  };
}
