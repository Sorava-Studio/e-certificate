// ============================================
// 🖼️ IMAGE TYPE ENUM
// ============================================
// Image type for watch verification photos
// ============================================

import { pgEnum } from "drizzle-orm/pg-core";

export const imageTypeEnum = pgEnum("image_type", [
  "front_dial",
  "case_back",
  "movement",
  "unique_features",
  "imperfections",
  "other",
]);
