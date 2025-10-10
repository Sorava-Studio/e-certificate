"use client";

import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
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
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  type ForgotPasswordEmailFormData,
  forgotPasswordEmailSchema,
  otpSchema,
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/validations/auth";

type Step = "email" | "otp" | "reset" | "success";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailFormData, setEmailFormData] =
    useState<ForgotPasswordEmailFormData>({
      email: "",
    });
  const [passwordFormData, setPasswordFormData] =
    useState<ResetPasswordFormData>({
      password: "",
      confirmPassword: "",
    });

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request password reset email
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setGeneralError("");

    // Validate email
    const result = forgotPasswordEmailSchema.safeParse(emailFormData);

    if (!result.success) {
      setEmailError(result.error.issues[0]?.message || "Invalid email");
      setIsLoading(false);
      return;
    }

    try {
      // Send OTP for password reset using forgetPassword.emailOtp
      const { error } = await authClient.forgetPassword.emailOtp({
        email: emailFormData.email,
      });

      if (error) {
        setGeneralError(
          error.message || "Failed to send reset code. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Store email and move to OTP step
      setEmail(emailFormData.email);
      setEmailError("");
      setGeneralError("");
      setCurrentStep("otp");
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpError("");
    setGeneralError("");

    // Validate OTP
    const result = otpSchema.safeParse({ otp });

    if (!result.success) {
      setOtpError(result.error.issues[0]?.message || "Invalid OTP");
      setIsLoading(false);
      return;
    }

    // OTP is valid, move to password reset step
    setOtpError("");
    setGeneralError("");
    setCurrentStep("reset");
    setIsLoading(false);
  };

  // Step 3: Reset password
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    // Validate password
    const result = resetPasswordSchema.safeParse(passwordFormData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> =
        {};
      for (const error of result.error.issues) {
        const path = error.path[0] as keyof ResetPasswordFormData;
        fieldErrors[path] = error.message;
      }
      setPasswordErrors(fieldErrors);
      setGeneralError("Please fix the errors above to continue.");
      setIsLoading(false);
      return;
    }

    try {
      // Reset password with OTP using emailOtp.resetPassword
      const { error: resetError } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password: passwordFormData.password,
      });

      if (resetError) {
        setGeneralError(
          resetError.message ||
            "Invalid or expired reset code. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Success! Show success message
      setPasswordErrors({});
      setGeneralError("");
      setCurrentStep("success");
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsLoading(true);
    setOtpError("");
    setGeneralError("");

    try {
      const { error } = await authClient.forgetPassword.emailOtp({
        email,
      });

      if (error) {
        setGeneralError(
          error.message || "Failed to resend code. Please try again."
        );
      } else {
        setOtp("");
        setGeneralError("");
      }
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render email step
  const renderEmailStep = () => (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a code to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit}>
          <FieldGroup>
            {generalError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                aria-invalid={Boolean(emailError)}
                disabled={isLoading}
                id="email"
                onChange={(e) => setEmailFormData({ email: e.target.value })}
                placeholder="m@example.com"
                required
                type="email"
                value={emailFormData.email}
              />
              {emailError && (
                <FieldDescription className="text-destructive">
                  {emailError}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Sending..." : "Send reset code"}
              </Button>
              <FieldDescription className="text-center">
                Remember your password? <a href="/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );

  // Render OTP step
  const renderOTPStep = () => (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOTPSubmit}>
          <FieldGroup>
            {generalError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <Field className="items-center">
              <FieldLabel className="sr-only" htmlFor="otp">
                Verification code
              </FieldLabel>
              <div className="flex justify-center">
                <InputOTP
                  disabled={isLoading}
                  id="otp"
                  maxLength={6}
                  onChange={(value) => setOtp(value)}
                  required
                  value={otp}
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {otpError && (
                <FieldDescription className="text-destructive">
                  {otpError}
                </FieldDescription>
              )}
              <FieldDescription className="text-center">
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>

            <Field>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Verifying..." : "Verify code"}
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
  );

  // Render password reset step
  const renderPasswordField = () => (
    <Field>
      <FieldLabel htmlFor="password">New Password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-invalid={Boolean(passwordErrors.password)}
          disabled={isLoading}
          id="password"
          onChange={(e) =>
            setPasswordFormData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          required
          type={showPassword ? "text" : "password"}
          value={passwordFormData.password}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            size="icon-xs"
            type="button"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {passwordErrors.password && (
        <FieldDescription className="text-destructive">
          {passwordErrors.password}
        </FieldDescription>
      )}
    </Field>
  );

  const renderConfirmPasswordField = () => (
    <Field>
      <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
      <InputGroup>
        <InputGroupInput
          aria-invalid={Boolean(passwordErrors.confirmPassword)}
          disabled={isLoading}
          id="confirmPassword"
          onChange={(e) =>
            setPasswordFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          required
          type={showConfirmPassword ? "text" : "password"}
          value={passwordFormData.confirmPassword}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            size="icon-xs"
            type="button"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {passwordErrors.confirmPassword && (
        <FieldDescription className="text-destructive">
          {passwordErrors.confirmPassword}
        </FieldDescription>
      )}
    </Field>
  );

  const renderResetStep = () => (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit}>
          <FieldGroup>
            {generalError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            {renderPasswordField()}
            {renderConfirmPasswordField()}

            <Field>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Resetting..." : "Reset password"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );

  // Render success step
  const renderSuccessStep = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center md:p-8">
        <FieldGroup>
          <Field className="items-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">
              Password reset successful!
            </CardTitle>
            <CardDescription>
              Your password has been reset successfully. You can now sign in
              with your new password.
            </CardDescription>
          </Field>

          <Field>
            <Button onClick={() => router.push("/login")} type="button">
              Continue to login
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {currentStep === "email" && renderEmailStep()}
      {currentStep === "otp" && renderOTPStep()}
      {currentStep === "reset" && renderResetStep()}
      {currentStep === "success" && renderSuccessStep()}

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
