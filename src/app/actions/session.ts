"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Force session refresh by clearing Better Auth cookies
 * Use this after manually changing user roles in the database
 */
export async function forceSessionRefresh() {
  const cookieStore = await cookies();

  // Clear all Better Auth session cookies
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("better-auth") ||
      cookie.name.includes("session")
    ) {
      cookieStore.delete(cookie.name);
    }
  }

  // Redirect to login to create fresh session
  redirect("/login");
}
