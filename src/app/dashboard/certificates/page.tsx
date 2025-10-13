import { Award, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserItems } from "@/app/actions/items";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getCurrentUser } from "@/lib/session";

export default async function CertificatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const result = await getUserItems();
  const items = result.success && result.data ? result.data : [];

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      pending_verification:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      verified:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      flagged: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };

    const labels = {
      draft: "Draft",
      pending_verification: "Pending",
      verified: "Verified",
      flagged: "Flagged",
    };

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">My Certificates</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your registered luxury items and certificates
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/certificates/new">
            <Plus className="mr-2 size-4" />
            Register New Item
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Award className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No items yet</EmptyTitle>
            <EmptyDescription>
              Get started by registering your first luxury item for
              certification.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/dashboard/certificates/new">
                <Plus className="mr-2 size-4" />
                Register Your First Item
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link href={`/dashboard/certificates/${item.id}`} key={item.id}>
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{item.brand}</CardTitle>
                    {getStatusBadge(item.status)}
                  </div>
                  <CardDescription className="line-clamp-1">
                    {item.model}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type:</dt>
                      <dd className="font-medium capitalize">{item.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Reference:</dt>
                      <dd className="font-medium">{item.referenceNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Serial:</dt>
                      <dd className="font-mono text-xs">{item.serialNumber}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Year:</dt>
                      <dd className="font-medium">{item.yearManufactured}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
