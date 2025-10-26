// ============================================
// 🗄️ DATABASE CONNECTION
// ============================================
// Drizzle ORM with Postgres.js driver
// Docs: https://orm.drizzle.team/docs/get-started-postgresql#postgresjs
// ============================================

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { account, session, user, verification } from "./schema/tables/auth";
import {
  certification,
  certificationPhoto,
  certificationPhotoRelations,
  certificationRelations,
  inspectionReport,
  inspectionReportRelations,
} from "./schema/tables/certification";
import { certificationReport } from "./schema/tables/certification-report";

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
const queryClient = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// ============================================
// Drizzle ORM Instance
// ============================================
export const db = drizzle(queryClient, {
  schema: {
    user,
    session,
    account,
    verification,
    certification,
    certificationPhoto,
    certificationRelations,
    certificationPhotoRelations,
    inspectionReport,
    inspectionReportRelations,
    certificationReport,
  },
  logger: DATABASE_LOGGING,
});

export { queryClient };
