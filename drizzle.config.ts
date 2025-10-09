// ============================================
// 🗄️ DRIZZLE ORM CONFIGURATION
// ============================================
// Configuration for Drizzle Kit (migrations & introspection)
// Docs: https://orm.drizzle.team/kit-docs/config-reference
// ============================================

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Database dialect
  dialect: "postgresql",

  // Database connection
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/ecertificate",
  },

  // Schema files location
  schema: "./src/db/schema/**/*",

  // Migrations output directory
  out: "./src/db/migrations",

  // Enable verbose logging
  verbose: true,

  // Enable strict mode (recommended)
  strict: true,

  // Table name configuration
  tablesFilter: ["*"], // Include all tables

  // Schema name (if using PostgreSQL schemas)
  // schemaFilter: ["public"],
});
