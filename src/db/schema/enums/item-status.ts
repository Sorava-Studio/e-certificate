// ============================================
// 🎯 ITEM STATUS ENUM
// ============================================
// Status values for item registration and verification
// ============================================

import { pgEnum } from "drizzle-orm/pg-core";

export const itemStatusEnum = pgEnum("item_status", [
  "draft",
  "pending_verification",
  "verified",
  "flagged",
]);

export type ItemStatus = (typeof itemStatusEnum.enumValues)[number];
