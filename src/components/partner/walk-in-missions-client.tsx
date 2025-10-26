"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateMissionStatus } from "@/app/actions/walk-in-client";
import { WalkInMissionsList } from "@/components/partner/walk-in-missions-list";
import type {
  WalkInClient,
  WalkInMission,
} from "@/db/schema/tables/walk-in-client";

type MissionWithClient = {
  mission: WalkInMission;
  client: WalkInClient;
};

type WalkInMissionsClientProps = {
  initialMissions: MissionWithClient[];
};

export function WalkInMissionsClient({
  initialMissions,
}: WalkInMissionsClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (missionId: string, status: string) => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateMissionStatus(
        missionId,
        status as "pending" | "in_progress" | "completed" | "cancelled"
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Mission démarrée avec succès");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    if (isUpdating) {
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateMissionStatus(missionId, "completed");

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Mission terminée avec succès");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <WalkInMissionsList
      missions={initialMissions}
      onCompleteMission={handleCompleteMission}
      onStatusChange={handleStatusChange}
    />
  );
}
