// ============================================
// 📦 ITEM TYPE ENUM
// ============================================
// Types of luxury items that can be certified
// ============================================

import { pgEnum } from "drizzle-orm/pg-core";

export const itemTypeEnum = pgEnum("item_type", ["watch", "jewelry", "other"]);

export type ItemType = (typeof itemTypeEnum.enumValues)[number];
