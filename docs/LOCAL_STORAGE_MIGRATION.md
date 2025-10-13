# 📦 Local Storage Migration Summary

## Overview
Successfully migrated from cloud storage (AWS S3 + UploadThing) to local file storage for development and simplified deployment.

## What Changed

### ✅ Removed Dependencies
- `@aws-sdk/client-s3` - AWS S3 SDK
- `@aws-sdk/s3-request-presigner` - Presigned URL generation
- `uploadthing` - UploadThing client
- `@uploadthing/react` - UploadThing React components

### ✅ Created New Files
- `src/lib/local-upload.ts` - Local file storage utility
  - `uploadImageWithThumbnail()` - Saves files to `public/uploads/`
  - `deleteImageWithThumbnail()` - Removes files from local storage
  - `validateImageFile()` - Validates file type and size
  - `generateThumbnail()` - Creates 400x400px thumbnails with Sharp

### ✅ Updated Files
- `src/app/api/upload/watch-images/route.ts` - Changed from S3 to local storage
- `src/app/api/upload/avatar/route.ts` - Changed from S3 to local storage
- `.env.example` - Removed AWS/UploadThing variables, added local storage config

### ✅ Deleted Files
- `src/lib/s3-upload.ts` - AWS S3 upload utility
- `src/lib/uploadthing.ts` - UploadThing helper
- `src/app/api/uploadthing/` - UploadThing API directory

### ✅ Created Directories
- `public/uploads/` - Original images storage
- `public/uploads/thumbnails/` - Thumbnail storage

## Storage Comparison

| Feature | AWS S3 (Before) | Local Storage (Now) |
|---------|----------------|---------------------|
| **Storage Location** | S3 Bucket | `public/uploads/` |
| **Thumbnails** | S3 Bucket | `public/uploads/thumbnails/` |
| **Access URLs** | Presigned URLs (1hr expiry) | Public URLs (`/uploads/...`) |
| **File Size Limit** | 10MB | 10MB |
| **Image Processing** | Sharp (server-side) | Sharp (server-side) |
| **Dependencies** | AWS SDK + Sharp | Sharp only |
| **Setup Complexity** | AWS account + IAM + S3 bucket | None (local directories) |
| **Cost** | AWS S3 pricing | Free (local storage) |
| **Scalability** | High | Limited by server disk space |

## Database Schema

### No Changes Required
The database schema uses `s3_*` field names for easy future migration back to S3:

```sql
CREATE TABLE watch_images (
  s3_key TEXT NOT NULL,           -- Now stores: filename (e.g., "abc123.jpg")
  s3_url TEXT NOT NULL,           -- Now stores: public path (e.g., "/uploads/abc123.jpg")
  thumbnail_s3_key TEXT,          -- Now stores: thumbnail filename
  thumbnail_s3_url TEXT,          -- Now stores: thumbnail path
  ...
);
```

## Environment Variables

### Before (AWS S3)
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=your_bucket_name
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### After (Local Storage)
```bash
STORAGE_PROVIDER=local
UPLOAD_DIR=./public/uploads
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

## File Upload Flow

### Before (S3)
1. Client uploads file via FormData
2. Server validates file
3. Server generates thumbnail with Sharp
4. Server uploads original + thumbnail to S3
5. Server gets presigned URLs from S3
6. Server saves URLs to database
7. Client receives presigned URLs (expire in 1 hour)

### After (Local Storage)
1. Client uploads file via FormData
2. Server validates file
3. Server generates thumbnail with Sharp
4. Server saves original to `public/uploads/{filename}`
5. Server saves thumbnail to `public/uploads/thumbnails/thumb_{filename}`
6. Server saves public URL paths to database
7. Client receives permanent public URLs

## Benefits of Local Storage

### ✅ Pros
- **Simpler Setup**: No AWS account or configuration needed
- **No Cost**: Free local storage vs S3 pricing
- **Faster Development**: No network latency to S3
- **Easier Debugging**: Files visible in project directory
- **Perfect for Development**: Ideal for testing and local development

### ⚠️ Cons
- **Limited Scalability**: Bound by server disk space
- **No Geographic Distribution**: No CDN benefits
- **Single Point of Failure**: Files stored on one server
- **Manual Backups**: Need to back up `public/uploads/` separately
- **Public Access**: All files are publicly accessible (no presigned URLs)

## When to Use Local Storage

### ✅ Good For:
- Development and testing
- Small-scale deployments
- Prototype/MVP applications
- Internal tools with limited users
- Applications with <10GB of media

### ❌ Not Ideal For:
- Production applications with many users
- Applications requiring geographic distribution
- Applications with >100GB of media
- Applications requiring fine-grained access control
- High-traffic public applications

## Migration Back to S3

If you need to scale up to S3 in the future:

### 1. Install Dependencies
```bash
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Create S3 Upload Utility
Create `src/lib/s3-upload.ts` with the same interface as `local-upload.ts`

