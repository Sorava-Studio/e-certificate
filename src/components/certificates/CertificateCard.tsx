// ============================================
// 🎫 CERTIFICATE CARD
// ============================================
// Display certificate preview card
// ============================================

"use client";

import type { InferSelectModel } from "drizzle-orm";
import { Download, Eye, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { certification as certificationSchema } from "@/db/schema/tables/certification";
import { formatPrice, getStatusLabel } from "@/lib/certification-utils";

type CertificateCardProps = {
  certification: InferSelectModel<typeof certificationSchema> & {
    photos?: Array<{ url: string; category: string; order: number }>;
  };
};

const STATUS_COLORS: Record<string, string> = {
  enregistre: "bg-gray-500",
  en_attente: "bg-yellow-500",
  verifie: "bg-blue-500",
  certifie: "bg-green-500",
  authentifie: "bg-purple-500",
  refuse: "bg-red-500",
};

const SERVICE_TIER_COLORS: Record<string, string> = {
  initium: "border-blue-500",
  visus: "border-amber-500",
  custodia: "border-green-500",
  imperium: "border-purple-500",
};

export function CertificateCard({ certification }: CertificateCardProps) {
  const mainPhoto = certification.photos?.find(
    (photo) => photo.category === "main"
  );
  const statusColor = STATUS_COLORS[certification.status] || "bg-gray-500";
  const tierColor =
    SERVICE_TIER_COLORS[certification.serviceType] || "border-gray-500";

  return (
    <Card className={`overflow-hidden border-t-4 ${tierColor}`}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {mainPhoto ? (
            <Image
              alt={`${certification.brand} ${certification.model}`}
              className="object-cover"
              fill
              src={mainPhoto.url}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <span className="text-sm">Aucune photo</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={statusColor}>
              {getStatusLabel(certification.status)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          <div>
            <div className="font-mono text-muted-foreground text-xs">
              {certification.certificateNumber}
            </div>
            <h3 className="font-semibold text-lg">
              {certification.brand} {certification.model}
            </h3>
            {certification.reference && (
              <p className="text-muted-foreground text-sm">
                Réf: {certification.reference}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">Prix déclaré</div>
            <div className="font-semibold">
              {formatPrice(certification.price)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">Service</div>
            <div className="font-medium text-sm capitalize">
              {certification.serviceType}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">Créé le</div>
            <div className="text-sm">
              {new Date(certification.createdAt).toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t bg-muted/50 p-3">
        <Button asChild className="flex-1" size="sm" variant="outline">
          <Link href={`/dashboard/certificates/${certification.id}`}>
            <Eye className="mr-2 size-4" />
            Voir
          </Link>
        </Button>
        <Button size="sm" variant="outline">
          <Share2 className="size-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Download className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
