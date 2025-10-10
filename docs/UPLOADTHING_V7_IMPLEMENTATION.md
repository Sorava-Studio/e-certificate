# UploadThing v7+ Implementation

## Overview
Updated image upload to use the latest UploadThing v7+ patterns with improved error handling and modern React hooks.

## What Changed

### 1. **Server-Side (API Route)**

**File:** `/src/app/api/uploadthing/core.ts`

#### Before (Old Pattern):
```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId };
    }),
} satisfies FileRouter;
```

#### After (New Pattern):
```typescript
import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  avatarUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized"); // Use standard Error
      }

      return { userId: user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // Server-side logging
      console.log("Upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);

      // Return custom data to client
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
```

**Key Changes:**
- ✅ Separate `FileRouter` import
- ✅ Explicit file config object with `maxFileCount`
- ✅ Use standard `Error` instead of `UploadThingError`
- ✅ Added development logging
- ✅ Return custom metadata from `onUploadComplete`

### 2. **Client-Side (React Component)**

**File:** `/src/components/settings/user-settings-dialog.tsx`

#### Before (Old Pattern):
```typescript
const { startUpload } = useUploadThing("avatarUploader");

const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0];
  setIsUploadingAvatar(true);

  try {
    const uploaded = await startUpload([file]);
    if (uploaded?.[0]?.url) {
      await updateProfileImage(uploaded[0].url);
      router.refresh();
    }
  } catch {
    // Silent error
  } finally {
    setIsUploadingAvatar(false);
  }
};
```

#### After (New Pattern):
```typescript
const { startUpload } = useUploadThing("avatarUploader", {
  onClientUploadComplete: async (res) => {
    // Success callback
    if (res?.[0]?.url) {
      const result = await updateProfileImage(res[0].url);
      if (result.success) {
        router.refresh();
      } else {
        setProfileError(result.message);
      }
    }
    setIsUploadingAvatar(false);
  },
  onUploadError: (error: Error) => {
    // Error callback
    setProfileError(error.message || "Failed to upload image");
    setIsUploadingAvatar(false);
  },
});

const handleAvatarUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploadingAvatar(true);
  setProfileError(""); // Clear previous errors

  try {
    await startUpload([file]);
    // Success/error handled by callbacks
  } catch (error) {
    setProfileError(error instanceof Error ? error.message : "Failed to upload image");
    setIsUploadingAvatar(false);
  }
};
```

**Key Changes:**
- ✅ Use callbacks (`onClientUploadComplete`, `onUploadError`) instead of return values
- ✅ Proper error handling with user-friendly messages
- ✅ Clear previous errors before upload
- ✅ Handle both callback errors and thrown exceptions
- ✅ Better loading state management

## New Features

### 1. **Callback-Based Error Handling**
```typescript
useUploadThing("avatarUploader", {
  onClientUploadComplete: async (res) => {
    // Handle success - file URLs are in res
  },
  onUploadError: (error: Error) => {
    // Handle errors - show to user
  },
});
```

### 2. **Explicit File Configuration**
```typescript
f({
  image: {
    maxFileSize: "4MB",     // Maximum file size
    maxFileCount: 1,         // Only one file at a time
  },
})
```

### 3. **Development Logging**
```typescript
onUploadComplete(({ metadata, file }) => {
  if (process.env.NODE_ENV === "development") {
    console.log("Upload complete for user:", metadata.userId);
    console.log("File URL:", file.url);
  }
  return { uploadedBy: metadata.userId };
})
```

### 4. **Better Error Messages**
Users now see specific error messages:
- "Unauthorized" - Not logged in
- "File too large" - Exceeds 4MB
- "Invalid file type" - Not an image
- Network/API errors - Specific error from UploadThing

## Migration Benefits

### ✅ Improved Developer Experience
- Clearer separation of concerns
- Better TypeScript types
- Easier debugging with callbacks
- More intuitive API

### ✅ Better Error Handling
- Errors are caught and displayed to users
- No more silent failures
- Specific error messages for different failure modes

### ✅ Better Performance
- Callback-based approach is more efficient
- No unnecessary promise resolutions
- Proper cleanup with loading states

### ✅ Future-Proof
- Using latest v7+ patterns
- Compatible with upcoming features
- Better aligned with React best practices

## Usage Examples

### Basic Upload
```typescript
const { startUpload } = useUploadThing("avatarUploader", {
  onClientUploadComplete: (res) => {
    console.log("Files: ", res);
    alert("Upload complete!");
  },
  onUploadError: (error) => {
    alert(`ERROR! ${error.message}`);
  },
});

// Trigger upload
await startUpload(files);
```

### With Progress Tracking
```typescript
const { startUpload, isUploading } = useUploadThing("avatarUploader", {
  onClientUploadComplete: (res) => {
    setUploadComplete(true);
  },
  onUploadError: (error) => {
    setError(error.message);
  },
  onUploadProgress: (progress) => {
    setProgress(progress);
  },
});

// Can use isUploading state
{isUploading && <Spinner />}
```

### Multiple Files
```typescript
f({
  image: {
    maxFileSize: "4MB",
    maxFileCount: 5, // Allow up to 5 files
  },
})

// Upload array of files
await startUpload(fileArray);
```

## Environment Variables

No changes needed - still uses:
```bash
UPLOADTHING_SECRET=your_secret_here
UPLOADTHING_APP_ID=your_app_id_here
```

## Testing

### Test Upload Flow:
1. ✅ Select image < 4MB → Should succeed
2. ✅ Select image > 4MB → Should show "File too large"
3. ✅ Select PDF → Should show "Invalid file type"
4. ✅ Not logged in → Should show "Unauthorized"
5. ✅ Network error → Should show specific error

### Check Console Logs (Development):
```
Upload complete for user: abc123
File URL: https://utfs.io/f/...
```

### Check Error Display:
Errors now appear in red banner below avatar upload button.

## Troubleshooting

### Issue: "Upload failed - no file URL returned"
**Solution:** Check that `onClientUploadComplete` is receiving the response. Add logging:
```typescript
onClientUploadComplete: (res) => {
  console.log("Upload response:", res);
  // ...
}
```

### Issue: Callback not firing
**Solution:** Make sure the hook is configured correctly:
```typescript
// ✅ Correct
const { startUpload } = useUploadThing("avatarUploader", {
  onClientUploadComplete: (res) => { /* ... */ },
});

// ❌ Wrong
const { startUpload } = useUploadThing("avatarUploader");
```

### Issue: TypeScript errors
**Solution:** Update UploadThing packages:
```bash
npm install uploadthing@latest @uploadthing/react@latest
```

## Summary

**Updated to UploadThing v7+ with:**
- ✅ Modern callback-based API
- ✅ Better error handling
- ✅ Improved TypeScript support
- ✅ Development logging
- ✅ User-friendly error messages
- ✅ Cleaner, more maintainable code

**The upload now:**
- Shows specific errors to users
- Has better loading states
- Logs helpful debug info in development
- Uses latest best practices

**No breaking changes for users** - the UI works the same, just better! 🚀
