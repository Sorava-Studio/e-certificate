// ============================================
// 🖼️ AVATAR UPLOAD API
// ============================================
// API route for uploading user avatars to local storage
// ============================================

import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema/tables/auth";
import { uploadImageWithThumbnail } from "@/lib/local-upload";
import { getCurrentUser } from "@/lib/session";

// ============================================
// Constants
// ============================================

const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_AVATAR_SIZE_MB = 4;
const MAX_AVATAR_SIZE = MAX_AVATAR_SIZE_MB * KB_PER_MB * BYTES_PER_KB;

// ============================================
// POST - Upload Avatar
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WebP files are accepted" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_AVATAR_SIZE) {
      return NextResponse.json(
        { error: `File size must be less than ${MAX_AVATAR_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    // Upload to local storage (using user ID as item ID for avatars)
    const uploadResult = await uploadImageWithThumbnail(
      file,
      currentUser.id,
      "avatar"
    );

    // Update user's avatar URL in database
    await db
      .update(user)
      .set({
        image: uploadResult.url,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      thumbnailUrl: uploadResult.thumbnailUrl,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Development logging
      console.error("Avatar upload error:", error);
    }
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
