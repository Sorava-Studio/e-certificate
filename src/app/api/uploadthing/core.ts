import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";
import { getCurrentUser } from "@/lib/session";

const f = createUploadthing();

// FileRouter for app - can contain multiple FileRoutes
export const ourFileRouter = {
  // Avatar upload endpoint
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // This code runs on server before upload
      const user = await getCurrentUser();

      // If not authenticated, throw error
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON SERVER after upload
      if (process.env.NODE_ENV === "development") {
        // biome-ignore lint/suspicious/noConsole: Development logging
        console.log("Upload complete for user:", metadata.userId);
        // biome-ignore lint/suspicious/noConsole: Development logging
        console.log("File URL:", file.url);
      }

      // Return data to client
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
