# Role Change Testing Guide

## Problem
When you change a user's role directly in the database, the app still shows the old role because Better Auth caches session data.

## Solutions Implemented

### 1. Reduced Cache Duration
Changed session cookie cache from 5 minutes to 10 seconds in `src/lib/auth.ts`.

### 2. Disabled Cookie Cache in Session Functions
Added `disableCookieCache: true` to `getSession()` in `src/lib/session.ts` to force fresh data on every request.

### 3. Force Dynamic Rendering
Added these exports to dashboard layouts:
```typescript
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

This prevents Next.js from caching the pages.

### 4. Refresh Session Button
Added a "Refresh Session" button to the dashboard that:
- Signs the user out
- Redirects to login
- Forces a fresh session on next login

## How to Test Role Changes

### Method 1: Use Refresh Button (Recommended)
1. Log in to the dashboard
2. In another tab/window, change the role in the database:
   ```sql
   UPDATE "user" SET role = 'partner' WHERE email = 'test@example.com';
   ```
3. Go back to the dashboard tab
4. Click the **"Refresh Session"** button in the top right
5. Log back in
6. You should now see the partner menu in the sidebar

### Method 2: Wait 10 Seconds
1. Log in to the dashboard
2. Change the role in the database
3. Wait 10-15 seconds for cache to expire
4. Refresh the page (F5 or Cmd+R)
5. The new role should appear

### Method 3: Clear Browser Storage (Nuclear Option)
1. Change role in database
2. Open browser DevTools (F12)
3. Go to Application > Storage
4. Click "Clear site data"
5. Close DevTools
6. Refresh the page and log back in

## Testing Partner Features

### 1. Create a Partner Account
```sql
UPDATE "user"
SET role = 'partner'
WHERE email = 'your-email@example.com';
```

### 2. Click "Refresh Session" Button
Located in the top right of the dashboard, next to the certification button.

### 3. Log Back In
You should now see the "Partner Tools" section in the sidebar with:
- Partner Dashboard
- Available Orders
- My Certifications
- Walk-in Customer

### 4. Test Partner Dashboard
- Navigate to `/dashboard/partner`
- You should see statistics for available orders
- Try accepting an order

## Database Query Examples

### Change user to partner:
```sql
UPDATE "user" SET role = 'partner' WHERE email = 'test@example.com';
```

### Change user to admin:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'test@example.com';
```

### Change user back to regular user:
```sql
UPDATE "user" SET role = 'user' WHERE email = 'test@example.com';
```

### Check current role:
```sql
SELECT email, role, name FROM "user" WHERE email = 'test@example.com';
```

## Troubleshooting

### Role still not updating?
1. Make sure you clicked the "Refresh Session" button
2. Check that the database role actually changed
3. Try clearing browser cookies for localhost
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Partner menu not showing?
1. Verify role is 'partner' or 'admin' in database
2. Use the Refresh Session button
3. Check the User Information card on dashboard - it should show the new role
4. If role is correct but menu doesn't show, refresh the page

### Getting redirected to dashboard from partner routes?
- This means your role isn't 'partner' or 'admin'
- Use the Refresh Session button to force a session refresh
- Verify the database role is correct

## Technical Details

### Session Cache Settings
- **Previous**: 5 minutes (300 seconds)
- **Current**: 10 seconds
- This means role changes are visible within 10 seconds

### Files Modified
- `src/lib/auth.ts` - Reduced cache duration
- `src/lib/session.ts` - Added disableCookieCache
- `src/app/dashboard/layout.tsx` - Force dynamic rendering
- `src/app/dashboard/partner/page.tsx` - Force dynamic rendering
- `src/app/dashboard/page.tsx` - Added refresh button
- `src/components/layout/RefreshSessionButton.tsx` - New component

### Cache Layers
1. **Better Auth Cookie Cache** - Now 10 seconds
2. **Next.js Route Cache** - Disabled with force-dynamic
3. **Better Auth getSession** - Bypassed with disableCookieCache flag

All three layers are now configured to show role changes quickly!
