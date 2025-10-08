// ============================================
// 🗄️ DATABASE CONNECTION
// ============================================
// Drizzle ORM with Postgres.js driver
// Docs: https://orm.drizzle.team/docs/get-started-postgresql#postgresjs
// ============================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// ============================================
// Environment Variables
// ============================================
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_LOGGING = process.env.DATABASE_LOGGING === "true";

if (!DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL is not defined. Please set it in your .env.local file."
  );
}

// ============================================
// Postgres.js Client Configuration
// ============================================
// Connection pooling and configuration
// Docs: https://github.com/porsager/postgres
const queryClient = postgres(DATABASE_URL, {
  max: 10, // Maximum number of connections in pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  // SSL configuration (uncomment for production)
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ============================================
// Drizzle ORM Instance
// ============================================
export const db = drizzle(queryClient, {
  logger: DATABASE_LOGGING,
});

// Export the client for advanced use cases
export { queryClient };

// ============================================
// 📝 USAGE EXAMPLES
// ============================================
//
// Basic Query:
//   import { db } from '@/db';
//   import { users } from '@/db/schema/users';
//   const allUsers = await db.select().from(users);
//
// With Conditions:
//   import { eq } from 'drizzle-orm';
//   import { db } from '@/db';
//   import { users } from '@/db/schema/users';
//   const user = await db.select().from(users).where(eq(users.id, 1));
//
// Insert:
//   import { users } from '@/db/schema/users';
//   await db.insert(users).values({ name: 'John', email: 'john@example.com' });
//
// Update:
//   await db.update(users).set({ name: 'Jane' }).where(eq(users.id, 1));
//
// Delete:
//   await db.delete(users).where(eq(users.id, 1));
//
// Transaction:
//   import { posts } from '@/db/schema/posts';
//   await db.transaction(async (tx) => {
//     await tx.insert(users).values({ name: 'Alice' });
//     await tx.insert(posts).values({ title: 'Hello' });
//   });
//
// ============================================
