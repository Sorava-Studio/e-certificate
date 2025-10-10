import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  // This will automatically redirect to /login if not authenticated
  const { user } = await requireAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-bold text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user.name || user.email}!
        </p>

        <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-lg">User Information</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Name:</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email:</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role:</dt>
              <dd className="font-medium capitalize">{user.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email Verified:</dt>
              <dd className="font-medium">
                {user.emailVerified ? "Yes" : "No"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
