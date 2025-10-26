// ============================================
// 🎫 CERTIFICATION COUNT API
// ============================================
// Count user's certifications for Imperium eligibility
// ============================================

import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { certification } from "@/db/schema/tables/certification";
import { auth } from "@/lib/auth";

// ============================================
// GET /api/certifications/count
// ============================================
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const IMPERIUM_REQUIREMENT = 5;

    const [result] = await db
      .select({ count: count() })
      .from(certification)
      .where(eq(certification.userId, session.user.id));

    const certCount = result?.count || 0;

    return NextResponse.json({
      count: certCount,
      imperiumEligible: certCount >= IMPERIUM_REQUIREMENT,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to count certifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
