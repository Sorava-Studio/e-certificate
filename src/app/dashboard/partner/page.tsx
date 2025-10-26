import { Briefcase, CheckCircle2, Package, UserSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getWalkInMissions } from "@/app/actions/walk-in-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession, hasAnyRole } from "@/lib/session";

export const dynamic = "force-dynamic";

const RECENT_MISSIONS_LIMIT = 3;

export default async function PartnerDashboardPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const hasPartnerAccess = await hasAnyRole(["partner", "admin"]);

  if (!hasPartnerAccess) {
    redirect("/dashboard");
  }

  // Fetch walk-in missions for statistics
  const result = await getWalkInMissions();
  const missions = result.success ? result.missions : [];

  const activeMissions =
    missions?.filter(
      (m) =>
        m.mission.status === "pending" || m.mission.status === "in_progress"
    ).length || 0;

  const completedMissions =
    missions?.filter((m) => m.mission.status === "completed").length || 0;

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="font-bold text-3xl">Dashboard Partner</h1>
        <p className="text-muted-foreground">
          Bienvenue, {user.name || user.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Missions Actives
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{activeMissions}</div>
            <p className="text-muted-foreground text-xs">
              {activeMissions === 0
                ? "Aucune mission en cours"
                : "En cours de traitement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Missions Complétées
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{completedMissions}</div>
            <p className="text-muted-foreground text-xs">
              Total des missions terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Clients</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{missions?.length || 0}</div>
            <p className="text-muted-foreground text-xs">
              Clients walk-in enregistrés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/partner/missions">
                <Briefcase className="mr-2 h-4 w-4" />
                Voir Mes Missions
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/partner/walk-in-client">
                <UserSquare className="mr-2 h-4 w-4" />
                Walk-in Client
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/dashboard/partner/available-missions">
                <Package className="mr-2 h-4 w-4" />
                Missions Disponibles
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            {missions && missions.length > 0 ? (
              <div className="space-y-2">
                {missions
                  .slice(0, RECENT_MISSIONS_LIMIT)
                  .map(({ mission, client }) => (
                    <div
                      className="flex items-center justify-between rounded-md border p-3"
                      key={mission.id}
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(mission.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {mission.status === "pending" && "En attente"}
                        {mission.status === "in_progress" && "En cours"}
                        {mission.status === "completed" && "Terminée"}
                        {mission.status === "cancelled" && "Annulée"}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Aucune activité récente
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
