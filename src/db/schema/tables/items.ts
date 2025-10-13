// ============================================
// 📦 ITEMS TABLE
// ============================================
// Luxury items (watches, jewelry, etc.) registration and certificate data
// ============================================

import {
  date,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { itemStatusEnum } from "../enums/item-status";
import { itemTypeEnum } from "../enums/item-type";
import { user } from "./auth";

export const item = pgTable("item", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Item Type
  type: itemTypeEnum("type").notNull(),

  // Item Details
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  referenceNumber: text("reference_number").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  yearManufactured: integer("year_manufactured").notNull(),

  // Purchase Information
  purchaseDate: date("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),

  // Status
  status: itemStatusEnum("status").default("draft").notNull(),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// TypeScript Types
// ============================================
export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;
