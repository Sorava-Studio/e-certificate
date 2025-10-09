# 🔐 Authentication System - Complete Guide

Complete documentation for the Better Auth authentication system with middleware, session management, and protected routes.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Route Structure](#route-structure)
4. [Visual Flow Diagrams](#visual-flow-diagrams)
5. [How It Works](#how-it-works)
6. [Usage Examples](#usage-examples)
7. [API Reference](#api-reference)
8. [Security Features](#security-features)
9. [Next Steps](#next-steps)

---

## 🎯 Overview

This authentication system is built with **Better Auth** and provides:

- ✅ Session-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Email/Password authentication with OTP verification
- ✅ Google OAuth support
- ✅ Protected routes via middleware
- ✅ Server-side session management
- ✅ Client-side React hooks

### User Roles

The system supports three user roles:

- **`user`**: Regular users with dashboard access
- **`partner`**: Partner users with dashboard access
- **`admin`**: Administrators with admin dashboard access

---

## 🏗️ Architecture

### File Structure

```
src/
├── middleware.ts              # Route protection & RBAC
├── lib/
│   ├── auth.ts               # Better Auth server configuration
│   ├── auth-client.ts        # Better Auth client hooks
│   └── session.ts            # Server-side session utilities (Components + Actions)
└── app/
    ├── (auth)/
    │   ├── login/            # Login page
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       ├── login-form.tsx
    │   │       └── success-card.tsx
    │   │
    │   ├── register/         # Registration page
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       ├── register-form.tsx
    │   │       ├── otp-verification.tsx (animated)
    │   │       └── success-card.tsx
    │   │
    │   └── forgot-password/  # Password reset page
    │       ├── page.tsx
    │       └── components/
    │           ├── forgot-form.tsx
    │           ├── otp-verification.tsx (animated)
    │           └── success-card.tsx
    │
    ├── dashboard/            # User/Partner dashboard (protected)
    └── admin/                # Admin dashboard (admin-only)
```

### Component Organization

**Shared Components** (used across auth flows):
- `otp-verification.tsx` - Animated OTP input component (6-digit code)
- `success-card.tsx` - Success message card with animations

**Auth Flow Components**:
- Login: `login-form` → `success-card`
- Register: `register-form` → `otp-verification` → `success-card`
- Forgot Password: `forgot-form` → `otp-verification` → `success-card`

---

## 🛣️ Route Structure

### Public Routes (No Authentication Required)

| Route | Purpose | Components Flow |
|-------|---------|----------------|
| `/` | Home page | Landing page |
| `/login` | User login | Login form → Success card |
| `/register` | User registration | Register form → OTP verification → Success card |
| `/forgot-password` | Password reset | Forgot form → OTP verification → Success card |

**Behavior**: If an authenticated user visits these routes, they're automatically redirected to `/dashboard`.

### Protected Routes (Authentication Required)

| Route | Allowed Roles | Purpose |
|-------|---------------|---------|
| `/dashboard` | user, partner, admin | User/Partner dashboard |
| `/profile` | user, partner, admin | User profile |
| `/settings` | user, partner, admin | User settings |
| `/certificates` | user, partner, admin | Certificate management |

**Behavior**: If an unauthenticated user visits these routes, they're redirected to `/login?callbackUrl=<original-url>`.

### Admin Routes (Admin Role Required)

| Route | Allowed Roles | Purpose |
|-------|---------------|---------|
| `/admin` | admin | Admin dashboard |
| `/admin/*` | admin | Admin pages |

**Behavior**:
- Unauthenticated users → Redirected to `/login`
- Non-admin users → Redirected to `/dashboard`

---

## 🗺️ Visual Flow Diagrams

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Request                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      middleware.ts                               │
│  • Checks authentication status                                  │
│  • Validates user role                                           │
│  • Handles redirects                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌──────────────────┐  ┌──────────────────┐
        │  Public Routes   │  │ Protected Routes │
        │  - /login        │  │  - /dashboard    │
        │  - /register     │  │  - /admin        │
        │  - /forgot-pwd   │  │  - /profile      │
        └──────────────────┘  └──────────────────┘
                                        ↓
                        ┌───────────────┴──────────────┐
                        │    Server Component/Action   │
                        └───────────────┬──────────────┘
                                        ↓
                    ┌───────────────────────────────────┐
                    │          session.ts               │
                    │  (Server Components & Actions)    │
                    │                                   │
                    │  • requireAuth()                  │
                    │  • requireRole()                  │
                    │  • requireAdmin()                 │
                    │  • getSession()                   │
                    └───────────────┬───────────────────┘
                                    ↓
                    ┌───────────────────────────┐
                    │    Better Auth API        │
                    │  /api/auth/get-session    │
                    └───────────────────────────┘
                                    ↓
                    ┌───────────────────────────┐
                    │  Database (PostgreSQL)    │
                    │  • user table             │
                    │  • session table          │
                    │  • account table          │
                    └───────────────────────────┘
```

### User Registration Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Visit /register
     ↓
┌────────────────────────────────────┐
│  Registration Page                 │
│  ┌──────────────────────────────┐ │
│  │  Register Form Component     │ │
│  │  • Name                      │ │
│  │  • Email                     │ │
│  │  • Password                  │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 2. Submit form
             ↓
┌────────────────────────────────────┐
│  Better Auth API                   │
│  • Create account                  │
│  • Send OTP email                  │
└────────────┬───────────────────────┘
             │ 3. Animate to OTP component
             ↓
┌────────────────────────────────────┐
│  Registration Page                 │
│  ┌──────────────────────────────┐ │
│  │  OTP Verification Component  │ │
│  │  (Animated transition)       │ │
│  │  • Enter 6-digit OTP         │ │
│  │  • Auto-submit on complete   │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 4. Verify OTP
             ↓
┌────────────────────────────────────┐
│  Better Auth API                   │
│  • Verify OTP                      │
│  • Mark email as verified          │
│  • Create session                  │
└────────────┬───────────────────────┘
             │ 5. Animate to success
             ↓
┌────────────────────────────────────┐
│  Registration Page                 │
│  ┌──────────────────────────────┐ │
│  │  Success Card Component      │ │
│  │  (Animated transition)       │ │
│  │  ✓ Account created!          │ │
│  │  ✓ Redirecting...            │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 6. Auto redirect (2s delay)
             ↓
┌────────────────────────────────────┐
│     /dashboard                     │
└────────────────────────────────────┘
```

### User Login Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Visit /login
     ↓
┌────────────────────────────────────┐
│  Login Page                        │
│  ┌──────────────────────────────┐ │
│  │  Login Form Component        │ │
│  │  • Email                     │ │
│  │  • Password                  │ │
│  │  • Remember me               │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 2. Submit credentials
             ↓
┌────────────────────────────────────┐
│  Better Auth API                   │
│  • Validate credentials            │
│  • Create session                  │
│  • Set secure cookie               │
└────────────┬───────────────────────┘
             │ 3. Animate to success
             ↓
┌────────────────────────────────────┐
│  Login Page                        │
│  ┌──────────────────────────────┐ │
│  │  Success Card Component      │ │
│  │  (Animated transition)       │ │
│  │  ✓ Welcome back!             │ │
│  │  ✓ Redirecting...            │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 4. Redirect (1s delay)
             ↓
┌────────────────────────────────────┐
│  /dashboard                        │
│  (or callbackUrl if provided)      │
└────────────────────────────────────┘
```

### Password Reset Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Visit /forgot-password
     ↓
┌────────────────────────────────────┐
│  Forgot Password Page              │
│  ┌──────────────────────────────┐ │
│  │  Forgot Form Component       │ │
│  │  • Enter email               │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 2. Submit email
             ↓
┌────────────────────────────────────┐
│  Better Auth API                   │
│  • Validate email exists           │
│  • Send OTP email                  │
└────────────┬───────────────────────┘
             │ 3. Animate to OTP component
             ↓
┌────────────────────────────────────┐
│  Forgot Password Page              │
│  ┌──────────────────────────────┐ │
│  │  OTP Verification Component  │ │
│  │  (Animated transition)       │ │
│  │  • Enter 6-digit OTP         │ │
│  │  • New password field        │ │
│  │  • Confirm password          │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 4. Verify OTP & reset password
             ↓
┌────────────────────────────────────┐
│  Better Auth API                   │
│  • Verify OTP                      │
│  • Update password                 │
└────────────┬───────────────────────┘
             │ 5. Animate to success
             ↓
┌────────────────────────────────────┐
│  Forgot Password Page              │
│  ┌──────────────────────────────┐ │
│  │  Success Card Component      │ │
│  │  (Animated transition)       │ │
│  │  ✓ Password reset!           │ │
│  │  ✓ Redirecting to login...   │ │
│  └──────────────────────────────┘ │
└────────────┬───────────────────────┘
             │ 6. Redirect (2s delay)
             ↓
┌────────────────────────────────────┐
│     /login                         │
└────────────────────────────────────┘
```

### Middleware Route Protection

```
                 ┌─────────────────┐
                 │  User Request   │
                 └────────┬────────┘
                          │
                          ↓
                ┌─────────────────────┐
                │  Get Session from   │
                │  Better Auth API    │
                └────────┬────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ↓               ↓               ↓
┌────────────────┐ ┌──────────┐ ┌─────────────┐
│ Public Auth    │ │  Admin   │ │  Protected  │
│ Routes         │ │  Routes  │ │  Routes     │
│ /login         │ │  /admin  │ │  /dashboard │
│ /register      │ │          │ │  /profile   │
│ /forgot-pwd    │ │          │ │             │
└────────┬───────┘ └────┬─────┘ └──────┬──────┘
         │              │               │
         │              │               │
    ┌────▼────┐    ┌────▼────┐     ┌───▼────┐
    │ Auth?   │    │ Auth?   │     │ Auth?  │
    └────┬────┘    └────┬────┘     └───┬────┘
         │              │               │
    ┌────▼────┐         │          ┌───▼────┐
    │  YES    │         │          │   NO   │
    └────┬────┘         │          └───┬────┘
         │              │               │
         ↓              │               ↓
   Redirect to     ┌────▼────┐    Redirect to
   /dashboard      │ Admin?  │    /login with
                   └────┬────┘    callbackUrl
                        │
                   ┌────▼────┐
                   │   NO    │
                   └────┬────┘
                        │
                        ↓
                   Redirect to
                   /dashboard
```

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────┐
│                     User Roles                          │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     USER     │  │   PARTNER    │  │    ADMIN     │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Access:      │  │ Access:      │  │ Access:      │
│ • /dashboard │  │ • /dashboard │  │ • /dashboard │
│ • /profile   │  │ • /profile   │  │ • /profile   │
│ • /settings  │  │ • /settings  │  │ • /settings  │
│ • /certs     │  │ • /certs     │  │ • /certs     │
│              │  │ • Partner    │  │ • /admin     │
│              │  │   features   │  │ • All access │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Component Usage Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Types                          │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ↓                           ↓
┌───────────────────────────┐  ┌────────────────────────────┐
│   SERVER COMPONENTS       │  │   CLIENT COMPONENTS        │
├───────────────────────────┤  ├────────────────────────────┤
│ Use:                      │  │ Use:                       │
│ • session.ts utilities    │  │ • authClient hooks         │
│   - requireAuth()         │  │   - useSession()           │
│   - requireRole()         │  │   - signIn.email()         │
│   - requireAdmin()        │  │   - signUp.email()         │
│   - getSession()          │  │   - signOut()              │
│   - getCurrentUser()      │  │                            │
│   - hasRole()             │  │ "use client"               │
│                           │  │                            │
│ Example:                  │  │ Example:                   │
│ async function Page() {   │  │ function Component() {     │
│   const { user } =        │  │   const { data } =         │
│     await requireAuth();  │  │     authClient.useSession()│
│   return <div>...</div>;  │  │   return <div>...</div>;   │
│ }                         │  │ }                          │
└───────────────────────────┘  └────────────────────────────┘
                │                           │
                ↓                           ↓
┌───────────────────────────┐  ┌────────────────────────────┐
│   SERVER ACTIONS          │  │   CLIENT ACTIONS           │
├───────────────────────────┤  ├────────────────────────────┤
│ Use:                      │  │ Call server actions:       │
│ • session.ts utilities    │  │                            │
│   - requireAuth()         │  │ const result =             │
│   - requireRole()         │  │   await updateProfile();   │
│   - getSession()          │  │                            │
│   - throw AuthError()     │  │ // Handle errors:          │
│                           │  │ try {                      │
│ "use server"              │  │   await action();          │
│                           │  │ } catch (e) {              │
│ Example:                  │  │   if (e instanceof         │
│ async function action() { │  │       AuthError) {         │
│   const { user } =        │  │     // Handle auth error   │
│     await requireAuth();  │  │   }                        │
│   // Update DB            │  │ }                          │
│ }                         │  │                            │
└───────────────────────────┘  └────────────────────────────┘
```

---

## 🔄 How It Works

### 1. Middleware Flow

The middleware (`src/middleware.ts`) runs on **every request** and follows this logic:

```
Request comes in
    ↓
Skip if: API route, static file, or Next.js internal
    ↓
Fetch session from Better Auth API
    ↓
┌─────────────────────────────────────┐
│ Check route type:                   │
│                                     │
│ Public Auth Route (login/register)  │
│   → If authenticated: redirect to   │
│     /dashboard                      │
│                                     │
│ Admin Route (/admin/*)              │
│   → If not authenticated: redirect  │
│     to /login                       │
│   → If not admin: redirect to       │
│     /dashboard                      │
│                                     │
│ Protected Route (/dashboard/*)      │
│   → If not authenticated: redirect  │
│     to /login?callbackUrl=<url>     │
│                                     │
│ Public Route                        │
│   → Allow through                   │
└─────────────────────────────────────┘
    ↓
Continue to page
```

### 2. Session Management

Use **`src/lib/session.ts`** for all server-side authentication:

```typescript
// ✅ Works in Server Components
// ✅ Works in Server Actions
// ✅ Works in Route Handlers

import { requireAuth, requireRole, getSession, AuthError } from "@/lib/session";
```

#### Pattern 1: Automatic Redirect (Simple)
```typescript
"use server";

export async function updateProfile(data: ProfileData) {
  const { user } = await requireAuth(); // Auto-redirects if not logged in
  // Your logic here
}
```

#### Pattern 2: Error Handling (Advanced)
```typescript
"use server";

export async function updateProfile(data: ProfileData) {
  const session = await getSession();

  if (!session) {
    throw new AuthError("Please log in first");
  }

  // Your logic here
}

// In component: catch the error and handle it
```

### 3. Client-Side Session

Use **Better Auth React hooks** in client components:

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function ClientComponent() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Please log in</div>;

  return <div>Welcome {session.user.name}</div>;
}
```

---

## 💡 Usage Examples

### Example 1: Protected Server Component

```tsx
// app/dashboard/page.tsx
import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  // Automatically redirects to /login if not authenticated
  const { user } = await requireAuth();

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### Example 2: Admin-Only Server Component

```tsx
// app/admin/page.tsx
import { requireAdmin } from "@/lib/session";

export default async function AdminPage() {
  // Redirects non-admin users to /dashboard
  const { user } = await requireAdmin();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin {user.name}</p>
    </div>
  );
}
```

### Example 3: Conditional Rendering Based on Role

```tsx
// app/dashboard/page.tsx
import { getCurrentUser, hasRole } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = await hasRole("admin");
  const isPartner = await hasRole("partner");

  return (
    <div>
      <h1>Dashboard</h1>

      {isAdmin && <AdminControls />}
      {isPartner && <PartnerFeatures />}

      <UserContent user={user} />
    </div>
  );
}
```

### Example 4: Server Action with Authentication

```tsx
// actions/profile.ts
"use server";

import { requireAuth } from "@/lib/session";
import { db } from "@/db";

export async function updateProfile(data: ProfileData) {
  // Redirects if not authenticated (won't reach here if not logged in)
  const { user } = await requireAuth();

  await db.update(profiles)
    .set(data)
    .where(eq(profiles.userId, user.id));

  return { success: true };
}
```

### Example 5: Server Action with Error Handling

```tsx
// actions/profile.ts
"use server";

import { getSession, AuthError } from "@/lib/session";
import { db } from "@/db";

export async function updateProfile(data: ProfileData) {
  const session = await getSession();

  if (!session) {
    throw new AuthError("You must be logged in to update your profile");
  }

  await db.update(profiles)
    .set(data)
    .where(eq(profiles.userId, session.user.id));

  return { success: true };
}

// In your component:
"use client";

try {
  const result = await updateProfile(data);
  toast.success("Profile updated!");
} catch (error) {
  if (error instanceof AuthError) {
    toast.error(error.message);
    router.push("/login");
  }
}
```

### Example 6: Admin-Only Server Action

```tsx
// actions/admin.ts
"use server";

import { requireAdmin } from "@/lib/session";

export async function deleteUser(userId: string) {
  // Redirects if not admin
  await requireAdmin();

  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}
```

### Example 7: Client Component with Session

```tsx
// components/profile-menu.tsx
"use client";

import { authClient } from "@/lib/auth-client";

export function ProfileMenu() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <a href="/login">Login</a>;
  }

  return (
    <div>
      <img src={session.user.image} alt={session.user.name} />
      <span>{session.user.name}</span>
      <span className="badge">{session.user.role}</span>
    </div>
  );
}
```

### Example 8: Animated Auth Flow Component

```tsx
// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { RegisterForm } from "./components/register-form";
import { OTPVerification } from "./components/otp-verification";
import { SuccessCard } from "./components/success-card";

type Step = "form" | "otp" | "success";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");

  return (
    <div className="relative min-h-screen">
      {/* Animate between steps */}
      {step === "form" && (
        <RegisterForm
          onSuccess={(userEmail) => {
            setEmail(userEmail);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <OTPVerification
          email={email}
          onSuccess={() => setStep("success")}
        />
      )}

      {step === "success" && (
        <SuccessCard
          title="Account Created!"
          message="Redirecting to dashboard..."
          redirectTo="/dashboard"
        />
      )}
    </div>
  );
}
```

---

## 📚 API Reference

### Session Utilities (`src/lib/session.ts`)

All functions work in Server Components, Server Actions, and Route Handlers.

#### `getSession()`
Returns the full session object or null.

```typescript
const session = await getSession();
// Returns: { session: {...}, user: {...} } | null
```

#### `getCurrentUser()`
Returns only the user object.

```typescript
const user = await getCurrentUser();
// Returns: { id, email, name, role, ... } | null
```

#### `isAuthenticated()`
Boolean check for authentication.

```typescript
const isAuth = await isAuthenticated();
// Returns: boolean
```

#### `requireAuth(callbackUrl?: string)`
Requires authentication, redirects to login if not authenticated.

```typescript
const { user, session } = await requireAuth("/original-page");
```

#### `requireRole(role: UserRole, redirectTo?: string)`
Requires specific role, redirects if not authorized.

```typescript
const { user } = await requireRole("admin", "/dashboard");
```

#### `hasRole(role: UserRole)`
Checks if user has a specific role (no redirect).

```typescript
const isAdmin = await hasRole("admin");
```

#### `hasAnyRole(roles: UserRole[])`
Checks if user has any of the specified roles.

```typescript
const hasAccess = await hasAnyRole(["admin", "partner"]);
```

#### `requireAdmin()`
Shorthand for `requireRole("admin")`.

```typescript
const { user } = await requireAdmin();
```

#### `isAdmin()`
Check if current user is admin (without redirect).

```typescript
const isAdmin = await isAdmin();
```

#### `AuthError`
Custom error class for authentication failures in server actions.

```typescript
throw new AuthError("You must be logged in");
```

### Client Hooks (`src/lib/auth-client.ts`)

```typescript
import { authClient } from "@/lib/auth-client";

// Get session
const { data: session, isPending } = authClient.useSession();

// Sign in
await authClient.signIn.email({ email, password });

// Sign up
await authClient.signUp.email({ email, password, name });

// Sign out
await authClient.signOut();
```

---

## 🔒 Security Features

1. **Automatic Session Validation**: Every protected route checks session validity via Better Auth API
2. **Role-Based Access Control**: Three-tier role system (user, partner, admin)
3. **Secure Redirects**: Original URLs preserved in `callbackUrl` parameter
4. **OTP Verification**: Email verification for registration and password reset
5. **CSRF Protection**: Built into Better Auth
6. **Secure Cookies**: HTTP-only, secure cookies for session tokens
7. **Password Hashing**: Automatic via Better Auth
8. **Session Expiration**: Configurable session timeout

---

## 🚀 Next Steps

### 1. Create Auth Pages

#### Login Page (`app/(auth)/login/page.tsx`)
- Login form component
- Success card with animation
- Link to register and forgot password

#### Register Page (`app/(auth)/register/page.tsx`)
- Register form component
- Animated OTP verification component
- Success card with auto-redirect

#### Forgot Password Page (`app/(auth)/forgot-password/page.tsx`)
- Email input form
- Animated OTP verification with password reset
- Success card with redirect to login

### 2. Create Reusable Components

#### OTP Verification Component
```tsx
interface OTPVerificationProps {
  email: string;
  type: "email-verification" | "password-reset";
  onSuccess: () => void;
  onResend?: () => void;
}
```

Features:
- 6-digit OTP input with auto-focus
- Auto-submit when complete
- Resend OTP button with cooldown
- Error handling
- Loading states
- Smooth animations (fade in/out, slide)

#### Success Card Component
```tsx
interface SuccessCardProps {
  title: string;
  message: string;
  redirectTo: string;
  delay?: number; // milliseconds
}
```

Features:
- Success icon with animation
- Auto-redirect after delay
- Progress indicator
- Smooth fade-in animation

### 3. Create Dashboard Pages

#### User/Partner Dashboard (`app/dashboard/page.tsx`)
- Welcome message
- Quick stats
- Recent activity
- Role-based features

#### Admin Dashboard (`app/admin/page.tsx`)
- Admin controls
- User management
- System settings
- Analytics

### 4. Add Animations

Recommended animation library: **Framer Motion**

```bash
bun add framer-motion
```

Example animation transitions:
- Form → OTP: Slide left
- OTP → Success: Fade + Scale
- Success → Redirect: Fade out

---

## 📝 Notes

- All server-side utilities are in `src/lib/session.ts`
- All client-side utilities use `authClient` from `src/lib/auth-client.ts`
- Middleware automatically handles route protection based on authentication and role
- Better Auth manages all session creation, validation, and destruction
- OTP codes are logged to console in development mode (see `src/lib/auth.ts`)
- The OTP verification component is reusable across register and forgot-password flows
- Success cards provide consistent UX across all auth flows

---

**Created by**: Sorava Studio
**Date**: October 9, 2025
**Version**: 2.0 - Simplified & Combined
