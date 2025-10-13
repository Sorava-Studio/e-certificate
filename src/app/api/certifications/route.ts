// ============================================
// 🎫 CERTIFICATION API - Main Routes
// ============================================
// Create and retrieve certifications
// ============================================

import { eq as drizzleEq } from "drizzle-orm";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  certification,
  certificationPhoto,
} from "@/db/schema/tables/certification";
import { auth } from "@/lib/auth";
import { generateCertificateNumber } from "@/lib/certification-utils";

// ============================================
// POST /api/certifications - Create Certification
// ============================================
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      objectType,
      brand,
      model,
      reference,
      price,
      hasDocuments,
      hasAccessories,
      notes,
      serviceType,
      options,
      photoUrls, // Already uploaded photos
      pricing,
    } = body;

    const CENTS_PER_EURO = 100;
    const MAX_ATTEMPTS = 5;

    // Generate unique certificate number
    let certificateNumber = generateCertificateNumber();
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      const existing = await db
        .select()
        .from(certification)
        .where(drizzleEq(certification.certificateNumber, certificateNumber))
        .limit(1);

      if (existing.length === 0) {
        break;
      }

      certificateNumber = generateCertificateNumber();
      attempts++;
    }

    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Failed to generate unique certificate number" },
        { status: 500 }
      );
    }

    // Insert certification
    const [newCertification] = await db
      .insert(certification)
      .values({
        userId: session.user.id,
        certificateNumber,
        objectType,
        brand,
        model,
        reference,
        price: Math.round(price * CENTS_PER_EURO), // Convert to cents
        hasDocuments: !!hasDocuments,
        hasAccessories: !!hasAccessories,
        notes,
        serviceType,
        options: options || {},
        basePrice: pricing.basePrice,
        additionalFees: pricing.additionalFees,
        totalPrice: pricing.totalPrice,
        status: "enregistre",
      })
      .returning();

    // Insert photos if provided
    if (photoUrls && newCertification) {
      const photoInserts = Object.entries(photoUrls).flatMap(
        ([category, urls]) =>
          (urls as string[]).map((url, index) => ({
            certificationId: newCertification.id,
            category: category as
              | "main"
              | "full"
              | "accessories"
              | "possession"
              | "professional",
            url,
            order: index,
          }))
      );

      if (photoInserts.length > 0) {
        await db.insert(certificationPhoto).values(photoInserts);
      }
    }

    return NextResponse.json({
      success: true,
      certificateNumber: newCertification.certificateNumber,
      certificationId: newCertification.id,
      status: newCertification.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create certification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/certifications - Get User's Certifications
// ============================================
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCertifications = await db.query.certification.findMany({
      where: (certs, { eq }) => eq(certs.userId, session.user.id),
      with: {
        photos: {
          orderBy: (photos, { asc }) => [asc(photos.order)],
        },
      },
      orderBy: (certs, { desc }) => [desc(certs.createdAt)],
    });

    return NextResponse.json({ certifications: userCertifications });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch certifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
