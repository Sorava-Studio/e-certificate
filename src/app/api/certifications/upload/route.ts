// ============================================
// 🎫 PHOTO UPLOAD API
// ============================================
// Upload certification photos to local storage
// ============================================

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ============================================
// POST /api/certifications/upload
// ============================================
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const category = formData.get("category") as string;

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category required" }, { status: 400 });
    }

    // Create upload directory
    const uploadDir = join(
      process.cwd(),
      "public",
      "uploads",
      "certifications",
      session.user.id,
      category
    );

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Upload files
    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);

      const url = `/uploads/certifications/${session.user.id}/${category}/${filename}`;
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
