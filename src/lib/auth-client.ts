import { adminClient, emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the base URL - handle Vercel's automatic URL
const getBaseURL = () => {
  // For client-side, we can only use NEXT_PUBLIC_ variables
  if (typeof window !== "undefined") {
    // In the browser, use the current origin
    return window.location.origin;
  }
  
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('$')) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // For Vercel deployments during SSR
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to localhost for development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [emailOTPClient(), adminClient()],
});
