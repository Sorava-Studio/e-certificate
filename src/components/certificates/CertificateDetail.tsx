// ============================================
// 🎫 CERTIFICATE DETAIL
// ============================================
// Full certificate view with all information
// ============================================

"use client";

import type { InferSelectModel } from "drizzle-orm";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Package,
  QrCode,
  Share2,
  Shield,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { certification as certificationSchema } from "@/db/schema/tables/certification";
import { formatPrice, getStatusLabel } from "@/lib/certification-utils";

type CertificateDetailProps = {
  certification: InferSelectModel<typeof certificationSchema> & {
    photos?: Array<{
      url: string;
      category: string;
      order: number;
      thumbnailUrl?: string | null;
    }>;
  };
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  enregistre: <Clock className="size-4" />,
  en_attente: <AlertCircle className="size-4" />,
  verifie: <CheckCircle2 className="size-4" />,
  certifie: <CheckCircle2 className="size-4" />,
  authentifie: <Shield className="size-4" />,
  refuse: <XCircle className="size-4" />,
};

const STATUS_COLORS: Record<string, string> = {
  enregistre: "bg-gray-500",
  en_attente: "bg-yellow-500",
  verifie: "bg-blue-500",
  certifie: "bg-green-500",
  authentifie: "bg-purple-500",
  refuse: "bg-red-500",
};

export function CertificateDetail({ certification }: CertificateDetailProps) {
  const mainPhotos = certification.photos?.filter(
    (photo) => photo.category === "main"
  );
  const fullPhotos = certification.photos?.filter(
    (photo) => photo.category === "full"
  );
  const accessoryPhotos = certification.photos?.filter(
    (photo) => photo.category === "accessories"
  );

  const statusColor = STATUS_COLORS[certification.status] || "bg-gray-500";
  const statusIcon = STATUS_ICONS[certification.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              className="text-muted-foreground text-sm hover:underline"
              href="/dashboard/certificates"
            >
              ← Retour aux certifications
            </Link>
          </div>
          <h1 className="font-bold text-3xl tracking-tight">
            {certification.brand} {certification.model}
          </h1>
          <p className="font-mono text-muted-foreground">
            {certification.certificateNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Télécharger PDF
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 size-4" />
            Partager
          </Button>
          <Button variant="outline">
            <QrCode className="mr-2 size-4" />
            QR Code
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <Badge className={`${statusColor} flex items-center gap-1 px-3 py-1`}>
          {statusIcon}
          {getStatusLabel(certification.status)}
        </Badge>
        <Badge className="capitalize" variant="outline">
          {certification.serviceType}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Photos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Photos */}
              {mainPhotos && mainPhotos.length > 0 && (
                <div>
                  <h3 className="mb-3 font-medium text-sm">
                    Photos principales
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mainPhotos.map((photo) => (
                      <div
                        className="relative aspect-square overflow-hidden rounded-lg border"
                        key={photo.url}
                      >
                        <Image
                          alt="Photo principale"
                          className="object-cover"
                          fill
                          src={photo.url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Photos */}
              {fullPhotos && fullPhotos.length > 0 && (
                <div>
                  <h3 className="mb-3 font-medium text-sm">Photos complètes</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {fullPhotos.map((photo) => (
                      <div
                        className="relative aspect-square overflow-hidden rounded-lg border"
                        key={photo.url}
                      >
                        <Image
                          alt="Photo complète"
                          className="object-cover"
                          fill
                          src={photo.url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessory Photos */}
              {accessoryPhotos && accessoryPhotos.length > 0 && (
                <div>
                  <h3 className="mb-3 font-medium text-sm">
                    Accessoires et documents
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {accessoryPhotos.map((photo) => (
                      <div
                        className="relative aspect-square overflow-hidden rounded-lg border"
                        key={photo.url}
                      >
                        <Image
                          alt="Accessoire"
                          className="object-cover"
                          fill
                          src={photo.url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-4" />
                Détails du produit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-muted-foreground text-sm">Marque</div>
                <div className="font-medium">{certification.brand}</div>
              </div>
              <Separator />
              <div>
                <div className="text-muted-foreground text-sm">Modèle</div>
                <div className="font-medium">{certification.model}</div>
              </div>
              {certification.reference && (
                <>
                  <Separator />
                  <div>
                    <div className="text-muted-foreground text-sm">
                      Référence
                    </div>
                    <div className="font-medium">{certification.reference}</div>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <div className="text-muted-foreground text-sm">
                  Prix déclaré
                </div>
                <div className="font-semibold text-lg">
                  {formatPrice(certification.price)}
                </div>
              </div>
              <Separator />
              <div>
                <div className="mb-2 text-muted-foreground text-sm">
                  Inclusions
                </div>
                <div className="flex flex-wrap gap-2">
                  {certification.hasDocuments && (
                    <Badge variant="secondary">
                      <FileText className="mr-1 size-3" />
                      Documents
                    </Badge>
                  )}
                  {certification.hasAccessories && (
                    <Badge variant="secondary">
                      <Package className="mr-1 size-3" />
                      Accessoires
                    </Badge>
                  )}
                </div>
              </div>
              {certification.notes && (
                <>
                  <Separator />
                  <div>
                    <div className="text-muted-foreground text-sm">Notes</div>
                    <div className="text-sm">{certification.notes}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  Service {certification.serviceType}
                </span>
                <span className="font-medium">
                  {formatPrice(certification.basePrice)}
                </span>
              </div>
              {certification.additionalFees > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Options supplémentaires
                  </span>
                  <span className="font-medium">
                    {formatPrice(certification.additionalFees)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg text-primary">
                  {formatPrice(certification.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="h-full w-px bg-border" />
                </div>
                <div className="pb-4">
                  <div className="font-medium text-sm">Créé</div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(certification.createdAt).toLocaleString("fr-FR")}
                  </div>
                </div>
              </div>

              {certification.paidAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <div className="font-medium text-sm">Payé</div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(certification.paidAt).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>
              )}

              {certification.identityVerifiedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <div className="font-medium text-sm">Identité vérifiée</div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(
                        certification.identityVerifiedAt
                      ).toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>
              )}

              {certification.inspectedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                      <Shield className="size-4" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <div className="font-medium text-sm">Inspecté</div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(certification.inspectedAt).toLocaleString(
                        "fr-FR"
                      )}
                    </div>
                  </div>
                </div>
              )}

              {certification.completedAt && (
                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="pb-4">
                    <div className="font-medium text-sm">Complété</div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(certification.completedAt).toLocaleString(
                        "fr-FR"
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
