// ============================================
// 📸 WATCH IMAGES UPLOAD API
// ============================================
// API route for uploading watch verification photos to local storage
// ============================================

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { item } from "@/db/schema/tables/items";
import { watchImage } from "@/db/schema/tables/watch-images";
import {
  uploadImageWithThumbnail,
  validateImageCount,
  validateImageFile,
} from "@/lib/local-upload";
import { getCurrentUser } from "@/lib/session";

// ============================================
// POST - Upload Watch Images
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const itemId = formData.get("itemId") as string;
    const imageType = formData.get("imageType") as string;
    const file = formData.get("file") as File;

    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.log("Upload request:", {
        itemId,
        imageType,
        fileName: file?.name,
        fileSize: file?.size,
      });
    }

    // Validate required fields
    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    if (!imageType) {
      return NextResponse.json(
        { error: "Image type is required" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Verify item exists and belongs to user
    const itemData = await db.query.item.findFirst({
      where: eq(item.id, itemId),
    });

    if (!itemData) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (itemData.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate file
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Check image count
    const existingImages = await db
      .select()
      .from(watchImage)
      .where(eq(watchImage.itemId, itemId));

    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.log(`Existing images: ${existingImages.length}, adding 1 more`);
    }

    const countValidation = validateImageCount(existingImages.length + 1);
    if (!countValidation.valid) {
      if (process.env.NODE_ENV === "development") {
        // biome-ignore lint/suspicious/noConsole: Development logging
        console.log("Image count validation failed:", countValidation.error);
      }
      return NextResponse.json(
        { error: countValidation.error },
        { status: 400 }
      );
    }

    // Upload to local storage
    const uploadResult = await uploadImageWithThumbnail(file, user.id, itemId);

    // Save to database
    const newImage = await db
      .insert(watchImage)
      .values({
        id: nanoid(),
        itemId,
        userId: user.id,
        imageType: imageType as never,
        s3Key: uploadResult.fileName,
        s3Url: uploadResult.url,
        thumbnailS3Key: uploadResult.thumbnailFileName,
        thumbnailS3Url: uploadResult.thumbnailUrl,
        fileName: file.name,
        fileSize: uploadResult.size,
        mimeType: file.type,
        width: uploadResult.width,
        height: uploadResult.height,
        displayOrder: existingImages.length,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newImage[0],
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.error("Watch image upload error:", error);
    }
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete Watch Image
// ============================================

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get image ID from URL
    const url = new URL(request.url);
    const imageId = url.searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Find image
    const images = await db
      .select()
      .from(watchImage)
      .where(eq(watchImage.id, imageId))
      .limit(1);

    const imageData = images[0];

    if (!imageData) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Verify ownership
    if (imageData.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from local storage
    const { deleteImageWithThumbnail } = await import("@/lib/local-upload");
    await deleteImageWithThumbnail(
      imageData.s3Url,
      imageData.thumbnailS3Url || undefined
    );

    // Delete from database
    await db.delete(watchImage).where(eq(watchImage.id, imageId));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.error("Watch image delete error:", error);
    }
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
