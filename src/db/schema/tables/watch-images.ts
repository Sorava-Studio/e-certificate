// ============================================
// 🖼️ WATCH IMAGES TABLE
// ============================================
// Storage for watch verification photos in S3
// ============================================

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { imageTypeEnum } from "../enums/image-type";
import { user } from "./auth";
import { item } from "./items";

export const watchImage = pgTable("watch_image", {
  id: text("id").primaryKey(),
  itemId: text("item_id")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Image Type
  imageType: imageTypeEnum("image_type").notNull(),

  // S3 Storage
  s3Key: text("s3_key").notNull(),
  s3Url: text("s3_url").notNull(),
  thumbnailS3Key: text("thumbnail_s3_key"),
  thumbnailS3Url: text("thumbnail_s3_url"),

  // File Metadata
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  mimeType: text("mime_type").notNull(),
  width: integer("width"),
  height: integer("height"),

  // Order for display
  displayOrder: integer("display_order").notNull().default(0),

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
export type WatchImage = typeof watchImage.$inferSelect;
export type NewWatchImage = typeof watchImage.$inferInsert;
