import { Package } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getSession, hasAnyRole } from "@/lib/session";

export default async function AvailableMissionsPage() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Missions Disponibles</h1>
          <p className="text-muted-foreground">
            Consultez et acceptez les missions disponibles
          </p>
        </div>
        <Badge variant="secondary">Bientôt disponible</Badge>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-center">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Package />
              </EmptyMedia>
              <EmptyTitle>Fonctionnalité en développement</EmptyTitle>
              <EmptyDescription>
                Le système de missions disponibles est actuellement en cours de
                développement. Vous pourrez bientôt consulter et accepter de
                nouvelles missions directement depuis cette page.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="space-y-2 text-left">
                <p className="font-medium text-sm">Fonctionnalités à venir :</p>
                <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
                  <li>Liste des missions disponibles par région</li>
                  <li>Détails complets de chaque mission</li>
                  <li>Système d&apos;acceptation en un clic</li>
                  <li>Filtres par type de certification</li>
                  <li>Notifications en temps réel</li>
                </ul>
              </div>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
