import { Briefcase } from "lucide-react";
import { redirect } from "next/navigation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getSession, hasAnyRole } from "@/lib/session";

export default async function PartnerMissionsPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const hasPartnerAccess = await hasAnyRole(["partner", "admin"]);

  if (!hasPartnerAccess) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="font-bold text-3xl">Mes Missions</h1>
        <p className="text-muted-foreground">Gérez vos missions assignées</p>
      </div>

      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Briefcase />
          </EmptyMedia>
          <EmptyTitle>Aucune mission pour le moment</EmptyTitle>
          <EmptyDescription>
            Les missions assignées par l&apos;administrateur apparaîtront ici.
            Pour gérer vos clients walk-in, consultez la section Walk-in Client.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <p className="text-muted-foreground text-sm">
            Cette section est réservée aux missions assignées par le système.
          </p>
        </EmptyContent>
      </Empty>
    </div>
  );
}
