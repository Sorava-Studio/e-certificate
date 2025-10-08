// ============================================
// 🚀 DATABASE MIGRATION RUNNER
// ============================================
// Run migrations programmatically
// Usage: bun run src/db/migrate.ts
// ============================================

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// ============================================
// Configuration
// ============================================
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL is not defined. Please set it in your .env.local file."
  );
}

// ============================================
// Migration Client
// ============================================
// Use a dedicated connection for migrations
const migrationClient = postgres(DATABASE_URL, {
  max: 1, // Single connection for migrations
});

const db = drizzle(migrationClient);

// ============================================
// Run Migrations
// ============================================
async function runMigrations() {
  process.stdout.write("⏳ Running database migrations...\n");

  try {
    await migrate(db, {
      migrationsFolder: "./src/db/migrations",
    });

    process.stdout.write("✅ Migrations completed successfully!\n");
  } catch (error) {
    process.stderr.write(`❌ Migration failed: ${error}\n`);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

// Run migrations
runMigrations();
