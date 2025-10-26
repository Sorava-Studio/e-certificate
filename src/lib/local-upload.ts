// ============================================
// 📦 LOCAL FILE UPLOAD UTILITY
// ============================================
// Local file storage for development and small deployments
// Files stored in public/uploads directory
// ============================================

import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

// ============================================
// Configuration
// ============================================

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const THUMBNAIL_DIR = join(process.cwd(), "public", "uploads", "thumbnails");
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 400;

// File size limits
const MAX_FILE_SIZE_MB = 5;
const KB_PER_MB = 1024;
const BYTES_PER_KB = 1024;

// ============================================
// Upload Functions
// ============================================

/**
 * Ensure upload directories exist
 */
async function ensureUploadDirs() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  if (!existsSync(THUMBNAIL_DIR)) {
    await mkdir(THUMBNAIL_DIR, { recursive: true });
  }
}

/**
 * Generate a unique filename
 */
export function generateFileName(
  userId: string,
  itemId: string,
  originalName: string,
  prefix = "watch-images"
): string {
  const timestamp = Date.now();
  const sanitizedName = originalName.replace(/[^\w.-]/g, "_");
  const ext = sanitizedName.split(".").pop();
  const nameWithoutExt = sanitizedName.replace(`.${ext}`, "");

  if (itemId === "avatar") {
    return `${prefix}_${userId}_${timestamp}_${nameWithoutExt}.${ext}`;
  }

  return `${prefix}_${userId}_${itemId}_${timestamp}_${nameWithoutExt}.${ext}`;
}

/**
 * Save file to local storage
 */
export async function saveToLocal(
  buffer: Buffer,
  fileName: string,
  subDir?: string
): Promise<string> {
  await ensureUploadDirs();

  const targetDir = subDir ? join(UPLOAD_DIR, subDir) : UPLOAD_DIR;

  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  const filePath = join(targetDir, fileName);
  await writeFile(filePath, buffer);

  // Return public URL
  const publicPath = subDir
    ? `/uploads/${subDir}/${fileName}`
    : `/uploads/${fileName}`;

  return publicPath;
}

/**
 * Generate thumbnail from image buffer
 */
export async function generateThumbnail(
  buffer: Buffer,
  width = THUMBNAIL_WIDTH,
  height = THUMBNAIL_HEIGHT
): Promise<Buffer> {
  return await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}

/**
 * Upload image with thumbnail
 */
export async function uploadImageWithThumbnail(
  file: File,
  userId: string,
  itemId: string
): Promise<{
  url: string;
  thumbnailUrl: string;
  fileName: string;
  thumbnailFileName: string;
  width: number;
  height: number;
  size: number;
}> {
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Get image dimensions
  const { width, height } = await getImageDimensions(buffer);

  // Generate filenames
  const fileName = generateFileName(userId, itemId, file.name);
  const base = fileName.replace(/\.[^.]+$/, '');
  const thumbnailFileName = `thumb_${base}.jpg`;

  // Generate thumbnail
  const thumbnailBuffer = await generateThumbnail(buffer);

  // Save both files
  const [url, thumbnailUrl] = await Promise.all([
    saveToLocal(buffer, fileName),
    saveToLocal(thumbnailBuffer, thumbnailFileName, "thumbnails"),
  ]);

  return {
    url,
    thumbnailUrl,
    fileName,
    thumbnailFileName,
    width,
    height,
    size: file.size,
  };
}

/**
 * Delete file from local storage
 */
export async function deleteFromLocal(publicPath: string): Promise<void> {
  try {
    const filePath = join(process.cwd(), "public", publicPath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    // File might not exist, ignore error
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.warn("Failed to delete file:", publicPath, error);
    }
  }
}

/**
 * Delete image and thumbnail from local storage
 */
export async function deleteImageWithThumbnail(
  url: string,
  thumbnailUrl?: string
): Promise<void> {
  await deleteFromLocal(url);

  if (thumbnailUrl) {
    await deleteFromLocal(thumbnailUrl);
  }
}

// ============================================
// Validation Functions
// ============================================

export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: MAX_FILE_SIZE_MB * KB_PER_MB * BYTES_PER_KB, // 5MB
  MIN_IMAGES: 3,
  MAX_IMAGES: 10,
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/heic"],
  ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".heic"],
};

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  // Check file type
  if (!IMAGE_CONFIG.ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and HEIC files are accepted",
    };
  }

  return { valid: true };
}

/**
 * Validate image count for upload (only checks MAX, not MIN)
 * MIN_IMAGES should be validated at submission, not during upload
 */
export function validateImageCount(count: number): {
  valid: boolean;
  error?: string;
} {
  if (count > IMAGE_CONFIG.MAX_IMAGES) {
    return {
      valid: false,
      error: `Maximum ${IMAGE_CONFIG.MAX_IMAGES} images allowed`,
    };
  }

  return { valid: true };
}

/**
 * Validate total image count meets minimum requirement
 * Use this before final submission
 */
export function validateMinImageCount(count: number): {
  valid: boolean;
  error?: string;
} {
  if (count < IMAGE_CONFIG.MIN_IMAGES) {
    return {
      valid: false,
      error: `At least ${IMAGE_CONFIG.MIN_IMAGES} images are required`,
    };
  }

  return { valid: true };
}
