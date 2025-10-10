# Quick Start: Testing Login Flow

## Prerequisites
- Database is running (Docker Compose)
- Environment variables are set
- Application is running on `http://localhost:3000`

## Test the Login Flow

### 1. Access Login Page
```
Navigate to: http://localhost:3000/login
```

### 2. Create Test Account (if needed)
```
Navigate to: http://localhost:3000/register
- Fill in name, email, password
- Verify with OTP (check console in dev mode)
```

### 3. Test Login
```
1. Go to http://localhost:3000/login
2. Enter email and password
3. Check "Remember me" checkbox
4. Click "Login"
5. Should redirect to /dashboard
```

### 4. Test Protected Route
```
1. Open new tab
2. Navigate to http://localhost:3000/dashboard
3. Should already be logged in (session persists)
```

### 5. Test Remember Me
```
1. Login with "Remember me" checked
2. Close browser completely
3. Reopen browser
4. Navigate to http://localhost:3000/dashboard
5. Should still be logged in
```

### 6. Test Logout
```
1. From dashboard, click "Sign out"
2. Should redirect to /login
3. Try accessing /dashboard
4. Should redirect back to /login
```

### 7. Test Callback URL
```
1. While logged out, try to access:
   http://localhost:3000/dashboard
2. Should redirect to:
   http://localhost:3000/login?callbackUrl=/dashboard
3. After login, should return to /dashboard
```

### 8. Test Cross-Tab Session
```
1. Login in Tab 1
2. Open Tab 2, go to /dashboard
3. Should be logged in automatically
4. Logout in Tab 1
5. Refresh Tab 2
6. Should be logged out in Tab 2 too
```

### 9. Test Google OAuth
```
1. Click "Continue with Google"
2. Authorize with Google account
3. Should create account and login
4. Redirect to dashboard
```

## Common Test Scenarios

### Invalid Credentials
```
Email: test@example.com
Password: wrongpassword
Expected: "Invalid email or password" error
```

### Empty Fields
```
Submit form with empty email or password
Expected: Validation errors appear inline
```

### Network Error Simulation
```
1. Stop the server
2. Try to login
3. Expected: "An unexpected error occurred" message
```

## Development Console (OTP Code)

In development mode, OTP codes are logged to console:
```
=== OTP Verification ===
Type: email-verification
Email: user@example.com
OTP Code: 123456
=======================
```

## Quick Commands

### Start Development Server
```bash
npm run dev
```

### Start Database
```bash
docker-compose up -d
```

### Run Migrations
```bash
npm run db:migrate
```

### View Database
```bash
npm run db:studio
```

## Expected Behavior Summary

✅ Login redirects to dashboard
✅ Session persists across tabs
✅ Remember me extends session
✅ Protected routes require auth
✅ Logout clears all sessions
✅ Callback URL redirects work
✅ Error messages display correctly
✅ Loading states show during requests
✅ Google OAuth integration works
✅ Form validation prevents invalid input
