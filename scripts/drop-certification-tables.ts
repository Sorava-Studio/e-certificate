// ============================================
// 🗄️ DROP CERTIFICATION TABLES
// ============================================
// Clean up existing tables to allow enum recreation
// ============================================

import postgres from "postgres";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/ecertificate";

const sql = postgres(DATABASE_URL);

async function dropTables() {
  try {
    console.log("🗑️  Dropping certification tables...");

    await sql`
			DROP TABLE IF EXISTS inspection_report CASCADE;
		`;
    console.log("✅ Dropped inspection_report");

    await sql`
			DROP TABLE IF EXISTS certification_photo CASCADE;
		`;
    console.log("✅ Dropped certification_photo");

    await sql`
			DROP TABLE IF EXISTS certification CASCADE;
		`;
    console.log("✅ Dropped certification");

    // Drop old enums if they exist
    await sql`
			DROP TYPE IF EXISTS certification_status CASCADE;
		`;
    await sql`
			DROP TYPE IF EXISTS object_type CASCADE;
		`;
    await sql`
			DROP TYPE IF EXISTS service_type CASCADE;
		`;
    await sql`
			DROP TYPE IF EXISTS photo_category CASCADE;
		`;
    await sql`
			DROP TYPE IF EXISTS inspection_result CASCADE;
		`;
    console.log("✅ Dropped old enums");

    console.log("\n✨ Tables dropped successfully!");
    console.log("Now run: bun db:push");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

dropTables();
