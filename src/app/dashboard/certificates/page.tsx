// ============================================
// 📜 CERTIFICATES LIST PAGE
// ============================================
// Display all user certifications with filtering and search
// ============================================

import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import { CertificationButton } from "@/components/dashboard/certification/CertificationButton";
import { PaymentReturnHandler } from "@/components/dashboard/certification/PaymentReturnHandler";
import { db } from "@/db";
import { certification } from "@/db/schema/tables/certification";
import { requireAuth } from "@/lib/session";

const CENTS_PER_EURO = 100;

export default async function CertificatesPage() {
  const { user } = await requireAuth();

  // Fetch user's certifications
  const userCertifications = await db.query.certification.findMany({
    where: eq(certification.userId, user.id),
    with: {
      photos: {
        orderBy: (photos, { asc }) => [asc(photos.order)],
      },
    },
    orderBy: [desc(certification.createdAt)],
  });

  return (
    <div className="space-y-8">
      {/* Payment Return Handler */}
      <PaymentReturnHandler />
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Mes Certifications
          </h1>
          <p className="text-muted-foreground">
            Gérez et consultez vos certifications EMERA
          </p>
        </div>
        <CertificationButton />
      </div>{" "}
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-muted-foreground text-sm">Total</div>
          <div className="font-bold text-2xl">{userCertifications.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-muted-foreground text-sm">Actifs</div>
          <div className="font-bold text-2xl">
            {
              userCertifications.filter((cert) => cert.status === "certifie")
                .length
            }
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-muted-foreground text-sm">En attente</div>
          <div className="font-bold text-2xl">
            {
              userCertifications.filter((cert) => cert.status === "en_attente")
                .length
            }
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-muted-foreground text-sm">Valeur totale</div>
          <div className="font-bold text-2xl">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(
              userCertifications.reduce((sum, cert) => sum + cert.price, 0) /
                CENTS_PER_EURO
            )}
          </div>
        </div>
      </div>
      {/* Certificates Grid */}
      {userCertifications.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Plus className="size-6 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-lg">Aucune certification</h3>
          <p className="mt-2 mb-4 text-muted-foreground text-sm">
            Commencez par créer votre première certification EMERA
          </p>
          <CertificationButton />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userCertifications.map((cert) => (
            <CertificateCard certification={cert} key={cert.id} />
          ))}
        </div>
      )}
    </div>
  );
}
