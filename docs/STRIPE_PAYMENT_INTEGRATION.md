# 💳 Stripe Payment Integration - Complete

## Overview
Complete Stripe payment integration for EMERA certification services. Users are redirected to Stripe Checkout for paid tiers, then certifications are created after successful payment.

## 🎯 Features Implemented

### 1. Centralized Pricing Configuration (`/src/config/pricing.ts`)
- **Single source of truth** for all pricing
- Used by both homepage and certification wizard
- Service tier prices:
  - **Initium**: Free (0€)
  - **Visus**: 50€ (5,000 cents)
  - **Custodia**: 125€ (12,500 cents)
  - **Imperium**: 250€ (25,000 cents)
- Additional fees:
  - Transport Kit: 15€
  - Transport Package: 25€
  - Insurance Basic: 10€
  - Insurance Standard: 25€
  - Insurance Premium: 50€
- Helper functions:
  - `getPricingTier()` - Get tier by ID
  - `formatPrice()` - Format cents to EUR
  - `calculateTotalPrice()` - Calculate with options

### 2. Stripe Checkout API (`/src/app/api/stripe/checkout/route.ts`)
- **POST /api/stripe/checkout** - Create checkout session
- Takes:
  - Service ID (initium, visus, custodia, imperium)
  - Options (transport, insurance)
  - Certification data (brand, model, etc.)
- Returns:
  - Checkout session ID
  - Checkout URL (redirect user here)
- Features:
  - Skips payment for free tier (Initium)
  - Creates line items for each fee
  - Stores metadata for webhook processing
  - Success redirect: `/dashboard/certificates?payment=success&session_id={id}`
  - Cancel redirect: `/dashboard?payment=cancelled`

### 3. Stripe Webhook Handler (`/src/app/api/webhooks/stripe/route.ts`)
- **POST /api/webhooks/stripe** - Process Stripe events
- Handles `checkout.session.completed` event
- Verifies webhook signature for security
- Extracts metadata from checkout session
- Creates certification in database
- Sets status to `en_attente` (pending)
- Sets `paidAt` timestamp

### 4. Updated Certification Button (`/src/components/dashboard/certification/CertificationButton.tsx`)
- Checks if service is free or paid
- **Free tier (Initium)**:
  - Uploads photos immediately
  - Creates certification directly
  - No payment required
- **Paid tiers (Visus, Custodia, Imperium)**:
  - Stores form data in sessionStorage
  - Redirects to Stripe checkout
  - Waits for payment success

### 5. Payment Return Handler (`/src/components/dashboard/certification/PaymentReturnHandler.tsx`)
- Client component that runs on certificates page
- Detects `?payment=success&session_id=xxx` query params
- Retrieves form data from sessionStorage
- Uploads photos to server
- Creates certification with photo URLs
- Shows success message with certificate number
- Redirects to certificates list
- Clears sessionStorage

### 6. Certificates Page Integration (`/src/app/dashboard/certificates/page.tsx`)
- Added `<PaymentReturnHandler />` component
- Automatically processes successful payments
- Shows toast notifications for each step:
  - "Uploading photos..."
  - "Creating certification..."
  - "Certification créée avec succès!"

## 🔄 Payment Flow

### For Free Tier (Initium)
```
1. User completes wizard
2. Clicks "Créer la certification"
3. Photos uploaded
4. Certification created immediately
5. Success message shown
6. Page refreshes with new certification
```

### For Paid Tiers (Visus, Custodia, Imperium)
```
1. User completes wizard
2. Clicks "Créer la certification"
3. Form data stored in sessionStorage
4. API creates Stripe checkout session
5. User redirected to Stripe checkout
6. User enters payment details
7. Stripe processes payment
8. Stripe redirects to: /dashboard/certificates?payment=success&session_id=xxx
9. PaymentReturnHandler detects success
10. Photos uploaded
11. Certification created
12. sessionStorage cleared
13. Success message shown
14. User sees new certification
```

