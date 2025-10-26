import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * ============================================
 * 🛡️ AUTHENTICATION MIDDLEWARE
 * ============================================
 *
 * This middleware protects routes and manages access control:
 * - Blocks unauthenticated users from protected routes
 * - Redirects authenticated users away from auth pages
 * - Implements role-based access control (RBAC)
 *
 * Route Structure:
 * - /register → Public (register form, OTP verification, success)
 * - /login → Public (login form, success)
 * - /forgot-password → Public (forgot form, OTP, success)
 * - /verify-email → Public (shared OTP component)
 * - /dashboard → Protected (user, partner roles)
 * - /admin → Protected (admin role only)
 */

// ============================================
// ROUTE CONFIGURATION
// ============================================

/**
 * Public routes - accessible without authentication
 * Users will be redirected to /dashboard if already authenticated
 */
const publicAuthRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
];

/**
 * Protected routes - require authentication
 * Users will be redirected to /login if not authenticated
 */
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/certificates",
];

/**
 * Admin-only routes - require admin role
 * Users without admin role will be redirected to /dashboard
 */
const adminRoutes = ["/admin"];

// Partner routes removed — partner UI reset

// ============================================
// MIDDLEWARE FUNCTION
// ============================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static resources
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Get session from Better Auth
  const { isAuthenticated, userRole } = await getSession(request);

  // Handle public auth routes
  if (isPublicAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Handle role-based routes
  const roleCheckResult = checkRoleBasedRoutes(
    pathname,
    isAuthenticated,
    userRole,
    request
  );
  if (roleCheckResult) {
    return roleCheckResult;
  }

  // Handle general protected routes
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return redirectToLogin(pathname, request);
  }

  return NextResponse.next();
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  );
}

function isPublicAuthRoute(pathname: string): boolean {
  return publicAuthRoutes.some((route) => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function redirectToLogin(pathname: string, request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

function checkRoleBasedRoutes(
  pathname: string,
  isAuthenticated: boolean,
  userRole: string | null,
  request: NextRequest
): NextResponse | null {
  // Check admin routes
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return redirectToLogin(pathname, request);
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return null;
  }

  return null;
}

// ============================================
// SESSION HELPER
// ============================================

/**
 * Get session from Better Auth API
 *
 * Makes a server-side request to verify the user's session
 * and retrieve their role for RBAC.
 */
async function getSession(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  userRole: string | null;
}> {
  try {
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!response.ok) {
      return { isAuthenticated: false, userRole: null };
    }

    const data = await response.json();

    if (data?.session && data?.user) {
      return {
        isAuthenticated: true,
        userRole: data.user.role || null,
      };
    }

    return { isAuthenticated: false, userRole: null };
  } catch {
    return { isAuthenticated: false, userRole: null };
  }
}

// ============================================
// MIDDLEWARE MATCHER
// ============================================

/**
 * Configure which routes the middleware should run on
 * Excludes: static files, images, API auth routes
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (.*\\..*) - files with extensions
     * - api/auth (Better Auth API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};
