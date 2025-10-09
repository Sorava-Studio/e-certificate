// ============================================
// 🏷️ USER ROLE ENUM
// ============================================
// Defines the role types for users in the system
// ============================================

import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "partner", "admin"]);
