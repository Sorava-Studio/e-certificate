// ============================================
// 🎫 CERTIFICATION QUERIES
// ============================================
// Type-safe database queries for certifications
// ============================================

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  certification,
  certificationPhoto,
} from "@/db/schema/tables/certification";

// ============================================
// Get Certification by ID
// ============================================
export async function getCertificationById(
  certificationId: string,
  userId: string
) {
  const result = await db.query.certification.findFirst({
    where: and(
      eq(certification.id, certificationId),
      eq(certification.userId, userId)
    ),
    with: {
      photos: {
        orderBy: [certificationPhoto.order],
      },
    },
  });

  return result;
}

// ============================================
// Get All User Certifications
// ============================================
export async function getUserCertifications(userId: string) {
  const results = await db.query.certification.findMany({
    where: eq(certification.userId, userId),
    with: {
      photos: {
        where: eq(certificationPhoto.category, "main"),
        orderBy: [certificationPhoto.order],
      },
    },
    orderBy: [desc(certification.createdAt)],
  });

  return results;
}

// ============================================
// Count User Certifications
// ============================================
export async function countUserCertifications(userId: string) {
  const result = await db
    .select({ count: count() })
    .from(certification)
    .where(eq(certification.userId, userId));

  return result[0]?.count || 0;
}

// ============================================
// Update Certification Status
// ============================================
export async function updateCertificationStatus(
  certificationId: string,
  status:
    | "enregistre"
    | "verifie"
    | "certifie"
    | "authentifie"
    | "refuse"
    | "en_attente"
) {
  const result = await db
    .update(certification)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(certification.id, certificationId))
    .returning();

  return result[0];
}

// ============================================
// Mark Certification as Paid
// ============================================
export async function markCertificationAsPaid(certificationId: string) {
  const result = await db
    .update(certification)
    .set({
      paidAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(certification.id, certificationId))
    .returning();

  return result[0];
}

// ============================================
// Update QR Code
// ============================================
export async function updateQRCode(certificationId: string, qrCode: string) {
  const result = await db
    .update(certification)
    .set({
      qrCode,
      updatedAt: new Date(),
    })
    .where(eq(certification.id, certificationId))
    .returning();

  return result[0];
}

// ============================================
// Update NFT Token (Imperium)
// ============================================
export async function updateNFTToken(
  certificationId: string,
  nftTokenId: string,
  threeDModelUrl?: string
) {
  const result = await db
    .update(certification)
    .set({
      nftTokenId,
      threeDModelUrl,
      updatedAt: new Date(),
    })
    .where(eq(certification.id, certificationId))
    .returning();

  return result[0];
}

// ============================================
// Get Certification by Certificate Number
// ============================================
export async function getCertificationByCertificateNumber(
  certificateNumber: string
) {
  const result = await db.query.certification.findFirst({
    where: eq(certification.certificateNumber, certificateNumber),
    with: {
      photos: {
        orderBy: [certificationPhoto.order],
      },
    },
  });

  return result;
}
