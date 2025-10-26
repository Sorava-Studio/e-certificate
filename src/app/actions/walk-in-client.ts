"use server";

import { eq } from "drizzle-orm";
import type { ServiceTierId } from "@/config/pricing";
import { SERVICE_PRICES } from "@/config/pricing";
import { db } from "@/db";
import { walkInClient, walkInMission } from "@/db/schema/tables/walk-in-client";
import { getCurrentUser } from "@/lib/session";

type PaymentMethod = "cash" | "card_shop" | "stripe";

// ============================================
// CREATE WALK-IN CLIENT
// ============================================
export async function createWalkInClient(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  serviceId: ServiceTierId;
  paymentMethod: PaymentMethod;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (user.role !== "partner" && user.role !== "admin") {
    return {
      error: "Access denied. Only partners can create walk-in clients.",
    };
  }

  try {
    const { serviceId, paymentMethod, ...clientData } = data;

    // Create the walk-in client
    const [client] = await db
      .insert(walkInClient)
      .values({
        ...clientData,
        partnerId: user.id,
      })
      .returning();

    // Get the price for the selected service
    const amountPaid = SERVICE_PRICES[serviceId];

    // Determine payment status based on method
    const paymentStatus = paymentMethod === "stripe" ? "pending" : "paid";

    // Create the initial mission for this client
    const [mission] = await db
      .insert(walkInMission)
      .values({
        clientId: client.id,
        partnerId: user.id,
        status: "pending",
        serviceTier: serviceId,
        paymentMethod,
        paymentStatus,
        amountPaid,
      })
      .returning();

    return { success: true, client, mission };
  } catch {
    return { error: "Failed to create walk-in client" };
  }
}

// ============================================
// GET WALK-IN MISSIONS FOR CURRENT PARTNER
// ============================================
export async function getWalkInMissions() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (user.role !== "partner" && user.role !== "admin") {
    return { error: "Access denied" };
  }

  try {
    const missions = await db
      .select({
        mission: walkInMission,
        client: walkInClient,
      })
      .from(walkInMission)
      .innerJoin(walkInClient, eq(walkInMission.clientId, walkInClient.id))
      .where(eq(walkInMission.partnerId, user.id))
      .orderBy(walkInMission.createdAt);

    return { success: true, missions };
  } catch {
    return { error: "Failed to fetch missions" };
  }
}

// ============================================
// UPDATE MISSION STATUS
// ============================================
export async function updateMissionStatus(
  missionId: string,
  status: "pending" | "in_progress" | "completed" | "cancelled"
) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (user.role !== "partner" && user.role !== "admin") {
    return { error: "Access denied" };
  }

  try {
    const [mission] = await db
      .update(walkInMission)
      .set({
        status,
        completedAt: status === "completed" ? new Date() : undefined,
      })
      .where(eq(walkInMission.id, missionId))
      .returning();

    return { success: true, mission };
  } catch {
    return { error: "Failed to update mission status" };
  }
}
