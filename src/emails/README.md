# Email Templates

This directory contains React Email templates for transactional emails.

## Available Templates

### 1. OTP Verification (`otp-verification.tsx`)
Sends a 6-digit verification code to users during registration.

**Props:**
- `code`: string - The 6-digit OTP code
- `email`: string - Recipient's email address

**Usage:**
```typescript
import { OTPVerificationEmail } from "@/emails/otp-verification";
import { render } from "@react-email/components";

const html = await render(OTPVerificationEmail({ code: "123456", email: "user@example.com" }));
```

### 2. Forgot Password (`forgot-password.tsx`)
Sends a password reset link to users who forgot their password.

**Props:**
- `resetLink`: string - The password reset URL with token
- `email`: string - Recipient's email address

**Usage:**
```typescript
import { ForgotPasswordEmail } from "@/emails/forgot-password";
import { render } from "@react-email/components";

const html = await render(
  ForgotPasswordEmail({
    resetLink: "https://app.com/reset?token=abc",
    email: "user@example.com"
  })
);
```

## Development

### Preview Templates Locally

1. Start the email preview server:
```bash
npm run email:dev
```

2. Open http://localhost:3000 in your browser

3. Edit templates and see changes in real-time

### Creating New Templates

1. Create a new file in this directory:
```tsx
// new-template.tsx
import { Body, Container, Html, Text } from "@react-email/components";

export function NewTemplate({ name }: { name: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>Hello {name}!</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default NewTemplate;
```

2. Add preview props for development:
```tsx
NewTemplate.PreviewProps = {
  name: "John Doe",
};
```

3. Use inline styles for email compatibility

4. Test in the preview server before deploying

## Best Practices

### Styling
- Always use inline styles (object notation)
- Avoid CSS classes or external stylesheets
- Test in multiple email clients
- Keep layouts simple and table-based

### Content
- Keep subject lines under 50 characters
- Use clear, actionable CTAs
- Include both text and button links
- Add security disclaimers for sensitive actions
- State expiration times clearly

### Accessibility
- Use semantic HTML
- Add alt text for images
- Ensure sufficient color contrast
- Use readable font sizes (min 14px)

## Components Available

From `@react-email/components`:
- `Html` - Root HTML wrapper
- `Head` - Document head
- `Preview` - Email preview text
- `Body` - Email body
- `Container` - Centered content wrapper
- `Section` - Content section
- `Text` - Paragraph text
- `Heading` - Headings (h1-h6)
- `Link` - Hyperlinks
- `Button` - CTA buttons
- `Hr` - Horizontal rule
- `Img` - Images

See [React Email Docs](https://react.email/docs/components) for full list.

## Testing

Test emails before sending to production:

1. Send test emails to yourself
2. Check rendering in multiple clients:
   - Gmail
   - Outlook
   - Apple Mail
   - Mobile clients
3. Verify links work correctly
4. Check spam score
5. Test on different devices

## Resources

- [React Email Documentation](https://react.email)
- [Email Template Gallery](https://react.email/examples)
- [Email Client CSS Support](https://www.campaignmonitor.com/css/)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)
