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
const migrationClient = postgres(DATABASE_URL, { max: 1 });
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
    process.stderr.write(
      `❌ Migration failed: ${error}\n` +
        "Common causes:\n" +
        "  - Check that your DATABASE_URL is correct\n" +
        "  - Ensure PostgreSQL server is running\n" +
        "  - Verify network connectivity\n"
    );
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

runMigrations();
