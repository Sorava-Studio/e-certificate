# Better-Auth Email Integration

## Implementation Complete ✅

The email system has been successfully integrated with Better-Auth's `emailOTP` plugin.

## What Was Implemented

### 1. Email Sending in Authentication Flow

**File:** `src/lib/auth.ts`

The `sendVerificationOTP` function now automatically sends emails for:

- ✅ **Sign-in OTP** - When users sign in with email
- ✅ **Email Verification** - During registration
- ✅ **Password Reset** - When users forget their password

### 2. Email Types Handled

#### Sign-In & Email Verification
```typescript
type: "sign-in" | "email-verification"
```
- Sends OTP code via `sendOTPEmail()`
- Uses `src/emails/otp-verification.tsx` template
- 6-digit code displayed prominently
- Valid for 10 minutes

#### Password Reset
```typescript
type: "forget-password"
```
- Sends reset link via `sendPasswordResetEmail()`
- Uses `src/emails/forgot-password.tsx` template
- Link format: `{APP_URL}/reset-password?token={otp}`
- Valid for 1 hour

### 3. Environment-Specific Behavior

#### Development Mode
```typescript
if (process.env.NODE_ENV === "development") {
  console.info("=== OTP Verification ===");
  console.info(`Email: ${email}`);
  console.info(`OTP Code: ${otp}`);
  console.info("=======================");
}
```
- Logs OTP to console for testing
- Continues even if email sending fails
- Easy debugging without checking email

#### Production Mode
- Sends real emails via Resend
- Throws errors if email sending fails
- Requires valid `RESEND_API_KEY`

## How It Works

### Registration Flow

1. User submits registration form
2. Better-Auth creates user account
3. `emailOTP` plugin triggers `sendVerificationOTP`
4. Type is `"email-verification"`
5. `sendOTPEmail()` sends verification code
6. User receives email with 6-digit code
7. User enters code to verify email

### Sign-In Flow

1. User enters email to sign in
2. Better-Auth generates OTP
3. `emailOTP` plugin triggers `sendVerificationOTP`
4. Type is `"sign-in"`
5. `sendOTPEmail()` sends sign-in code
6. User receives email with code
7. User enters code to complete sign-in

### Password Reset Flow

1. User clicks "Forgot Password"
2. Better-Auth generates reset token
3. `emailOTP` plugin triggers `sendVerificationOTP`
4. Type is `"forget-password"`
5. `sendPasswordResetEmail()` sends reset link
6. User receives email with reset button
7. User clicks link to reset password

## Configuration Required

### Environment Variables

```bash
# Required for email sending
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Required for reset links
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Development mode
NODE_ENV=development
```

### Resend Setup

1. **Create Account**: [https://resend.com](https://resend.com)
2. **Get API Key**: Dashboard → API Keys → Create
3. **Add Domain** (Production):
   - Dashboard → Domains → Add Domain
   - Configure DNS records (SPF, DKIM)
   - Wait for verification
4. **Set From Email**:
   - Development: Use `onboarding@resend.dev`
   - Production: Use verified domain email

## Testing

### 1. Test Registration with Email Verification

```typescript
// In your app
const { signUp } = useAuth();

await signUp.email({
  email: "test@example.com",
  password: "SecurePass123!",
  name: "Test User"
});

// Check console in development for OTP code
// Or check email inbox in production
```

### 2. Test Sign-In with OTP

```typescript
const { signIn } = useAuth();

await signIn.email({
  email: "test@example.com"
});

// OTP will be sent to email
```

### 3. Test Password Reset

```typescript
const { forgetPassword } = useAuth();

await forgetPassword({
  email: "test@example.com"
});

// Reset link will be sent to email
```

### 4. Manual Email Test

Use the test utility:

```typescript
import { sendOTPEmail, sendPasswordResetEmail } from "@/lib/email";

// Test OTP email
const otpResult = await sendOTPEmail({
  to: "your-test@email.com",
  code: "123456"
});

// Test password reset email
const resetResult = await sendPasswordResetEmail({
  to: "your-test@email.com",
  resetLink: "http://localhost:3000/reset-password?token=abc123"
});
```

## Error Handling

### Development
- Logs errors to console
- Continues execution even if email fails
- OTP still displayed in console

### Production
- Throws error if email sending fails
- Prevents user from continuing without email
- Ensures email delivery or blocks process

## Email Templates Used

### OTP Verification Email
- **Template**: `src/emails/otp-verification.tsx`
- **Subject**: "Votre code de vérification"
- **Content**: 6-digit code in large text
- **Validity**: 10 minutes

### Password Reset Email
- **Template**: `src/emails/forgot-password.tsx`
- **Subject**: "Réinitialisation de votre mot de passe"
- **Content**: Reset link with CTA button
- **Validity**: 1 hour

## Monitoring

### Check Email Delivery

1. **Resend Logs**: [https://resend.com/logs](https://resend.com/logs)
2. **View sent emails**
3. **Check delivery status**
4. **Debug failed sends**

### Development Logs

Check terminal for OTP codes:
```
=== OTP Verification ===
Type: email-verification
Email: user@example.com
OTP Code: 123456
=======================
```

## Troubleshooting

### Emails not sending

**Check:**
- ✅ `RESEND_API_KEY` is set in `.env.local`
- ✅ API key is valid (check Resend dashboard)
- ✅ `RESEND_FROM_EMAIL` is verified domain (production)
- ✅ Email service is not blocked by firewall
- ✅ Recipient email is valid

### Emails going to spam

**Solutions:**
- Verify domain with SPF/DKIM records
- Use professional sender address
- Avoid spam trigger words
- Test with different email providers

### OTP not working

**Check:**
- ✅ Code entered within 10 minutes
- ✅ Code matches exactly (case-sensitive)
- ✅ No extra spaces in code
- ✅ Email successfully delivered

## Next Steps

### For Production

1. **Get Resend API Key** from production account
2. **Verify your domain** in Resend
3. **Update environment variables** on hosting platform
4. **Test email delivery** end-to-end
5. **Monitor delivery rates** in Resend dashboard

### Optional Enhancements

1. **Add more email types**:
   - Welcome email after registration
   - Email change confirmation
   - Account deletion notification
   - Mission completed notification

2. **Customize templates**:
   - Add company logo
   - Use brand colors
   - Multi-language support

3. **Add analytics**:
   - Track email open rates
   - Monitor link clicks
   - A/B test templates

## Security Notes

⚠️ **Important:**
- OTP codes are automatically hashed by Better-Auth
- Reset tokens are single-use only
- All codes/tokens have expiration times
- Email sending is server-side only
- Never expose API keys in client code

## Support

For issues or questions:
- Better-Auth Docs: [https://better-auth.com](https://better-auth.com)
- Resend Docs: [https://resend.com/docs](https://resend.com/docs)
- Email Integration Guide: `docs/EMAIL_INTEGRATION.md`
- Implementation Examples: `docs/EMAIL_INTEGRATION_EXAMPLES.md`

---

**Status**: ✅ Fully Implemented and Ready for Use
**Date**: October 26, 2025