## 🔐 Security Features

- **Webhook signature verification**: Ensures events come from Stripe
- **User authentication**: Requires valid session
- **Ownership verification**: User ID in metadata
- **HTTPS required**: Stripe webhooks require HTTPS in production

## 💻 Setup Instructions

### 1. Stripe Dashboard Setup
```bash
# 1. Go to: https://dashboard.stripe.com/test/apikeys
# 2. Copy your secret key (sk_test_...)
# 3. Add to .env.local:
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. Webhook Setup (Development)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret (whsec_...)
# Add to .env.local:
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 3. Webhook Setup (Production)
```bash
# 1. Go to: https://dashboard.stripe.com/webhooks
# 2. Click "Add endpoint"
# 3. Enter your URL: https://yourdomain.com/api/webhooks/stripe
# 4. Select event: checkout.session.completed
# 5. Copy the webhook signing secret
# 6. Add to production environment variables
```

## 📝 Testing Checklist

### Free Tier (Initium)
- [ ] Complete wizard with all photos
- [ ] Select Initium service
- [ ] Click "Créer la certification"
- [ ] Verify no payment redirect
- [ ] Verify certification created immediately
- [ ] Check database for new record

### Paid Tier - Success
- [ ] Complete wizard with all photos
- [ ] Select Visus/Custodia/Imperium
- [ ] Add optional features (transport, insurance)
- [ ] Click "Créer la certification"
- [ ] Verify redirect to Stripe checkout
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete payment
- [ ] Verify redirect back to app
- [ ] Verify "Uploading photos..." toast
- [ ] Verify "Creating certification..." toast
- [ ] Verify success message with cert number
- [ ] Check database for new record with `paidAt` timestamp

### Paid Tier - Cancelled
- [ ] Start payment process
- [ ] Click "Back" or close checkout
- [ ] Verify redirect to /dashboard?payment=cancelled
- [ ] Verify no certification created
- [ ] Verify can retry wizard

## 🧪 Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

Any future expiry date, any CVC, any ZIP code.

## 🚀 Production Deployment

### Environment Variables
```bash
# Required in production
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Stripe Configuration
1. Switch to live mode in dashboard
2. Create webhook endpoint with production URL
3. Update environment variables
4. Test with real (small amount) transaction
5. Monitor Stripe dashboard for events

## 📊 Pricing Sync

The homepage now uses the same pricing configuration as the wizard:
- Import from `/src/config/pricing.ts`
- Use `PRICING_TIERS` array for pricing cards
- Use `formatPrice()` for consistent formatting
- All prices automatically stay in sync

## 🐛 Troubleshooting

### "Invalid signature" error
- Check webhook secret matches Stripe CLI output
- Verify using correct secret for environment (test vs live)
- Ensure raw body is passed to webhook verification

### Payment succeeds but no certification
- Check Stripe webhook events dashboard
- Verify webhook endpoint is receiving events
- Check server logs for errors
- Ensure database permissions correct

### Photos not uploading after payment
- Check sessionStorage has data
- Verify upload endpoint working
- Check file size limits
- Ensure public/uploads directory exists

### Stuck on "Uploading photos..."
- Check network tab for failed requests
- Verify API routes are accessible
- Check file permissions
- Look for CORS errors

## 📚 Related Files

### Created Files
1. `/src/config/pricing.ts` - Pricing configuration
2. `/src/app/api/stripe/checkout/route.ts` - Checkout API
3. `/src/app/api/webhooks/stripe/route.ts` - Webhook handler
4. `/src/components/dashboard/certification/PaymentReturnHandler.tsx` - Payment success handler

### Modified Files
1. `/src/components/dashboard/certification/CertificationButton.tsx` - Payment integration
2. `/src/app/dashboard/certificates/page.tsx` - Payment handler integration

---

**Status**: ✅ Complete and Ready for Testing
**Last Updated**: October 20, 2025
**Integration Type**: Stripe Checkout with Webhooks
