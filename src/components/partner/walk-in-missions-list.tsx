"use client";

import { CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  WalkInClient,
  WalkInMission,
} from "@/db/schema/tables/walk-in-client";
import { CertificationReportDialog } from "./certification-report-dialog";
import { CompleteMissionDialog } from "./complete-mission-dialog";

type MissionWithClient = {
  mission: WalkInMission;
  client: WalkInClient;
};

type WalkInMissionsListProps = {
  missions: MissionWithClient[];
  onStatusChange?: (missionId: string, status: string) => void;
  onCompleteMission?: (missionId: string) => Promise<void>;
};

const statusConfig = {
  pending: {
    label: "En attente",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  in_progress: {
    label: "En cours",
    icon: PlayCircle,
    variant: "default" as const,
    color: "text-blue-600",
  },
  completed: {
    label: "Terminée",
    icon: CheckCircle2,
    variant: "outline" as const,
    color: "text-green-600",
  },
  cancelled: {
    label: "Annulée",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
};

export function WalkInMissionsList({
  missions,
  onStatusChange,
  onCompleteMission,
}: WalkInMissionsListProps) {
  if (missions.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {missions.map(({ mission, client }) => {
        const status = statusConfig[mission.status];
        const StatusIcon = status.icon;
        const clientName = `${client.firstName} ${client.lastName}`;

        return (
          <Card key={mission.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{clientName}</CardTitle>
                  <CardDescription className="mt-1">
                    Walk-in Client
                  </CardDescription>
                </div>
                <Badge variant={status.variant}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> {client.email}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Téléphone:</span> {client.phone}
                </p>
                {client.city && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Ville:</span> {client.city}
                  </p>
                )}
              </div>

              {mission.notes && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">Notes:</p>
                  <p className="text-muted-foreground">{mission.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {mission.status === "pending" && onStatusChange && (
                  <Button
                    className="w-full"
                    onClick={() => onStatusChange(mission.id, "in_progress")}
                    size="sm"
                  >
                    Démarrer
                  </Button>
                )}
                {mission.status === "in_progress" && (
                  <>
                    <CertificationReportDialog
                      clientName={clientName}
                      missionId={mission.id}
                    />
                    {onCompleteMission && (
                      <CompleteMissionDialog
                        clientEmail={client.email}
                        clientName={clientName}
                        clientPhone={client.phone}
                        createdAt={mission.createdAt}
                        missionId={mission.id}
                        onConfirm={onCompleteMission}
                        serviceTier={mission.serviceTier || "custodia"}
                      />
                    )}
                  </>
                )}
              </div>

              <p className="text-muted-foreground text-xs">
                Créée le{" "}
                {new Date(mission.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
