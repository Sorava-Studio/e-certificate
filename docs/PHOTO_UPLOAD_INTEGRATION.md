# 📸 Photo Upload Integration - Item Registration

## Overview
Successfully integrated the watch photo upload feature into the item registration flow with a multi-step process.

## Implementation

### Multi-Step Registration Flow

**Step 1: Item Details**
- User fills in luxury item details (brand, model, serial number, etc.)
- Form validates all required fields
- Serial number duplicate check
- Option to save as draft

**Step 2: Photo Upload**
- Automatically shown after successful item creation
- Upload 3-10 photos with drag-and-drop
- Each photo can be categorized (dial, caseback, movement, etc.)
- Generate 400x400px thumbnails automatically
- Option to skip and complete later

**Step 3: Completion**
- Success sheet shows options to view items or certificate
- User redirected to dashboard

## Components Modified

### 1. Item Registration Form
**File**: `src/components/forms/item-registration-form.tsx`

**Changes**:
- Added step state: `"details" | "photos" | "complete"`
- Extracted form fields to `ItemDetailsFields` component to reduce complexity
- Added photo upload step after item creation
- Updated button text: "Submit for Verification" → "Continue to Photos"
- Added skip button for photo upload

**Key Functions**:
```typescript
const onSubmit = async (data: FormData) => {
  const result = await createItem(data);
  if (result.success) {
    setCreatedItemId(result.data.id);
    setCurrentStep("photos"); // Move to photo upload
  }
};

const handlePhotoUploadComplete = () => {
  setCurrentStep("complete");
  setShowSuccessSheet(true);
};

const handleSkipPhotos = () => {
  setCurrentStep("complete");
  setShowSuccessSheet(true);
};
```

### 2. Item Details Fields (NEW)
**File**: `src/components/forms/item-details-fields.tsx`

**Purpose**:
- Extracted form fields from main component
- Reduces complexity of ItemRegistrationForm
- Reusable form field component

**Props**:
```typescript
type ItemDetailsFieldsProps = {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  isCheckingSerial: boolean;
  serialError: string | null;
  onSerialNumberBlur: () => void;
};
```

**Fields Included**:
- Item Type (watch, jewelry, other)
- Brand (dropdown or input)
- Model
- Reference Number
- Serial Number (with duplicate check)
- Year Manufactured
- Purchase Date (calendar picker)
- Purchase Price (optional)

### 3. Watch Photo Upload
**File**: `src/components/forms/watch-photo-upload.tsx`

**Already existed** - Now integrated into registration flow

**Props**:
```typescript
type WatchPhotoUploadProps = {
  itemId?: string;  // Now provided after item creation
  onUploadComplete?: (images: UploadedImage[]) => void;  // Triggers next step
  existingImages?: UploadedImage[];
};
```

## User Experience Flow

```
┌─────────────────────────────────────┐
│   Step 1: Item Details              │
│                                     │
│   - Fill in item information        │
│   - Serial number duplicate check   │
│   - Option: Save as Draft           │
│   - Button: "Continue to Photos"    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Step 2: Photo Upload              │
│                                     │
│   - Drag & drop 3-10 photos         │
│   - Categorize each photo           │
│   - Auto thumbnail generation       │
│   - Button: "Upload All"            │
│   - Button: "Skip for Now"          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Step 3: Success                   │
│                                     │
│   - Success message                 │
│   - Option: View My Items           │
│   - Option: View Certificate        │
└─────────────────────────────────────┘
```

## API Integration

### Upload Endpoint
**POST** `/api/upload/watch-images`

**Request**:
```typescript
FormData {
  itemId: string;
  imageType: string;  // "main" | "dial" | "caseback" | etc.
  file: File;
}
```

**Response**:
```typescript
{
  success: true,
  data: {
    id: string;
    s3Url: string;  // Public URL to image
    thumbnailS3Url: string;  // Public URL to thumbnail
    // ... other metadata
  }
}
```

### Validation
- File size: Max 5MB
- File types: JPEG, PNG, HEIC
- Image count: 3-10 images per item
- Ownership: User must own the item

## File Storage

### Structure
```
public/
└── uploads/
    ├── watch-images_{userId}_{itemId}_{timestamp}_{filename}.jpg
    ├── watch-images_{userId}_{itemId}_{timestamp}_{filename}.png
    └── thumbnails/
        ├── thumb_watch-images_{userId}_{itemId}_{timestamp}_{filename}.jpg
        └── thumb_watch-images_{userId}_{itemId}_{timestamp}_{filename}.png
```

### Naming Convention
```
Format: {prefix}_{userId}_{itemId}_{timestamp}_{sanitizedFileName}.{ext}

Example:
watch-images_user123_item456_1697145600000_rolex_submariner.jpg
thumb_watch-images_user123_item456_1697145600000_rolex_submariner.jpg
```

## Benefits

### ✅ User Experience
- **Seamless flow**: No page refresh between steps
- **Visual progress**: Clear step-by-step process
- **Flexibility**: Can skip photos and add later
- **Immediate feedback**: Validation and upload status

### ✅ Developer Experience
- **Clean code**: Extracted components reduce complexity
- **Maintainable**: Separation of concerns
- **Reusable**: ItemDetailsFields can be reused elsewhere
- **Type safe**: Full TypeScript support

### ✅ Data Integrity
- **Automatic linking**: Photos linked to item immediately
- **Validation**: File type, size, and count checks
- **Ownership**: User must own item to upload photos
- **Error handling**: Graceful failure with user feedback

## Testing Checklist

- [x] Item creation submits successfully
- [x] Photo upload step appears after item creation
- [x] itemId is passed correctly to WatchPhotoUpload
- [x] Photos can be uploaded and categorized
- [x] Thumbnails are generated automatically
- [x] Skip button works and shows success sheet
- [x] Upload completion shows success sheet
- [x] Navigation works from success sheet
- [ ] Draft saving works correctly
- [ ] Serial number duplicate check works
- [ ] Error handling displays correctly

## Future Enhancements

### Possible Improvements
1. **Progress Indicator**: Add visual step indicator (1/3, 2/3, 3/3)
2. **Photo Preview**: Show uploaded photos in success sheet
3. **Bulk Upload**: Upload all photos at once instead of one by one
4. **Edit Mode**: Allow editing item details after creation
5. **Auto-save**: Save photos as draft while uploading
6. **Photo Requirements**: Show checklist of required photo types
7. **Image Cropping**: Allow users to crop images before upload
8. **EXIF Data**: Extract and display camera metadata

### Backend Improvements
1. **Image Optimization**: Compress images before saving
2. **Format Conversion**: Convert all images to WebP for better compression
3. **Lazy Loading**: Load thumbnails first, full images on demand
4. **CDN Integration**: Serve images from CDN for better performance
5. **Virus Scanning**: Scan uploaded files for malware

## Related Files

- `src/components/forms/item-registration-form.tsx` - Main registration form
- `src/components/forms/item-details-fields.tsx` - Extracted form fields
- `src/components/forms/watch-photo-upload.tsx` - Photo upload component
- `src/app/api/upload/watch-images/route.ts` - Upload API endpoint
- `src/lib/local-upload.ts` - Local file storage utility
- `docs/WATCH_PHOTOS_IMPLEMENTATION.md` - Full implementation guide
- `docs/LOCAL_STORAGE_MIGRATION.md` - Migration guide

---

**Date**: October 13, 2025
**Status**: ✅ Complete
**Version**: 1.0.0
