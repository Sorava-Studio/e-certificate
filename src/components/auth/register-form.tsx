"use client";

import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  otpSchema,
  type RegisterFormData,
  registerSchema,
} from "@/validations/auth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [otpValue, setOTPValue] = useState("");
  const [otpError, setOTPError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    // Validate form data
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      for (const error of result.error.issues) {
        const path = error.path[0] as keyof RegisterFormData;
        fieldErrors[path] = error.message;
      }
      setErrors(fieldErrors);
      setGeneralError("Please fix the errors above to continue.");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user with Better Auth
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

      // Send OTP for email verification
      const otpResult = await authClient.emailOtp.sendVerificationOtp({
        email: formData.email,
        type: "email-verification",
      });

      if (otpResult.error) {
        setGeneralError(
          "Account created but failed to send verification code. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Clear errors and show OTP form
      setErrors({});
      setGeneralError("");
      setShowOTP(true);
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setOTPError("");

    // Validate OTP
    const result = otpSchema.safeParse({ otp: otpValue });

    if (!result.success) {
      setOTPError(result.error.issues[0]?.message || "Invalid OTP");
      setIsLoading(false);
      return;
    }

    try {
      // Verify email with OTP
      const { error } = await authClient.emailOtp.verifyEmail({
        email: formData.email,
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

      // Success! Redirect to dashboard or show success message
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
        email: formData.email,
        type: "email-verification",
      });

      if (error) {
        setOTPError("Failed to resend code. Please try again.");
      } else {
        setOTPError("");
        // Show success message briefly
        setOTPValue("");
      }
    } catch {
      setOTPError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (showOTP) {
    return (
      <div
        className={cn("flex flex-col gap-6 md:min-h-[450px]", className)}
        {...props}
      >
        <Card className="flex-1 overflow-hidden p-0">
          <CardContent className="grid flex-1 p-0 md:grid-cols-2">
            <div className="relative hidden bg-muted md:block">
              <Image
                alt="Register background"
                className="object-cover dark:brightness-[0.2] dark:grayscale"
                fill
                src="/login-image.png"
              />
            </div>
            <form
              className="slide-in-from-right flex animate-in flex-col items-center justify-center p-6 duration-500 md:p-8"
              onSubmit={handleOTPSubmit}
            >
              <FieldGroup>
                <Field className="items-center text-center">
                  <h1 className="font-bold text-2xl">
                    Enter verification code
                  </h1>
                  <p className="text-balance text-muted-foreground text-sm">
                    We sent a 6-digit code to {formData.email}
                  </p>
                </Field>
                <Field>
                  <FieldLabel className="sr-only" htmlFor="otp">
                    Verification code
                  </FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP
                      containerClassName="gap-4"
                      id="otp"
                      maxLength={6}
                      onChange={(value) => {
                        setOTPValue(value);
                        setOTPError("");
                      }}
                      required
                      value={otpValue}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {!otpError && (
                    <FieldDescription className="text-center">
                      Enter the 6-digit code sent to your email.
                    </FieldDescription>
                  )}
                </Field>
                {otpError && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{otpError}</AlertDescription>
                  </Alert>
                )}
                <Field>
                  <Button disabled={isLoading} type="submit">
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code?{" "}
                    <button
                      className="underline disabled:opacity-50"
                      disabled={isLoading}
                      onClick={handleResendOTP}
                      type="button"
                    >
                      Resend
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </FieldDescription>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleRegisterSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">Create an account</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up for your Certificate account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  aria-invalid={Boolean(errors.fullName)}
                  id="fullName"
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="John Doe"
                  required
                  type="text"
                  value={formData.fullName}
                />
                {errors.fullName && (
                  <FieldDescription className="text-destructive">
                    {errors.fullName}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  aria-invalid={Boolean(errors.email)}
                  id="email"
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="m@example.com"
                  required
                  type="email"
                  value={formData.email}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    aria-invalid={Boolean(errors.password)}
                    id="password"
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      size="icon-xs"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    aria-invalid={Boolean(errors.confirmPassword)}
                    id="confirmPassword"
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      size="icon-xs"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {errors.confirmPassword && (
                  <FieldDescription className="text-destructive">
                    {errors.confirmPassword}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </Field>
              {generalError && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              )}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-1 gap-4">
                <Button type="button" variant="outline">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>Google Logo</title>
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              alt="Register background"
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              fill
              src="/login-image.png"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
