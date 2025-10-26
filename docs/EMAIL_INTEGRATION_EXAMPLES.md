# Integration Guide: Email Sending with OTP and Password Reset

## Quick Integration Examples

### 1. OTP Verification with Email

Update your OTP hook to send emails when generating codes:

```typescript
// src/hooks/use-otp-verification.ts
import { sendOTP } from "@/app/actions/email";

export function useOTPVerification(email: string) {
  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setOtpError("");

      // Generate new OTP code
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Send email with OTP
      const emailResult = await sendOTP(email, newCode);

      if (!emailResult.success) {
        setOtpError(emailResult.error || "Échec de l'envoi de l'email");
        return;
      }

      // Store OTP in your backend/database
      // await storeOTP(email, newCode);

      toast.success("Code de vérification envoyé par email");
    } catch (error) {
      setOtpError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleResendOTP, /* ... */ };
}
```

### 2. Registration Flow with Email OTP

```typescript
// src/hooks/use-register-form.ts
import { sendOTP } from "@/app/actions/email";

export function useRegisterForm() {
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Validate form data
      // ...

      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Send OTP email
      const emailResult = await sendOTP(formData.email, otpCode);

      if (!emailResult.success) {
        setGeneralError("Échec de l'envoi du code de vérification");
        return;
      }

      // Store OTP with expiration (10 minutes)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      // await storeOTP(formData.email, otpCode, expiresAt);

      // Show OTP verification screen
      setShowOTP(true);

      toast.success("Code de vérification envoyé à votre email");
    } catch (error) {
      setGeneralError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegisterSubmit, /* ... */ };
}
```

### 3. Forgot Password Flow

Create a forgot password form:

```typescript
// src/components/auth/forgot-password-form.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendPasswordReset } from "@/app/actions/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Generate reset token
      const resetToken = crypto.randomUUID();

      // Store token in database with expiration (1 hour)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      // await storeResetToken(email, resetToken, expiresAt);

      // Send reset email
      const result = await sendPasswordReset(email, resetToken);

      if (!result.success) {
        toast.error(result.error || "Échec de l'envoi de l'email");
        return;
      }

      setSent(true);
      toast.success("Email de réinitialisation envoyé");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <h2>Email envoyé !</h2>
        <p>Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre email"
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Envoi..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  );
}
```

### 4. Password Reset Page

```typescript
// src/app/(auth)/reset-password/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!token) {
      toast.error("Token invalide");
      return;
    }

    try {
      setIsLoading(true);

      // Verify token and update password
      // const result = await resetPassword(token, password);

      toast.success("Mot de passe réinitialisé avec succès");
      // Redirect to login
      // router.push("/login");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
        required
      />
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmer le mot de passe"
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Réinitialisation..." : "Réinitialiser"}
      </Button>
    </form>
  );
}
```

## Database Schema for OTP and Reset Tokens

You'll need to store OTP codes and reset tokens. Here's an example schema:

```typescript
// src/db/schema/tables/verification.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const otpVerification = pgTable("otp_verification", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

export const passwordReset = pgTable("password_reset", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});
```

## Server Actions for Verification

```typescript
// src/app/actions/verification.ts
"use server";

import { db } from "@/db";
import { otpVerification, passwordReset } from "@/db/schema/tables/verification";
import { eq, and, gt } from "drizzle-orm";

export async function storeOTP(email: string, code: string) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(otpVerification).values({
    email,
    code,
    expiresAt,
  });

  return { success: true };
}

export async function verifyOTP(email: string, code: string) {
  const [record] = await db
    .select()
    .from(otpVerification)
    .where(
      and(
        eq(otpVerification.email, email),
        eq(otpVerification.code, code),
        eq(otpVerification.verified, false),
        gt(otpVerification.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) {
    return { success: false, error: "Code invalide ou expiré" };
  }

  // Mark as verified
  await db
    .update(otpVerification)
    .set({ verified: true })
    .where(eq(otpVerification.id, record.id));

  return { success: true };
}

export async function storeResetToken(email: string, token: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(passwordReset).values({
    email,
    token,
    expiresAt,
  });

  return { success: true };
}

export async function verifyResetToken(token: string) {
  const [record] = await db
    .select()
    .from(passwordReset)
    .where(
      and(
        eq(passwordReset.token, token),
        eq(passwordReset.used, false),
        gt(passwordReset.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) {
    return { success: false, error: "Token invalide ou expiré" };
  }

  return { success: true, email: record.email };
}

export async function markResetTokenUsed(token: string) {
  await db
    .update(passwordReset)
    .set({ used: true })
    .where(eq(passwordReset.token, token));

  return { success: true };
}
```

## Testing Email Integration

### 1. Test OTP Email
```typescript
import { sendOTP } from "@/app/actions/email";

// In a test file or API route
const result = await sendOTP("your-test@email.com", "123456");
console.log(result); // { success: true } or { success: false, error: "..." }
```

### 2. Test Password Reset Email
```typescript
import { sendPasswordReset } from "@/app/actions/email";

const result = await sendPasswordReset("your-test@email.com", "test-token-123");
console.log(result);
```

### 3. Check Resend Dashboard
After sending emails, check the [Resend Logs](https://resend.com/logs) to verify delivery.

## Environment Setup Checklist

- [ ] Add `RESEND_API_KEY` to `.env.local`
- [ ] Add `RESEND_FROM_EMAIL` to `.env.local`
- [ ] Add `NEXT_PUBLIC_APP_URL` to `.env.local`
- [ ] Verify domain in Resend (or use `onboarding@resend.dev` for testing)
- [ ] Test email sending with real email address
- [ ] Create database tables for OTP and reset tokens
- [ ] Implement server actions for verification
- [ ] Update registration flow to send OTP emails
- [ ] Create forgot password page
- [ ] Create reset password page
- [ ] Add rate limiting for email sending

## Next Steps

1. **Create the database tables** for OTP and reset tokens
2. **Update the registration hook** to send OTP emails
3. **Create the forgot password page**
4. **Create the reset password page**
5. **Add rate limiting** to prevent email spam
6. **Test the complete flow** end-to-end

## Important Notes

⚠️ **Security Considerations:**
- Always validate email addresses
- Implement rate limiting (e.g., max 3 emails per hour per address)
- Use secure random tokens for password resets
- Set appropriate expiration times (OTP: 10 min, Reset: 1 hour)
- Clean up expired tokens regularly
- Never expose tokens in URLs that get logged

⚠️ **Production Checklist:**
- Verify your domain in Resend
- Use a professional sender email address
- Monitor email delivery rates
- Set up SPF/DKIM records
- Handle bounce/complaint notifications
- Add unsubscribe mechanism if needed
