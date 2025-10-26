"use client";

// ============================================
// 🎫 PHOTO UPLOADER
// ============================================
// Drag-and-drop photo upload with validation
// ============================================

import { AlertCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { validateFile } from "@/lib/certification-utils";
import { cn } from "@/lib/utils";

type PhotoUploaderProps = {
  label: string;
  helperText: string;
  minPhotos: number;
  maxPhotos: number;
  required: boolean;
  photos: File[];
  onPhotosChange: (files: File[]) => void;
  disabled?: boolean;
};

export function PhotoUploader({
  label,
  helperText,
  minPhotos,
  maxPhotos,
  required,
  photos,
  onPhotosChange,
  disabled = false,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || disabled) {
        return;
      }

      setError(null);
      const filesArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of filesArray) {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (errors.length > 0) {
        setError(errors.join(", "));
      }

      const totalFiles = photos.length + validFiles.length;
      if (totalFiles > maxPhotos) {
        setError(`Maximum ${maxPhotos} photos autorisées`);
        return;
      }

      if (validFiles.length > 0) {
        onPhotosChange([...photos, ...validFiles]);
      }
    },
    [photos, onPhotosChange, maxPhotos, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removePhoto = useCallback(
    (index: number) => {
      onPhotosChange(photos.filter((_, i) => i !== index));
      setError(null);
    },
    [photos, onPhotosChange]
  );

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const photoCount = photos.length;
  const isMinMet = photoCount >= minPhotos;
  const canAddMore = photoCount < maxPhotos;

  return (
    <div className="space-y-3">
      {/* Label */}
      <div>
        <p className="font-medium text-sm">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </p>
        <p className="text-muted-foreground text-xs">{helperText}</p>
        <p className="mt-1 text-muted-foreground text-xs">
          {photoCount} / {maxPhotos} photos{" "}
          {required && `(minimum ${minPhotos})`}
        </p>
      </div>

      {/* Drop Zone */}
      {canAddMore && (
        <button
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging && "border-primary bg-primary/5",
            !isDragging && "border-border hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
          disabled={disabled}
          onClick={openFileDialog}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          type="button"
        >
          <Upload className="mb-2 size-8 text-muted-foreground" />
          <p className="text-center font-medium text-sm">
            Glissez-déposez vos photos ici
          </p>
          <p className="text-center text-muted-foreground text-xs">
            ou cliquez pour parcourir
          </p>
          <p className="mt-2 text-center text-muted-foreground text-xs">
            JPEG, PNG, WebP • Max 10MB
          </p>
        </button>
      )}

      {/* Hidden File Input */}
      <input
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        multiple
        onChange={handleFileInputChange}
        ref={fileInputRef}
        type="file"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Photo Previews */}
      {photoCount > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <div className="group relative" key={`${photo.name}-${index}`}>
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                <Image
                  alt={`Preview ${index + 1}`}
                  className="object-cover"
                  fill
                  src={URL.createObjectURL(photo)}
                />
              </div>

              {/* Remove Button */}
              <Button
                className="-right-2 -top-2 absolute opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                disabled={disabled}
                onClick={() => removePhoto(index)}
                size="icon-sm"
                type="button"
                variant="destructive"
              >
                <X className="size-3" />
              </Button>

              {/* File Name */}
              <p className="mt-1 truncate text-center text-muted-foreground text-xs">
                {photo.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Validation Status */}
      {required && (
        <p
          className={cn(
            "text-xs",
            isMinMet ? "text-green-600" : "text-muted-foreground"
          )}
        >
          {isMinMet ? "✓" : "○"} {minPhotos} photo
          {minPhotos > 1 ? "s" : ""} minimum{isMinMet ? " atteint" : ""}
        </p>
      )}
    </div>
  );
}
