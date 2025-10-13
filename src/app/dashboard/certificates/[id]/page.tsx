// ============================================
// 📜 CERTIFICATE DETAIL PAGE
// ============================================
// Display full certificate details with QR code and timeline
// ============================================

import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CertificateDetail } from "@/components/certificates/CertificateDetail";
import { db } from "@/db";
import { certification } from "@/db/schema/tables/certification";
import { requireAuth } from "@/lib/session";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CertificateDetailPage({ params }: PageProps) {
  const { user } = await requireAuth();
  const { id } = await params;

  // Fetch certification with photos
  const cert = await db.query.certification.findFirst({
    where: and(eq(certification.id, id), eq(certification.userId, user.id)),
    with: {
      photos: {
        orderBy: (photos, { asc }) => [asc(photos.order)],
      },
    },
  });

  if (!cert) {
    notFound();
  }

  return <CertificateDetail certification={cert} />;
}
