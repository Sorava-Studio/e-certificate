# Email Integration with Resend & React Email

## Overview
This project uses **Resend** for transactional email delivery with **React Email** for beautiful, responsive email templates.

## Features
- ✅ OTP verification emails
- ✅ Password reset emails
- ✅ Type-safe email templates with React
- ✅ Server-side rendering for emails
- ✅ Professional, responsive design

## Setup

### 1. Environment Variables
Add these to your `.env.local`:

```bash
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# From email address (must be verified in Resend)
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Application URL for reset links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Verify Your Domain in Resend
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain
3. Add the required DNS records
4. Wait for verification (usually a few minutes)

**For Development:**
You can use the default `onboarding@resend.dev` email address without domain verification.

## Email Templates

### OTP Verification Email
Located in: `src/emails/otp-verification.tsx`

**Usage:**
```typescript
import { sendOTP } from "@/app/actions/email";

// Send OTP code
const result = await sendOTP("user@example.com", "123456");

if (result.success) {
  console.log("OTP email sent!");
} else {
  console.error("Failed:", result.error);
}
```

**Features:**
- Clean, modern design
- Large, monospaced code display
- 10-minute validity notice
- Security message for unauthorized requests

### Password Reset Email
Located in: `src/emails/forgot-password.tsx`

**Usage:**
```typescript
import { sendPasswordReset } from "@/app/actions/email";

// Send password reset link
const result = await sendPasswordReset("user@example.com", "reset-token-123");

if (result.success) {
  console.log("Reset email sent!");
} else {
  console.error("Failed:", result.error);
}
```

**Features:**
- Prominent CTA button
- 1-hour validity notice
- Clear instructions
- Security message

## Implementation Examples

### 1. Integration with OTP Verification

```typescript
// In your registration flow
import { sendOTP } from "@/app/actions/email";

async function handleRegistration(email: string) {
  // Generate OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in database with expiration
  await storeOTP(email, otpCode, new Date(Date.now() + 10 * 60 * 1000));

  // Send email
  const result = await sendOTP(email, otpCode);

  if (!result.success) {
    throw new Error("Failed to send verification email");
  }

  return { success: true };
}
```

### 2. Integration with Password Reset

```typescript
// In your forgot password flow
import { sendPasswordReset } from "@/app/actions/email";
import { randomBytes } from "crypto";

async function handleForgotPassword(email: string) {
  // Generate reset token
  const resetToken = randomBytes(32).toString("hex");

  // Store token in database with expiration (1 hour)
  await storeResetToken(email, resetToken, new Date(Date.now() + 60 * 60 * 1000));

  // Send email
  const result = await sendPasswordReset(email, resetToken);

  if (!result.success) {
    throw new Error("Failed to send reset email");
  }

  return { success: true };
}
```

## Preview Emails Locally

React Email comes with a development preview server:

```bash
# Start the email preview server
npm run email:dev
# or
bun email:dev
```

Add this script to your `package.json`:
```json
{
  "scripts": {
    "email:dev": "email dev"
  }
}
```

Then visit `http://localhost:3000` to preview your email templates.

## File Structure

```
src/
├── emails/
│   ├── otp-verification.tsx       # OTP email template
│   └── forgot-password.tsx        # Password reset template
├── lib/
│   └── email.ts                   # Resend client & email functions
└── app/
    └── actions/
        └── email.ts               # Server actions for sending emails
```

## API Reference

### `sendOTP(email: string, code: string)`
Send an OTP verification email.

**Parameters:**
- `email`: Recipient email address
- `code`: 6-digit OTP code

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Validations:**
- Email format validation
- Code must be 6 digits
- Required fields check

### `sendPasswordReset(email: string, resetToken: string)`
Send a password reset email.

**Parameters:**
- `email`: Recipient email address
- `resetToken`: Unique reset token

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Validations:**
- Email format validation
- Required fields check
- Generates reset link automatically

## Customization

### Styling Email Templates

Email templates use inline styles for maximum compatibility:

```typescript
const styles = {
  main: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system,BlinkMacSystemFont,..."
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "12px 24px",
    // ... more styles
  }
};
```

### Adding New Templates

1. Create a new file in `src/emails/`:
```typescript
// src/emails/welcome-email.tsx
import { Body, Container, Html, Text } from "@react-email/components";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>Welcome {name}!</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
```

2. Add sending function in `src/lib/email.ts`:
```typescript
export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  const emailHtml = await render(WelcomeEmail({ name }));

  return await resend.emails.send({
    from: `${APP_NAME} <${FROM_EMAIL}>`,
    to: [to],
    subject: "Welcome!",
    html: emailHtml,
  });
}
```

3. Create server action in `src/app/actions/email.ts`:
```typescript
export async function sendWelcome(email: string, name: string) {
  const result = await sendWelcomeEmail({ to: email, name });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
```

## Best Practices

### 1. Email Deliverability
- Always verify your domain in Resend
- Use a professional sender address
- Keep subject lines clear and concise
- Include unsubscribe links for marketing emails
- Test emails before sending to production

### 2. Security
- Never expose API keys in client-side code
- Use server actions for all email sending
- Implement rate limiting for email endpoints
- Validate all email addresses before sending
- Use secure tokens for password resets

### 3. User Experience
- Send confirmation messages immediately
- Include clear call-to-action buttons
- Provide alternative text-only versions
- Keep emails mobile-responsive
- Include contact support information

### 4. Development
- Use preview server during development
- Test with real email addresses
- Monitor Resend dashboard for delivery rates
- Handle errors gracefully
- Log email sending for debugging

## Testing

### Manual Testing
```typescript
// Test OTP email
await sendOTP("your-test@email.com", "123456");

// Test password reset
await sendPasswordReset("your-test@email.com", "test-token-123");
```

### Check Resend Dashboard
1. Go to [Resend Logs](https://resend.com/logs)
2. View sent emails
3. Check delivery status
4. Debug any errors

## Troubleshooting

### Emails not sending
- Verify RESEND_API_KEY is set correctly
- Check domain verification status
- Ensure FROM_EMAIL is verified
- Check Resend logs for errors

### Emails going to spam
- Verify SPF/DKIM records in DNS
- Use verified sender domain
- Avoid spam trigger words
- Include unsubscribe link

### Template not rendering
- Check React Email syntax
- Verify all components are imported
- Test with preview server
- Check for inline style errors

## Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email/docs)
- [Email Template Gallery](https://react.email/examples)
- [Resend Dashboard](https://resend.com/overview)
- [Email Best Practices](https://resend.com/docs/send-with-nextjs)

## Next Steps

1. **Add more email templates:**
   - Welcome email
   - Email change confirmation
   - Account deletion confirmation
   - Mission completed notification
   - Payment receipt

2. **Enhance templates:**
   - Add company logo
   - Custom branding colors
   - Multi-language support
   - Dark mode support

3. **Advanced features:**
   - Email scheduling
   - Batch sending
   - Email analytics
   - A/B testing
   - Transactional logs
