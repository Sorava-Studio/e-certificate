// ============================================
// 📊 DATABASE TABLES - DOCUMENTATION
// ============================================
// This file documents the available tables.
// Import directly from specific files to avoid barrel file performance issues.
// ============================================

// ============================================
// 📝 AVAILABLE TABLES
// ============================================
//
// - auth.ts: Authentication tables (user, session, account, verification)
//
// ============================================
// 📚 USAGE - IMPORT DIRECTLY FROM SOURCE FILES
// ============================================
//
// ✅ CORRECT - Import directly:
//   import { user, session } from '@/db/schema/tables/auth';
//   import type { User, Session } from '@/db/schema/tables/auth';
//
// ❌ AVOID - Don't use barrel imports:
//   import { user } from '@/db/schema/tables';
//
// ============================================
