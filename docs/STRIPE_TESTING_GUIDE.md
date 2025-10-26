# 🧪 Stripe Payment Testing Guide

## Quick Test (No Webhook Needed)

You can test the Stripe checkout flow without setting up webhooks first. The webhook is only needed for the final certification creation after payment.

### Step 1: Test Checkout Redirect
1. Go to dashboard: http://localhost:3000/dashboard
2. Click "Créer une certification"
3. Complete the wizard:
   - Select object type (e.g., Montre)
   - Fill in details (Brand: "Rolex", Model: "Submariner", Price: 10000)
   - Upload minimum required photos
   - Select **Visus** (50€) service tier
4. Click "Créer la certification"

### Expected Behavior
- ✅ You should be redirected to Stripe checkout page
- ✅ URL should be: `https://checkout.stripe.com/c/pay/...`
- ✅ Page shows amount: €50.00
- ✅ Page shows: "Visus Certification"

### If You Get Error 500
Check these:
1. `STRIPE_SECRET_KEY` is set in `.env.local`
2. Key starts with `sk_test_` (test key)
3. Restart dev server after adding env var
4. Check terminal for error message

## Test Payment (Optional - For Full Flow)

### Use Stripe Test Card
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### After Payment
- Without webhook: You'll be redirected but certification won't be created
- With webhook (see below): Certification will be created automatically

## Setup Webhooks (For Full Flow)

### Method 1: Stripe CLI (Recommended for Local Testing)

#### Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Verify installation
stripe --version
```

#### Login and Forward Webhooks
```bash
# Login to your Stripe account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### Copy Webhook Secret
The CLI will output something like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

#### Add to .env.local
```bash
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

#### Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Start again
bun dev
```

### Method 2: ngrok (Alternative)

If Stripe CLI doesn't work, use ngrok:

```bash
# Install ngrok
brew install ngrok

# Start tunnel
ngrok http 3000

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Add webhook in Stripe Dashboard:
# https://dashboard.stripe.com/test/webhooks
# Endpoint URL: https://abc123.ngrok.io/api/webhooks/stripe
# Events: checkout.session.completed
```

## Complete Test Flow

With webhook running:

1. **Start Webhook Listener**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **In Another Terminal, Start Dev Server**
   ```bash
   bun dev
   ```

3. **Complete Certification Wizard**
   - Go to http://localhost:3000/dashboard
   - Click "Créer une certification"
   - Complete all 4 steps
   - Select paid tier (Visus, Custodia, or Imperium)
   - Submit

4. **Pay with Test Card**
   - Card: `4242 4242 4242 4242`
   - Complete payment

5. **Watch the Magic! ✨**
   - Webhook listener shows event received
   - You're redirected to certificates page
   - Toast: "Uploading photos..."
   - Toast: "Creating certification..."
   - Toast: "Certification créée avec succès!"
   - New certification appears in list

## Troubleshooting

### "Unauthorized" Error
- Make sure you're logged in
- Check session in browser dev tools

### "Invalid service tier" Error
- Check that `serviceId` is one of: initium, visus, custodia, imperium
- Verify POST request body

### Stripe Checkout 500 Error
```bash
# Check Stripe API key
echo $STRIPE_SECRET_KEY

# Should start with sk_test_
# If empty, add to .env.local:
STRIPE_SECRET_KEY=sk_test_your_key_here

# Restart server
```

### Webhook Not Receiving Events
```bash
# Check Stripe CLI is running
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Should show:
# > Ready! You are using Stripe API Version...
# > Ready! Your webhook signing secret is whsec_...

# Test webhook manually
stripe trigger checkout.session.completed
```

### Photos Not Uploading After Payment
- Check `/public/uploads/` directory exists
- Verify file permissions
- Check browser console for errors
- Ensure sessionStorage has form data

### Certification Not Created
- Check webhook received event (Stripe CLI output)
- Check server logs for errors
- Verify database connection
- Check user has valid session

## Debugging Commands

```bash
# Check Stripe events
stripe events list

# View specific event
stripe events retrieve evt_xxx

# Test trigger
stripe trigger checkout.session.completed

# Check logs
stripe logs tail

# Verify webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/stripe
```

## Quick Reference

### Test Cards
```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
🔒 3D Secure: 4000 0027 6000 3184
💳 Visa: 4242 4242 4242 4242
💳 Mastercard: 5555 5555 5555 4444
```

### Pricing
```
Initium:  Free (0€) - No payment
Visus:    50€
Custodia: 125€
Imperium: 250€

Add-ons:
Transport Kit: +15€
Transport Package: +25€
Insurance Basic: +10€
Insurance Standard: +25€
Insurance Premium: +50€
```

### API Endpoints
```
POST /api/stripe/checkout     - Create checkout session
POST /api/webhooks/stripe     - Process Stripe webhooks
POST /api/certifications      - Create certification
POST /api/certifications/upload - Upload photos
```

## Success Criteria

✅ Checkout page loads
✅ Payment processes
✅ Redirect back to app
✅ Photos upload
✅ Certification created
✅ Success message shown
✅ Certificate appears in list
✅ Database record exists

---

**Need Help?**
- Stripe Dashboard: https://dashboard.stripe.com/test
- Stripe API Logs: https://dashboard.stripe.com/test/logs
- Stripe Webhooks: https://dashboard.stripe.com/test/webhooks
- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
