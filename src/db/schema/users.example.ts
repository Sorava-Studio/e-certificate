// ============================================
// 👤 USER SCHEMA
// ============================================
// Example schema - Replace with your actual schema
// Docs: https://orm.drizzle.team/docs/sql-schema-declaration
// ============================================

import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

// ============================================
// Users Table
// ============================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Type Exports
// ============================================
// Use these types in your application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ============================================
// 📝 USAGE EXAMPLES
// ============================================
//
// Import in your API routes or server components:
//   import { db } from '@/db';
//   import { users, type User, type NewUser } from '@/db/schema/users';
//   import { eq } from 'drizzle-orm';
//
// Get all users:
//   const allUsers: User[] = await db.select().from(users);
//
// Get user by ID:
//   const user = await db.select().from(users).where(eq(users.id, 1));
//
// Create user:
//   const newUser: NewUser = { name: 'John Doe', email: 'john@example.com' };
//   await db.insert(users).values(newUser);
//
// Update user:
//   await db.update(users)
//     .set({ name: 'Jane Doe' })
//     .where(eq(users.id, 1));
//
// Delete user:
//   await db.delete(users).where(eq(users.id, 1));
//
// ============================================
