// ============================================
// 🏷️ MISSION STATUS ENUM
// ============================================
// Defines the status types for partner missions
// ============================================

import { pgEnum } from "drizzle-orm/pg-core";

export const missionStatusEnum = pgEnum("mission_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);
