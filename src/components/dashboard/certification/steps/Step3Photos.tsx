"use client";

// ============================================
// 🎫 STEP 3: PHOTO UPLOAD
// ============================================
// Upload photos of the object
// ============================================

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CertificationFormData } from "@/types/certification";
import { PHOTO_SECTIONS } from "../constants";
import { PhotoUploader } from "../PhotoUploader";

type Step3PhotosProps = {
  photos: CertificationFormData["photos"];
  hasDocuments: boolean;
  hasAccessories: boolean;
  onPhotosChange: (
    category: keyof CertificationFormData["photos"],
    files: File[]
  ) => void;
};

export function Step3Photos({
  photos,
  hasDocuments,
  hasAccessories,
  onPhotosChange,
}: Step3PhotosProps) {
  const showAccessories = hasDocuments || hasAccessories;

  // Check completion status for each section
  const mainComplete =
    photos.main.length >= PHOTO_SECTIONS.main.minPhotos &&
    photos.main.length <= PHOTO_SECTIONS.main.maxPhotos;
  const fullComplete = photos.full.length >= PHOTO_SECTIONS.full.minPhotos;
  const possessionComplete =
    photos.possession.length >= PHOTO_SECTIONS.possession.minPhotos;
  const accessoriesComplete = showAccessories
    ? photos.accessories.length >= PHOTO_SECTIONS.accessories.minPhotos
    : true;

  const allComplete =
    mainComplete && fullComplete && possessionComplete && accessoriesComplete;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-2xl">Photos de l'objet</h2>
        <p className="text-muted-foreground">
          Téléchargez des photos claires et de bonne qualité
        </p>

        {/* Progress Summary */}
        <div className="mt-4 rounded-lg border bg-muted/50 p-4">
          <p className="mb-3 font-medium text-sm">Progression des photos</p>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="flex items-center gap-2">
              {mainComplete ? (
                <CheckCircle2 className="size-4 text-green-600" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm",
                  mainComplete ? "text-green-600" : "text-muted-foreground"
                )}
              >
                Photos principales ({photos.main.length}/
                {PHOTO_SECTIONS.main.minPhotos})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {fullComplete ? (
                <CheckCircle2 className="size-4 text-green-600" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm",
                  fullComplete ? "text-green-600" : "text-muted-foreground"
                )}
              >
                Vues complètes ({photos.full.length}/
                {PHOTO_SECTIONS.full.minPhotos})
              </span>
            </div>
            {showAccessories && (
              <div className="flex items-center gap-2">
                {accessoriesComplete ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <Circle className="size-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    accessoriesComplete
                      ? "text-green-600"
                      : "text-muted-foreground"
                  )}
                >
                  Accessoires ({photos.accessories.length}/
                  {PHOTO_SECTIONS.accessories.minPhotos})
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {possessionComplete ? (
                <CheckCircle2 className="size-4 text-green-600" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm",
                  possessionComplete
                    ? "text-green-600"
                    : "text-muted-foreground"
                )}
              >
                Preuve de possession ({photos.possession.length}/
                {PHOTO_SECTIONS.possession.minPhotos})
              </span>
            </div>
          </div>
          {allComplete && (
            <p className="mt-3 font-medium text-green-600 text-sm">
              ✓ Toutes les photos requises sont téléchargées
            </p>
          )}
        </div>
      </div>

      {/* Main Photos */}
      <PhotoUploader
        helperText={PHOTO_SECTIONS.main.helperText}
        label={PHOTO_SECTIONS.main.label}
        maxPhotos={PHOTO_SECTIONS.main.maxPhotos}
        minPhotos={PHOTO_SECTIONS.main.minPhotos}
        onPhotosChange={(files) => onPhotosChange("main", files)}
        photos={photos.main}
        required={PHOTO_SECTIONS.main.required}
      />

      {/* Full Views */}
      <PhotoUploader
        helperText={PHOTO_SECTIONS.full.helperText}
        label={PHOTO_SECTIONS.full.label}
        maxPhotos={PHOTO_SECTIONS.full.maxPhotos}
        minPhotos={PHOTO_SECTIONS.full.minPhotos}
        onPhotosChange={(files) => onPhotosChange("full", files)}
        photos={photos.full}
        required={PHOTO_SECTIONS.full.required}
      />

      {/* Accessories & Documents (conditional) */}
      {showAccessories && (
        <PhotoUploader
          helperText={PHOTO_SECTIONS.accessories.helperText}
          label={PHOTO_SECTIONS.accessories.label}
          maxPhotos={PHOTO_SECTIONS.accessories.maxPhotos}
          minPhotos={PHOTO_SECTIONS.accessories.minPhotos}
          onPhotosChange={(files) => onPhotosChange("accessories", files)}
          photos={photos.accessories}
          required={PHOTO_SECTIONS.accessories.required}
        />
      )}

      {/* Proof of Possession */}
      <PhotoUploader
        helperText={PHOTO_SECTIONS.possession.helperText}
        label={PHOTO_SECTIONS.possession.label}
        maxPhotos={PHOTO_SECTIONS.possession.maxPhotos}
        minPhotos={PHOTO_SECTIONS.possession.minPhotos}
        onPhotosChange={(files) => onPhotosChange("possession", files)}
        photos={photos.possession}
        required={PHOTO_SECTIONS.possession.required}
      />
    </div>
  );
}
