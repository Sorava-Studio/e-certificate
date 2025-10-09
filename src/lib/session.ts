import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * ============================================
 * 🔐 SESSION MANAGEMENT UTILITIES
 * ============================================
 *
 * Server-side session utilities for Better Auth.
 * Use these in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 * - API Routes
 *
 * IMPORTANT: These utilities are SERVER-SIDE ONLY.
 * For client-side session management, use the Better Auth React hooks.
 *
 * Available Roles:
 * - user: Regular user with dashboard access
 * - partner: Partner user with dashboard access
 * - admin: Administrator with admin dashboard access
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

type UserRole = "user" | "partner" | "admin";

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: SessionUser;
};

// ============================================
// CORE SESSION FUNCTIONS
// ============================================

/**
 * Get the current session with user data
 *
 * Returns the full session object including user information.
 * Returns null if the user is not authenticated.
 *
 * @example
 * ```tsx
 * // In a Server Component
 * export default async function DashboardPage() {
 *   const session = await getSession();
 *
 *   if (!session) {
 *     redirect("/login");
 *   }
 *
 *   return <div>Welcome {session.user.name}</div>;
 * }
 * ```
 */
export async function getSession(): Promise<UserSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    return session as UserSession;
  } catch {
    return null;
  }
}

/**
 * Get only the current user (without session metadata)
 *
 * Convenience function when you only need user information.
 *
 * @example
 * ```tsx
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log(user.email, user.role);
 * }
 * ```
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if a user is authenticated
 *
 * Simple boolean check for authentication status.
 *
 * @example
 * ```tsx
 * const isAuth = await isAuthenticated();
 * if (!isAuth) {
 *   return <LoginPrompt />;
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

// ============================================
// AUTHENTICATION GUARDS
// ============================================

/**
 * Require authentication - redirect to login if not authenticated
 *
 * Use this at the top of Server Components or Server Actions
 * that require authentication. Automatically redirects to /login.
 *
 * @param callbackUrl - Optional URL to redirect back to after login
 * @returns Session with user data
 *
 * @example Server Component:
 * ```tsx
 * export default async function ProfilePage() {
 *   const { user } = await requireAuth();
 *   return <div>Email: {user.email}</div>;
 * }
 * ```
 *
 * @example Server Action:
 * ```tsx
 * "use server";
 *
 * export async function updateProfile(data: ProfileData) {
 *   const { user } = await requireAuth();
 *   await db.update(profiles).set(data).where(eq(profiles.userId, user.id));
 *   return { success: true };
 * }
 * ```
 */
export async function requireAuth(callbackUrl?: string): Promise<UserSession> {
  const session = await getSession();

  if (!session) {
    const { redirect } = await import("next/navigation");
    const loginUrl = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(loginUrl);
  }

  // TypeScript doesn't know that redirect() throws
  // This line is never reached because redirect() throws an error
  return session as UserSession;
}

/**
 * Require specific role - redirect if user doesn't have required role
 *
 * Implements Role-Based Access Control (RBAC).
 * Use in Server Components, Server Actions, or Route Handlers.
 *
 * @param role - Required role (user, partner, or admin)
 * @param redirectTo - Where to redirect if role check fails (default: /dashboard)
 * @returns Session with user data
 *
 * @example Server Component:
 * ```tsx
 * export default async function AdminPage() {
 *   const { user } = await requireRole("admin");
 *   return <AdminDashboard user={user} />;
 * }
 * ```
 *
 * @example Server Action:
 * ```tsx
 * "use server";
 *
 * export async function deleteUser(userId: string) {
 *   await requireRole("admin");
 *   await db.delete(users).where(eq(users.id, userId));
 *   return { success: true };
 * }
 * ```
 */
export async function requireRole(
  role: UserRole,
  redirectTo = "/dashboard"
): Promise<UserSession> {
  const session = await requireAuth();

  if (session.user.role !== role) {
    const { redirect } = await import("next/navigation");
    redirect(redirectTo);
  }

  // TypeScript doesn't know that redirect() throws, so we need this
  // This line is never reached because redirect() throws
}

/**
 * Check if user has specific role (without redirect)
 *
 * Non-redirecting role check. Use this when you want to
 * conditionally show content based on role.
 *
 * @param role - Role to check
 * @returns true if user has the role, false otherwise
 *
 * @example
 * ```tsx
 * const isAdmin = await hasRole("admin");
 * if (isAdmin) {
 *   return <AdminControls />;
 * }
 * ```
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 *
 * Useful when multiple roles should have access.
 *
 * @param roles - Array of allowed roles
 * @returns true if user has any of the roles
 *
 * @example
 * ```tsx
 * // Allow both partners and admins
 * const hasAccess = await hasAnyRole(["partner", "admin"]);
 * ```
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }
  return roles.includes(user.role);
}

/**
 * Require admin role - shorthand for requireRole("admin")
 *
 * @example
 * ```tsx
 * export default async function AdminDashboard() {
 *   const { user } = await requireAdmin();
 *   return <AdminPanel user={user} />;
 * }
 * ```
 */
export async function requireAdmin(): Promise<UserSession> {
  return await requireRole("admin", "/dashboard");
}

/**
 * Check if current user is admin (without redirect)
 *
 * @example
 * ```tsx
 * const isAdmin = await isAdmin();
 * ```
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole("admin");
}

// ============================================
// ERROR HANDLING FOR SERVER ACTIONS
// ============================================

/**
 * Custom error for authentication failures in server actions
 *
 * Throw this in server actions when auth is required but missing.
 * Catch it in your components to show appropriate error messages.
 *
 * @example
 * ```tsx
 * "use server";
 *
 * export async function updateProfile(data: ProfileData) {
 *   const session = await getSession();
 *
 *   if (!session) {
 *     throw new AuthError("You must be logged in");
 *   }
 *
 *   // Update logic...
 * }
 *
 * // In component:
 * try {
 *   await updateProfile(data);
 * } catch (error) {
 *   if (error instanceof AuthError) {
 *     toast.error(error.message);
 *     router.push("/login");
 *   }
 * }
 * ```
 */
export class AuthError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthError";
  }
}

// ============================================
// CLIENT-SIDE SESSION HOOKS
// ============================================

/**
 * CLIENT-SIDE SESSION MANAGEMENT
 *
 * For client components, use Better Auth React hooks from auth-client:
 *
 * @example
 * ```tsx
 * "use client";
 * import { authClient } from "@/lib/auth-client";
 *
 * export function ClientComponent() {
 *   const { data: session, isPending } = authClient.useSession();
 *
 *   if (isPending) return <div>Loading...</div>;
 *   if (!session) return <div>Please log in</div>;
 *
 *   return <div>Welcome {session.user.name}</div>;
 * }
 * ```
 */

// ============================================
// TYPE EXPORTS
// ============================================

export type { UserRole, SessionUser, UserSession };
