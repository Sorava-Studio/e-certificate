// ============================================
// 🚶 WALK-IN CLIENT TABLES
// ============================================
// Tables for managing walk-in clients and their missions
// ============================================

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { missionStatusEnum } from "../enums/mission-status";
import { user } from "./auth";

// ============================================
// Walk-in Client Table
// ============================================
export const walkInClient = pgTable("walk_in_client", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
  partnerId: text("partner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// ============================================
// Walk-in Mission Table
// ============================================
export const walkInMission = pgTable("walk_in_mission", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id")
    .notNull()
    .references(() => walkInClient.id, { onDelete: "cascade" }),
  partnerId: text("partner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: missionStatusEnum("status").default("pending").notNull(),
  serviceTier: text("service_tier"), // 'custodia' or 'imperium'
  paymentMethod: text("payment_method"), // 'cash', 'card_shop', or 'stripe'
  paymentStatus: text("payment_status").default("pending"), // 'pending', 'paid', 'failed'
  amountPaid: integer("amount_paid"), // Amount in cents
  notes: text("notes"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
  completedAt: timestamp("completed_at"),
});

// ============================================
// TypeScript Types
// ============================================
export type WalkInClient = typeof walkInClient.$inferSelect;
export type NewWalkInClient = typeof walkInClient.$inferInsert;

export type WalkInMission = typeof walkInMission.$inferSelect;
export type NewWalkInMission = typeof walkInMission.$inferInsert;
