# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:

- ✅ Vercel account (https://vercel.com)
- ✅ GitHub repository connected to Vercel
- ✅ Production PostgreSQL database
- ✅ Stripe account with live API keys
- ✅ Resend account with verified domain
- ✅ AWS S3 bucket for file storage
- ✅ Google OAuth credentials (optional)

## Step-by-Step Deployment

### 1. Prepare Your Database

#### Option A: Vercel Postgres (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create Postgres database
vercel postgres create
```

#### Option B: External Provider (Neon, Supabase, Railway)

1. Create a PostgreSQL database
2. Enable SSL connections
3. Get connection strings (pooled and direct)
4. Note down credentials for next steps

### 2. Push Database Schema

```bash
# Set environment variables locally first
export DATABASE_URL="postgresql://..."
export DIRECT_DATABASE_URL="postgresql://..."

# Push schema to production database
npm run db:push

# Verify tables created
npm run db:studio
```

### 3. Set Up Stripe Webhooks

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Save for environment variables

### 4. Set Up Resend Email

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records to your domain provider:

```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record
Type: TXT
Name: resend._domainkey
Value: [Provided by Resend]

# DMARC Record (optional but recommended)
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

5. Wait for verification (usually 5-10 minutes)
6. Get API key from [API Keys](https://resend.com/api-keys)
7. Set `RESEND_FROM_EMAIL` to verified domain email (e.g., `noreply@yourdomain.com`)

### 5. Configure AWS S3

#### Create S3 Bucket

```bash
# Using AWS CLI
aws s3 mb s3://your-production-bucket --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket your-production-bucket \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket your-production-bucket \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

#### Configure CORS

Create `cors.json`:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-app.vercel.app"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Apply CORS:
```bash
aws s3api put-bucket-cors \
  --bucket your-production-bucket \
  --cors-configuration file://cors.json
```

#### Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Create new user with programmatic access
3. Attach policy (create custom or use AmazonS3FullAccess)
4. Save Access Key ID and Secret Access Key

### 6. Configure Environment Variables in Vercel

#### Via Vercel Dashboard

1. Go to your project in Vercel
2. Navigate to **Settings → Environment Variables**
3. Add each variable from `.env.vercel`

#### Via Vercel CLI

```bash
# Set production variables
vercel env add BETTER_AUTH_SECRET production
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
# ... etc for all variables

# Set preview variables (optional)
vercel env add BETTER_AUTH_SECRET preview
vercel env add DATABASE_URL preview
# ... etc
```

#### Required Variables Checklist

```bash
# Application
✅ NEXT_PUBLIC_APP_URL
✅ NODE_ENV=production

# Database
✅ DATABASE_URL
✅ DIRECT_DATABASE_URL

# Authentication
✅ BETTER_AUTH_SECRET
✅ BETTER_AUTH_URL
✅ BETTER_AUTH_TRUST_HOST=true
✅ BETTER_AUTH_SESSION_MAX_AGE=604800

# OAuth (if using)
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET

# Stripe
✅ STRIPE_SECRET_KEY
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ STRIPE_WEBHOOK_SECRET

# Email
✅ RESEND_API_KEY
✅ RESEND_FROM_EMAIL
✅ NEXT_PUBLIC_SUPPORT_EMAIL

# File Storage
✅ STORAGE_PROVIDER=s3
✅ AWS_REGION
✅ AWS_ACCESS_KEY_ID
✅ AWS_SECRET_ACCESS_KEY
✅ AWS_S3_BUCKET

# File Upload Limits
✅ NEXT_PUBLIC_MAX_FILE_SIZE=10485760
✅ NEXT_PUBLIC_ALLOWED_FILE_TYPES
```

### 7. Deploy to Vercel

#### Via Git Push (Automatic)

```bash
# Commit your changes
git add .
git commit -m "Ready for production deployment"
git push origin main

# Vercel will automatically deploy
```

#### Via Vercel CLI

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### 8. Post-Deployment Verification

#### Check Deployment Status

1. Go to Vercel Dashboard → Deployments
2. Verify build succeeded
3. Check build logs for errors

#### Test Critical Flows

```bash
# Test production URL
curl https://your-app.vercel.app/api/health

# Test authentication
# - Sign up new user
# - Verify email OTP
# - Sign in
# - Check session

# Test Stripe
# - Create subscription
# - Check webhook received
# - Verify payment

# Test Email
# - Send OTP
# - Send password reset
# - Check Resend logs

# Test File Upload
# - Upload certification photo
# - Verify S3 storage
# - Download/view photo
```

#### Monitor Logs

```bash
# View real-time logs
vercel logs --follow

# View recent logs
vercel logs
```

## Domain Setup

### Add Custom Domain

1. Go to **Project → Settings → Domains**
2. Add your domain (e.g., `app.yourdomain.com`)
3. Configure DNS:

```dns
# For subdomain (app.yourdomain.com)
Type: CNAME
Name: app
Value: cname.vercel-dns.com

# For root domain (yourdomain.com)
Type: A
Name: @
Value: 76.76.21.21
```

4. Wait for DNS propagation (can take up to 48 hours)
5. Vercel will automatically provision SSL certificate

### Update Environment Variables

After adding custom domain:

```bash
# Update these variables
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
BETTER_AUTH_URL=https://app.yourdomain.com

# Update OAuth redirect URIs in Google Console
# Update Stripe webhook URL
# Update S3 CORS allowed origins
```

## Troubleshooting

### Build Failures

**Error: Database connection failed**
- Check `DATABASE_URL` is set correctly
- Verify database is accessible from Vercel
- Enable SSL if required

**Error: Missing environment variables**
- Verify all required variables are set
- Check variable names match exactly
- Redeploy after adding variables

### Runtime Errors

**500 Internal Server Error**
- Check Vercel logs: `vercel logs`
- Verify all environment variables
- Check database connection
- Review API route errors

**Stripe webhooks not working**
- Verify webhook URL matches deployment URL
- Check `STRIPE_WEBHOOK_SECRET` is correct
- View webhook attempts in Stripe dashboard
- Ensure endpoint returns 200 status

**Emails not sending**
- Verify `RESEND_API_KEY` is production key
- Check domain is verified in Resend
- View logs in Resend dashboard
- Verify `RESEND_FROM_EMAIL` uses verified domain

**File uploads failing**
- Check AWS credentials are correct
- Verify S3 bucket exists and is accessible
- Check CORS configuration
- Review IAM permissions

### Performance Issues

**Slow database queries**
- Enable connection pooling
- Use Vercel Postgres for better performance
- Add database indexes
- Review slow query logs

**High function execution time**
- Review Vercel function logs
- Optimize heavy computations
- Use edge functions for static content
- Enable caching where appropriate

## Monitoring & Maintenance

### Set Up Error Tracking

Install Sentry or similar:

```bash
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard -i nextjs
```

### Enable Analytics

Vercel Analytics (built-in):
1. Go to **Project → Analytics**
2. Enable Web Analytics
3. Enable Speed Insights

### Database Backups

**Vercel Postgres:**
- Automatic daily backups
- Manual backup: Use pg_dump

**External providers:**
- Enable automated backups
- Test restore process regularly

### Monitor Costs

- Review Vercel usage dashboard
- Monitor AWS S3 storage and bandwidth
- Track Stripe API calls
- Monitor Resend email quota

## Security Best Practices

### Secrets Management

```bash
# Never commit secrets to Git
# Use Vercel environment variables
# Rotate secrets regularly

# Generate new auth secret
openssl rand -base64 32
```

### Rate Limiting

Add to API routes:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

### CORS Configuration

Ensure proper CORS settings in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "https://your-app.vercel.app" },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
      ],
    },
  ];
}
```

### SSL/TLS

- Vercel provides automatic HTTPS
- Enforce HTTPS redirects
- Use secure cookies (`secure: true`)
- Enable HSTS headers

## Rollback Strategy

### Quick Rollback

```bash
# Via Vercel dashboard
# Go to Deployments → Previous deployment → Promote to Production

# Via CLI
vercel rollback
```

### Gradual Rollout

```bash
# Deploy to preview first
vercel

# Test thoroughly
# Promote to production when ready
vercel --prod
```

## Checklist Before Going Live

- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] Stripe webhooks configured and tested
- [ ] Email domain verified and tested
- [ ] S3 bucket configured with proper permissions
- [ ] OAuth providers configured with production URLs
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Error tracking enabled
- [ ] Analytics enabled
- [ ] Database backups configured
- [ ] Test all critical user flows
- [ ] Review and optimize performance
- [ ] Set up monitoring and alerts
- [ ] Document deployment process
- [ ] Train team on production deployment

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

## Quick Reference

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# View environment variables
vercel env ls

# Link local project
vercel link

# Pull environment variables
vercel env pull .env.local

# Promote deployment
vercel promote <deployment-url>

# Rollback
vercel rollback
```

---

**Ready to Deploy!** 🚀

Follow this guide step-by-step for a successful production deployment.
