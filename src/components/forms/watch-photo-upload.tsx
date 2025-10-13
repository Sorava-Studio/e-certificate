// ============================================
// 📸 WATCH PHOTO UPLOAD COMPONENT
// ============================================
// Drag-and-drop photo upload for watch verification
// ============================================

"use client";

import { AlertCircle, Check, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  IMAGE_TYPE_DESCRIPTIONS,
  IMAGE_TYPE_LABELS,
  IMAGE_TYPES,
  type WatchImageType,
} from "@/validations/item";

// ============================================
// Types
// ============================================

type UploadedImage = {
  id: string;
  file: File;
  preview: string;
  imageType: WatchImageType;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
};

type WatchPhotoUploadProps = {
  itemId?: string;
  onUploadComplete?: (images: UploadedImage[]) => void;
  existingImages?: UploadedImage[];
};

// ============================================
// Constants
// ============================================

const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * KB_PER_MB * BYTES_PER_KB; // 5MB
const MIN_IMAGES = 3;
const MAX_IMAGES = 10;
const DECIMAL_PLACES = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/heic"];

// ============================================
// Component
// ============================================

export function WatchPhotoUpload({
  itemId,
  onUploadComplete,
  existingImages = [],
}: WatchPhotoUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // File Validation
  // ============================================

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, and HEIC files are accepted";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }

    return null;
  }, []);

  // ============================================
  // File Handling
  // ============================================

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      setError(null);

      // Check total count
      if (images.length + fileArray.length > MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} images allowed`);
        return;
      }

      // Process each file
      const newImages: UploadedImage[] = [];

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        const preview = URL.createObjectURL(file);
        newImages.push({
          id: crypto.randomUUID(),
          file,
          preview,
          imageType: "other", // Default type
        });
      }

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length, validateFile]
  );

  // ============================================
  // Drag and Drop
  // ============================================

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files?.length) {
      handleFiles(files);
    }
  };

  // ============================================
  // File Input
  // ============================================

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files?.length) {
      handleFiles(files);
    }
  };

  // ============================================
  // Image Management
  // ============================================

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const updateImageType = (id: string, imageType: WatchImageType) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, imageType } : img))
    );
  };

  // ============================================
  // Upload
  // ============================================

  const uploadImage = async (image: UploadedImage) => {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const formData = new FormData();
    formData.append("file", image.file);
    formData.append("itemId", itemId);
    formData.append("imageType", image.imageType);

    const response = await fetch("/api/upload/watch-images", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Upload failed");
    }
  };

  const uploadImages = async () => {
    if (!itemId) {
      setError("Item ID is required");
      return;
    }

    // Clear previous errors
    setError(null);

    // Check minimum after user tries to upload
    const imagesToUpload = images.filter((img) => !img.uploaded);
    const totalAfterUpload =
      images.filter((img) => img.uploaded).length + imagesToUpload.length;

    if (totalAfterUpload < MIN_IMAGES) {
      setError(`Please select at least ${MIN_IMAGES} images before uploading`);
      return;
    }

    // Upload each image
    for (const image of imagesToUpload) {
      // Set uploading state
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, uploading: true, error: undefined }
            : img
        )
      );

      try {
        await uploadImage(image);

        // Mark as uploaded
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, uploading: false, uploaded: true }
              : img
          )
        );
      } catch (uploadError) {
        // Set error state
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  uploading: false,
                  error:
                    uploadError instanceof Error
                      ? uploadError.message
                      : "Upload failed",
                }
              : img
          )
        );

        // Don't continue if there's an error
        setError("Some images failed to upload. Please try again.");
        return;
      }
    }

    // Call completion callback only if all images uploaded successfully
    if (onUploadComplete && images.every((img) => img.uploaded)) {
      onUploadComplete(images);
    }
  };

  // ============================================
  // Render
  // ============================================

  const canUpload = images.length >= MIN_IMAGES && images.length <= MAX_IMAGES;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          images.length >= MAX_IMAGES && "pointer-events-none opacity-50"
        )}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Upload Watch Photos</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop or click to browse
            </p>
          </div>
          <input
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            disabled={images.length >= MAX_IMAGES}
            id="file-upload"
            multiple
            onChange={handleFileInput}
            type="file"
          />
          <Button
            disabled={images.length >= MAX_IMAGES}
            onClick={() => document.getElementById("file-upload")?.click()}
            type="button"
            variant="outline"
          >
            Choose Files
          </Button>
          <div className="text-muted-foreground text-xs">
            <p>JPG, PNG, or HEIC • Max 5MB per file</p>
            <p>
              {MIN_IMAGES}-{MAX_IMAGES} images required
            </p>
          </div>
        </div>
      </Card>

      {/* Requirements */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p className="mb-2 font-semibold">Required Photos:</p>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Front dial (clear view of the watch face)</li>
            <li>Case back with serial number (clearly visible)</li>
            <li>Movement (if accessible)</li>
            <li>Any unique features or imperfections</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold">
                Selected Images ({images.length}/{MAX_IMAGES})
              </h4>
              <p className="text-muted-foreground text-xs">
                {images.filter((img) => img.uploaded).length} uploaded
                {images.length < MIN_IMAGES && (
                  <span className="text-amber-600">
                    {" "}
                    • {MIN_IMAGES - images.length} more needed
                  </span>
                )}
              </p>
            </div>
            {itemId && (
              <Button
                disabled={!canUpload || images.every((img) => img.uploaded)}
                onClick={uploadImages}
              >
                Upload All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {images.map((image) => (
              <Card className="p-4" key={image.id}>
                <div className="flex gap-4">
                  {/* Preview */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      alt="Watch preview"
                      className="h-full w-full object-cover"
                      height={96}
                      src={image.preview}
                      width={96}
                    />
                    {image.uploaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="truncate font-medium text-sm">
                          {image.file.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {(image.file.size / KB_PER_MB / BYTES_PER_KB).toFixed(
                            DECIMAL_PLACES
                          )}{" "}
                          MB
                        </p>
                      </div>
                      <Button
                        className="-mr-1 -mt-1 h-6 w-6"
                        disabled={image.uploading}
                        onClick={() => removeImage(image.id)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Image Type Selector */}
                    <Select
                      disabled={image.uploading || image.uploaded}
                      onValueChange={(value) =>
                        updateImageType(image.id, value as WatchImageType)
                      }
                      value={image.imageType}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div>
                              <p className="font-medium">
                                {IMAGE_TYPE_LABELS[type]}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {IMAGE_TYPE_DESCRIPTIONS[type]}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Status */}
                    {image.uploading && (
                      <p className="text-muted-foreground text-xs">
                        Uploading...
                      </p>
                    )}
                    {image.uploaded && (
                      <p className="text-green-600 text-xs">Uploaded</p>
                    )}
                    {image.error && (
                      <p className="text-destructive text-xs">{image.error}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
