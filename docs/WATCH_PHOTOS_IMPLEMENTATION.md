# 📸 Watch Photo Upload Implementation Guide

## Overview

This guide covers the complete implementation of watch photo uploads using **local file storage** with automatic thumbnail generation. Perfect for development and small-scale deployments.

## 🎯 Features

### ✅ Image Upload Component
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **Click to Browse**: Traditional file browser fallback
- **Multiple Images**: Support for 3-10 images per watch
- **Real-time Preview**: Instant image preview before upload
- **Progress Tracking**: Visual upload progress indicators

### ✅ Validation
- **File Size**: Maximum 10MB per image
- **File Types**: JPG, PNG, WebP, HEIC supported
- **Image Count**: Minimum 3, maximum 10 images required
- **Type Classification**: Each image must be categorized

### ✅ Image Types
1. **Main** - Primary watch photo
2. **Dial** - Clear view of watch face
3. **Caseback** - Serial number clearly visible
4. **Movement** - If accessible or transparent case back
5. **Clasp** - Bracelet clasp details
6. **Side** - Side profile of the watch
7. **Lume** - Luminous elements
8. **Other** - Any additional relevant photos

### ✅ Storage & Processing
- **Local Storage**: Files stored in `public/uploads/` directory
- **Thumbnail Generation**: Automatic 400x400px thumbnails
- **Image Optimization**: JPEG compression at 80% quality
- **Metadata Extraction**: Width, height, file size tracking

## 🏗️ Architecture

### Database Schema

#### `image_type` Enum
```sql
CREATE TYPE image_type AS ENUM (
  'main',
  'dial',
  'caseback',
  'movement',
  'clasp',
  'side',
  'lume',
  'other'
);
```

#### `watch_images` Table
```sql
CREATE TABLE watch_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Image Type
  image_type image_type NOT NULL DEFAULT 'other',

  -- Local Storage (fields named s3_* for future S3 migration)
  s3_key TEXT NOT NULL,           -- Stores local filename
  s3_url TEXT NOT NULL,           -- Stores public URL path
  thumbnail_s3_key TEXT,          -- Stores thumbnail filename
  thumbnail_s3_url TEXT,          -- Stores thumbnail URL path

  -- File Metadata
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,

  -- Display Order
  display_order INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### File Structure

```
project/
├── public/
│   └── uploads/                    # Upload directory (auto-created)
│       ├── {filename}.jpg         # Original images
│       └── thumbnails/            # Thumbnail directory
│           └── thumb_{filename}.jpg
├── src/
│   ├── app/
│   │   └── api/
│   │       └── upload/
│   │           ├── watch-images/
│   │           │   └── route.ts    # Watch image upload API
│   │           └── avatar/
│   │               └── route.ts    # Avatar upload API
│   ├── components/
│   │   └── forms/
│   │       └── watch-photo-upload.tsx  # Main upload component
│   ├── db/
│   │   └── schema/
│   │       └── tables/
│   │           └── watch-images.ts     # Watch image table
│   ├── lib/
│   │   └── local-upload.ts             # Local upload utilities
│   └── validations/
│       └── item.ts                     # Image validation schemas
└── .env.example
```

## 🔧 Setup Guide

### 1. Install Dependencies

```bash
bun add sharp nanoid
```

### 2. Environment Variables

Add to `.env.local`:

```bash
# Local Storage Configuration
STORAGE_PROVIDER=local
UPLOAD_DIR=./public/uploads

# File upload limits
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

### 3. Create Upload Directories

The directories will be auto-created on first upload, but you can create them manually:

```bash
mkdir -p public/uploads/thumbnails
```

### 4. Database Migration

Generate and run migration:

```bash
bun run db:generate
bun run db:push
```

## 📝 Usage Examples

### Basic Usage

