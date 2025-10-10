import { LogoutButton } from "@/components/auth/logout-button";
import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  // This will automatically redirect to /login if not authenticated
  const { user } = await requireAuth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Dashboard Page</h1>
        <p className="mt-4 text-gray-600">
          This is a protected dashboard page.
        </p>
        <div className="mt-6 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <p className="font-semibold text-gray-700 text-sm dark:text-gray-300">
            Authenticated User:
          </p>
          <p className="mt-2 text-lg">{user.name || user.email}</p>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Role: {user.role}
          </p>
        </div>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
