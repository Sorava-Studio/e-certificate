// ============================================
// 🗄️ DATABASE SCHEMA - DOCUMENTATION
// ============================================
// This file documents the schema organization.
// Import directly from specific files to avoid barrel file performance issues.
// ============================================

// ============================================
// 📝 SCHEMA ORGANIZATION
// ============================================
//
// Structure:
//   src/db/schema/
//     ├── index.ts           (this file - documentation only)
//     ├── tables/
//     │   ├── users.ts       (user table)
//     │   ├── certificates.ts (certificate table)
//     │   └── ...
//     └── enums/
//         ├── userRoles.ts   (user role enum)
//         ├── status.ts      (status enum)
//         └── ...
//
// ============================================
// 📚 USAGE - IMPORT DIRECTLY FROM SOURCE FILES
// ============================================
//
// ✅ CORRECT - Import directly from specific files:
//
//   // Import a specific table
//   import { users } from '@/db/schema/tables/users';
//   import type { User, NewUser } from '@/db/schema/tables/users';
//
//   // Import a specific enum
//   import { userRoleEnum } from '@/db/schema/enums/userRoles';
//
//   // Use in your code
//   const allUsers = await db.select().from(users);
//
// ❌ AVOID - Don't use barrel file imports (performance anti-pattern):
//   import { users } from '@/db/schema';  // Slower, loads unused modules
//
// ============================================