```tsx
import { WatchPhotoUpload } from "@/components/forms/watch-photo-upload";

export function ItemRegistrationPage() {
  const [itemId] = useState("item_123");

  const handleUploadComplete = (images) => {
    console.log("Uploaded images:", images);
    // Handle completion (e.g., navigate to next step)
  };

  return (
    <WatchPhotoUpload
      itemId={itemId}
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### With Form Integration

```tsx
import { useState } from "react";
import { WatchPhotoUpload } from "@/components/forms/watch-photo-upload";

export function WatchRegistrationForm() {
  const [step, setStep] = useState(1);
  const [itemId, setItemId] = useState<string | null>(null);

  const handleItemCreated = (newItemId: string) => {
    setItemId(newItemId);
    setStep(2);
  };

  return (
    <>
      {step === 1 && (
        <ItemDetailsForm onSubmit={handleItemCreated} />
      )}

      {step === 2 && itemId && (
        <WatchPhotoUpload
          itemId={itemId}
          onUploadComplete={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <VerificationStep itemId={itemId} />
      )}
    </>
  );
}
```

### Fetching Images

```tsx
import { db } from "@/db";
import { watchImages } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get all images for an item
export async function getWatchImages(itemId: string) {
  return await db.query.watchImages.findMany({
    where: eq(watchImages.itemId, itemId),
    orderBy: (images, { asc }) => [asc(images.displayOrder)],
  });
}

// Get images by type
export async function getMainImages(itemId: string) {
  return await db.query.watchImages.findMany({
    where: (images, { and, eq }) => and(
      eq(images.itemId, itemId),
      eq(images.imageType, "main")
    ),
  });
}
```

### Deleting Images

```tsx
// Client-side deletion
async function deleteImage(imageId: string) {
  const response = await fetch(
    `/api/upload/watch-images?imageId=${imageId}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }

  return response.json();
}

// Server-side cleanup (when deleting item)
import { db } from "@/db";
import { watchImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteImageWithThumbnail } from "@/lib/local-upload";

export async function deleteItemImages(itemId: string) {
  // Get all images
  const images = await db.query.watchImages.findMany({
    where: eq(watchImages.itemId, itemId),
  });

  // Delete from local storage
  await Promise.all(
    images.map((img) =>
      deleteImageWithThumbnail(img.s3Url, img.thumbnailS3Url)
    )
  );

  // Delete from database (cascade handles this if foreign key is set)
  await db.delete(watchImages).where(eq(watchImages.itemId, itemId));
}
```

## 🔒 Security Considerations

### Authentication
- All upload endpoints require authentication
- Users can only upload images for their own items
- Ownership verification before upload/delete

### File Validation
- Server-side file type validation
- File size limits enforced (10MB)
- MIME type verification
- Extension whitelist

### Local Storage Security
- Files stored in `public/` are publicly accessible
- Consider moving to protected directory for sensitive content
- Implement access control middleware for private images

### Rate Limiting
Consider implementing rate limiting:

```typescript
// Example with rate limiting middleware
const uploadLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 uploads per window
};
```

## 🎨 Customization

### Adjust Image Constraints

```typescript
// src/lib/local-upload.ts
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_FILE_SIZE_MB = 10;  // Change to desired size
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * KB_PER_MB * BYTES_PER_KB;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
];
```

### Customize Thumbnails

```typescript
// src/lib/local-upload.ts
async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(400, 400, {      // Change dimensions
      fit: "cover",          // Options: cover, contain, fill
      position: "center",
    })
    .jpeg({ quality: 80 })   // Adjust quality (0-100)
    .toBuffer();
}
```

### Add Image Types

```typescript
// src/db/schema/tables/watch-images.ts
export const imageTypeEnum = pgEnum("image_type", [
  "main",
  "dial",
  "caseback",
  "movement",
  "clasp",
  "side",
  "lume",
  "warranty_card",    // New type
  "box",              // New type
  "other",
]);
```

## 🚨 Error Handling

### Common Errors

#### Upload Failed
```typescript
// Check upload directory permissions
ls -la public/uploads

// Ensure directory exists and is writable
chmod 755 public/uploads
```

#### Thumbnail Generation Failed
```typescript
// Install platform-specific Sharp binaries
bun add sharp --force

// For Apple Silicon
npm rebuild sharp --platform=darwin --arch=arm64
```

#### File Not Found
```typescript
// Verify file path in database matches actual file location
const filePath = join(process.cwd(), "public", imageUrl);
console.log("File exists:", existsSync(filePath));
```

### Error Logging

```typescript
// src/app/api/upload/watch-images/route.ts
try {
  // Upload logic
} catch (error) {
  console.error("Upload error:", error);

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Upload failed" },
    { status: 500 }
  );
}
```

## 📊 Performance Optimization

### Parallel Uploads
```tsx
const uploadImages = async (images: File[]) => {
  // Upload in parallel with limit
  const chunks = chunkArray(images, 3);

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(image => uploadSingleImage(image))
    );
  }
};
```

### Lazy Loading Thumbnails
```tsx
import Image from "next/image";

export function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <Image
          key={img.id}
          src={img.thumbnailS3Url || img.s3Url}
          alt={img.originalFilename}
          width={400}
          height={400}
          loading="lazy"
        />
      ))}
    </div>
  );
}
```

## 🧪 Testing

### Unit Tests
```typescript
import { validateImageFile } from "@/lib/local-upload";

describe("Image Validation", () => {
  it("should accept valid image", () => {
    const file = new File(["content"], "test.jpg", {
      type: "image/jpeg",
    });

    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should reject oversized image", () => {
    const largeFile = new File(
      [new ArrayBuffer(11 * 1024 * 1024)],
      "large.jpg",
      { type: "image/jpeg" }
    );

    expect(() => validateImageFile(largeFile)).toThrow("File too large");
  });
});
```

### Integration Tests
```typescript
import { POST } from "@/app/api/upload/watch-images/route";

describe("Watch Image Upload API", () => {
  it("should upload image successfully", async () => {
    const formData = new FormData();
    formData.append("files", testFile1);
    formData.append("files", testFile2);
    formData.append("files", testFile3);
    formData.append("itemId", "test_item");

    const request = new Request("http://localhost/api/upload/watch-images", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);
  });
});
```

## 🔄 Future Migration to S3

The codebase is designed for easy migration to S3:

### Database Fields
- Field names already use `s3_*` prefix for compatibility
- No schema changes needed when migrating

### Migration Steps
1. Install AWS SDK: `bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
2. Create `src/lib/s3-upload.ts` with same interface as `local-upload.ts`
3. Update import in API routes: `@/lib/local-upload` → `@/lib/s3-upload`
4. Add AWS credentials to environment variables
5. Migrate existing files to S3 (optional)

### Environment Variables for S3
```bash
# Change from local to S3
STORAGE_PROVIDER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
```

## 📁 Directory Structure

```
public/
└── uploads/
    ├── abc123.jpg              # Original image
    ├── def456.png              # Original image
    └── thumbnails/
        ├── thumb_abc123.jpg    # Thumbnail
        └── thumb_def456.jpg    # Thumbnail
```

## 🐛 Troubleshooting

### Sharp Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
rm bun.lockb
bun install
```

### Permission Denied
```bash
# Fix upload directory permissions
chmod -R 755 public/uploads
```

### Images Not Displaying
```bash
# Verify public directory is being served
# Next.js automatically serves public/ at root URL
curl http://localhost:3000/uploads/test.jpg
```

### Disk Space Management
```bash
# Monitor upload directory size
du -sh public/uploads

# Clean up old files (be careful!)
find public/uploads -type f -mtime +90 -delete  # Delete files older than 90 days
```

## ✅ Checklist

- [x] Sharp dependency installed
- [x] Environment variables configured
- [x] Database schema migrated
- [x] Upload directories created (auto-created on first upload)
- [x] Watch photo upload component integrated
- [x] Avatar upload migrated to local storage
- [x] Error handling implemented
- [x] Image validation working
- [x] Thumbnail generation working
- [x] Delete functionality tested

---

**Last Updated**: January 2025
**Version**: 2.0.0 (Local Storage)
**Status**: ✅ Complete
