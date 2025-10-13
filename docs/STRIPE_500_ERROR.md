# 🔧 Stripe 500 Error - Troubleshooting

## Error You're Seeing

```
POST /api/stripe/checkout 500 in 3406ms
```

## Most Common Causes

### 1. Invalid Stripe API Key

**Check your key:**
```bash
# In .env.local, your key should look like:
STRIPE_SECRET_KEY=sk_test_51ABC123...

# Test mode key: starts with sk_test_
# Live mode key: starts with sk_live_
```

**Get a new key:**
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Click "Reveal test key"
3. Copy the "Secret key"
4. Replace in `.env.local`
5. Restart dev server: `bun dev`

### 2. Stripe Account Not Activated

Your Stripe account might not be fully activated for test mode.

**Fix:**
1. Go to: https://dashboard.stripe.com/test/dashboard
2. Complete account setup if prompted
3. Verify test mode is active (toggle in top-right)

### 3. Network/Connection Issue

Stripe API might be unreachable.

**Test connection:**
```bash
# Test Stripe API directly
curl https://api.stripe.com/v1/checkout/sessions \
  -u sk_test_YOUR_KEY: \
  -d "mode=payment" \
  -d "line_items[0][price_data][currency]=eur" \
  -d "line_items[0][price_data][product_data][name]=Test" \
  -d "line_items[0][price_data][unit_amount]=1000" \
  -d "line_items[0][quantity]=1" \
  -d "success_url=http://localhost:3000/success" \
  -d "cancel_url=http://localhost:3000/cancel"
```

If this fails, check your internet connection or firewall.

### 4. Environment Variable Not Loaded

Server might not have loaded the `.env.local` file.

**Fix:**
```bash
# 1. Stop dev server (Ctrl+C)

# 2. Verify .env.local exists and has key
cat .env.local | grep STRIPE_SECRET_KEY

# 3. Start server again
bun dev

# 4. Check logs for "STRIPE_SECRET_KEY environment variable is not set"
```

### 5. Incorrect Request Body

The wizard might be sending invalid data.

**Check console:**
Open browser DevTools (F12) → Console tab → Look for errors

**Check network:**
DevTools → Network tab → Find `/api/stripe/checkout` → Check request payload

Should look like:
```json
{
  "serviceId": "visus",
  "options": {
    "transportKit": false,
    "transportPackage": false
  },
  "certificationData": {
    "objectType": "montre",
    "brand": "Rolex",
    "model": "Submariner",
    "price": 10000
  }
}
```

## Detailed Debugging Steps

### Step 1: Check Server Logs

With the updated code, you should now see detailed errors in the terminal:

```bash
# Start dev server and watch for errors
bun dev

# Then try to create a certification
# Look for output like:
# Stripe checkout error: {
#   message: "...",
#   stack: "...",
#   error: {...}
# }
```

### Step 2: Verify Stripe Configuration

```typescript
// Test file: test-stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
console.log("Key exists:", !!key);
console.log("Key starts with:", key?.substring(0, 10));

if (key) {
  const stripe = new Stripe(key);
  console.log("Stripe initialized successfully");
}
```

Run: `bun run test-stripe.ts`

### Step 3: Test API Endpoint Directly

```bash
# Test with curl
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_SESSION_TOKEN" \
  -d '{
    "serviceId": "visus",
    "certificationData": {
      "objectType": "montre",
      "brand": "Test",
      "model": "Test",
      "price": 100
    }
  }'
```

### Step 4: Check Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/logs
2. Look for recent API requests
3. Check for errors or failed requests
4. Note the error message

## Common Error Messages

### "No such customer"
- You're using a customer ID that doesn't exist
- Solution: Remove customer_email or use valid customer ID

### "Invalid API key"
- Key is wrong or expired
- Solution: Get new key from dashboard

### "Amount must be at least"
- Amount is too small (min 50 cents for EUR)
- Solution: Ensure prices in cents are >= 50

### "Invalid currency"
- Currency code is wrong
- Solution: Use "eur" not "EUR"

### "Missing required parameter"
- Required field not provided
- Solution: Check all required fields in request

## Quick Fix Checklist

- [ ] `.env.local` file exists
- [ ] `STRIPE_SECRET_KEY` is set
- [ ] Key starts with `sk_test_`
- [ ] Dev server restarted after adding key
- [ ] Stripe account is activated
- [ ] Test mode is enabled in dashboard
- [ ] Internet connection is working
- [ ] No firewall blocking api.stripe.com
- [ ] Request body has all required fields
- [ ] User is logged in (session exists)

## Still Not Working?

### Get Help
1. Check server logs for detailed error
2. Check browser console for JS errors
3. Check Stripe dashboard logs
4. Check `.env.local` file permissions

### Emergency Test
Try the simplest possible case - free tier:

1. Complete wizard
2. Select **Initium** (Free)
3. This should work without Stripe
4. If this works, problem is Stripe-specific
5. If this fails, problem is in wizard/upload

## Expected Working Flow

```
✅ User completes wizard
✅ Clicks submit
✅ Request sent to /api/stripe/checkout
✅ Session validation passes
✅ Pricing calculated
✅ Stripe API called
✅ Checkout session created
✅ Response with checkout URL
✅ Browser redirects to Stripe
✅ User sees payment form
```

If any step fails, that's where to focus debugging.

---

**Current Status:** API endpoint exists and runs authentication successfully (based on query logs), but fails when creating Stripe checkout session. Most likely cause: Invalid Stripe API key or account setup issue.

**Next Action:** Check server terminal for detailed error message now that logging is enabled.
