import { CertificationButton } from "@/components/dashboard/certification/CertificationButton";
import { RefreshSessionButton } from "@/components/layout/RefreshSessionButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  // This will automatically redirect to /login if not authenticated
  const { user } = await requireAuth();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || user.email}!
          </p>
        </div>
        <div className="flex gap-2">
          <RefreshSessionButton />
          <CertificationButton />
        </div>
      </div>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  );
}