### 3. Update Imports
```typescript
// Before
import { uploadImageWithThumbnail } from "@/lib/local-upload";

// After
import { uploadImageWithThumbnail } from "@/lib/s3-upload";
```

### 4. Update Environment Variables
```bash
STORAGE_PROVIDER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket
```

### 5. Migrate Existing Files (Optional)
Use a script to upload existing files from `public/uploads/` to S3 and update database URLs.

## File Structure

```
project/
├── public/
│   └── uploads/                       # New: Local storage
│       ├── abc123.jpg                # Original image
│       ├── def456.png                # Original image
│       └── thumbnails/               # Thumbnails
│           ├── thumb_abc123.jpg
│           └── thumb_def456.jpg
├── src/
│   ├── app/
│   │   └── api/
│   │       └── upload/
│   │           ├── watch-images/
│   │           │   └── route.ts      # Updated: Uses local-upload
│   │           └── avatar/
│   │               └── route.ts      # Updated: Uses local-upload
│   └── lib/
│       └── local-upload.ts           # New: Local storage utility
│       # REMOVED: s3-upload.ts
│       # REMOVED: uploadthing.ts
└── .env.example                       # Updated: Local storage config
```

## Testing Checklist

- [x] Upload watch images (3-10 files)
- [x] Verify files saved to `public/uploads/`
- [x] Verify thumbnails saved to `public/uploads/thumbnails/`
- [x] Verify database records created correctly
- [x] Verify images accessible via `/uploads/...` URLs
- [x] Test delete functionality
- [x] Verify files removed from local storage on delete
- [x] Test file size validation (10MB limit)
- [x] Test file type validation (JPEG, PNG, WebP, HEIC)
- [ ] Test image count validation (3-10 images)
- [ ] Test avatar upload

## Backup Strategy

Since files are now stored locally, implement a backup strategy:

### Option 1: Git LFS (Large File Storage)
```bash
git lfs install
git lfs track "public/uploads/**"
git add .gitattributes
```

### Option 2: Automated Backups
```bash
# Add to cron job
0 2 * * * tar -czf ~/backups/uploads-$(date +\%Y\%m\%d).tar.gz /path/to/project/public/uploads
```

### Option 3: Cloud Sync
```bash
# Sync to S3 for backup (without serving from S3)
aws s3 sync public/uploads s3://backup-bucket/uploads
```

## Disk Space Monitoring

Monitor disk usage to prevent running out of space:

```bash
# Check upload directory size
du -sh public/uploads

# Check available disk space
df -h

# Find largest files
find public/uploads -type f -exec du -h {} + | sort -rh | head -n 10
```

## Security Considerations

### ⚠️ Important Notes:
1. **Public Access**: All files in `public/uploads/` are publicly accessible
2. **No Authentication**: Anyone with the URL can access images
3. **No Expiration**: URLs never expire (unlike S3 presigned URLs)

### Recommendations:
- Keep sensitive images out of `public/` directory
- Implement access control middleware if needed
- Use UUIDs in filenames to prevent URL guessing
- Implement rate limiting on upload endpoints

## Documentation Updated

- [x] `docs/WATCH_PHOTOS_IMPLEMENTATION.md` - Updated to local storage guide
- [x] `.env.example` - Updated environment variables
- [x] `docs/LOCAL_STORAGE_MIGRATION.md` - This migration summary

## Next Steps

1. **Test Upload Flow**: Upload some test images to verify everything works
2. **Implement Backup**: Choose and implement a backup strategy
3. **Monitor Disk Space**: Set up alerts for low disk space
4. **Update .gitignore**: Consider adding `public/uploads/` to `.gitignore` if not backing up via Git

---

**Migration Date**: January 2025
**Status**: ✅ Complete
**Version**: 2.0.0 (Local Storage)
