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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">
              Total Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0</div>
            <p className="text-muted-foreground text-xs">No certificates yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0</div>
            <p className="text-muted-foreground text-xs">
              Create your first template
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-medium text-sm">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">0</div>
            <p className="text-muted-foreground text-xs">Add recipients</p>
          </CardContent>
        </Card>
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
