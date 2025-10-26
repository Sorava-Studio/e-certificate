import { UserSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { getWalkInMissions } from "@/app/actions/walk-in-client";
import { WalkInClientWizard } from "@/components/partner/walk-in-client-wizard";
import { WalkInMissionsClient } from "@/components/partner/walk-in-missions-client";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getSession, hasAnyRole } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function WalkInClientPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const hasPartnerAccess = await hasAnyRole(["partner", "admin"]);

  if (!hasPartnerAccess) {
    redirect("/dashboard");
  }

  // Fetch walk-in missions
  const result = await getWalkInMissions();
  const missions = result.success ? result.missions : [];

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Walk-in Client</h1>
          <p className="text-muted-foreground">
            Enregistrez et gérez les clients qui se présentent en boutique
          </p>
        </div>
        <WalkInClientWizard />
      </div>

      {missions && missions.length > 0 ? (
        <WalkInMissionsClient initialMissions={missions} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserSquare />
            </EmptyMedia>
            <EmptyTitle>Aucun client walk-in pour le moment</EmptyTitle>
            <EmptyDescription>
              Cliquez sur le bouton ci-dessus pour enregistrer rapidement les
              clients qui se présentent directement dans votre boutique pour des
              services de certification.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <p className="text-muted-foreground text-sm">
              Les clients enregistrés apparaîtront ici avec leurs informations
              de contact.
            </p>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
