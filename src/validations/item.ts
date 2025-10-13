// ============================================
// 📦 ITEM VALIDATION SCHEMAS
// ============================================
// Zod validation for luxury item registration forms
// ============================================

import { z } from "zod";

// Constants for validation
const MAX_BRAND_LENGTH = 100;
const MAX_MODEL_LENGTH = 100;
const MAX_REFERENCE_LENGTH = 50;
const MAX_SERIAL_LENGTH = 50;
const MIN_YEAR = 1800;
const MAX_PRICE = 999_999_999.99;

// Item Types
export const ITEM_TYPES = ["watch", "jewelry", "other"] as const;

export type ItemType = (typeof ITEM_TYPES)[number];

// Popular watch brands
export const WATCH_BRANDS = [
  "Rolex",
  "Omega",
  "Patek Philippe",
  "Audemars Piguet",
  "Cartier",
  "TAG Heuer",
  "Breitling",
  "IWC",
  "Jaeger-LeCoultre",
  "Panerai",
  "Hublot",
  "Vacheron Constantin",
  "A. Lange & Söhne",
  "Blancpain",
  "Chopard",
  "Zenith",
  "Breguet",
  "Girard-Perregaux",
  "Ulysse Nardin",
  "Tudor",
  "Other",
] as const;

// Popular jewelry brands
export const JEWELRY_BRANDS = [
  "Cartier",
  "Tiffany & Co.",
  "Bulgari",
  "Van Cleef & Arpels",
  "Harry Winston",
  "Graff",
  "Chopard",
  "Boucheron",
  "Piaget",
  "Mikimoto",
  "David Yurman",
  "De Beers",
  "Buccellati",
  "Pomellato",
  "Messika",
  "Other",
] as const;

export type WatchBrand = (typeof WATCH_BRANDS)[number];
export type JewelryBrand = (typeof JEWELRY_BRANDS)[number];

// Item Status
export const ITEM_STATUSES = [
  "draft",
  "pending_verification",
  "verified",
  "flagged",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];

// Current year for validation
const currentYear = new Date().getFullYear();

// Base item schema
export const itemSchema = z.object({
  type: z.enum(ITEM_TYPES, {
    message: "Please select an item type",
  }),

  brand: z
    .string({ message: "Brand is required" })
    .min(1, "Brand is required")
    .max(
      MAX_BRAND_LENGTH,
      `Brand must be less than ${MAX_BRAND_LENGTH} characters`
    ),

  model: z
    .string({ message: "Model is required" })
    .min(1, "Model is required")
    .max(
      MAX_MODEL_LENGTH,
      `Model must be less than ${MAX_MODEL_LENGTH} characters`
    ),

  referenceNumber: z
    .string({ message: "Reference number is required" })
    .min(1, "Reference number is required")
    .max(
      MAX_REFERENCE_LENGTH,
      `Reference number must be less than ${MAX_REFERENCE_LENGTH} characters`
    )
    .regex(
      /^[\dA-Za-z\-_.]+$/,
      "Reference number can only contain letters, numbers, hyphens, underscores, and dots"
    ),

  serialNumber: z
    .string({ message: "Serial number is required" })
    .min(1, "Serial number is required")
    .max(
      MAX_SERIAL_LENGTH,
      `Serial number must be less than ${MAX_SERIAL_LENGTH} characters`
    )
    .regex(
      /^[\dA-Za-z\-_.]+$/,
      "Serial number can only contain letters, numbers, hyphens, underscores, and dots"
    ),

  yearManufactured: z
    .number({ message: "Year of manufacture is required" })
    .int("Year must be a whole number")
    .min(MIN_YEAR, `Year must be ${MIN_YEAR} or later`)
    .max(currentYear, `Year cannot be in the future (max: ${currentYear})`),

  purchaseDate: z
    .date({ message: "Purchase date is required" })
    .max(new Date(), "Purchase date cannot be in the future"),

  purchasePrice: z
    .number({ message: "Price must be a number" })
    .positive("Price must be positive")
    .max(MAX_PRICE, "Price is too large")
    .optional()
    .nullable(),

  status: z.enum(ITEM_STATUSES).default("draft"),
});

// Schema for creating a new item
export const createItemSchema = itemSchema.omit({ status: true });

// Schema for updating an item
export const updateItemSchema = itemSchema.partial();

// Schema for draft (allows partial data)
export const saveDraftItemSchema = z.object({
  type: z.enum(ITEM_TYPES).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  referenceNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  yearManufactured: z.number().optional(),
  purchaseDate: z.date().optional(),
  purchasePrice: z.number().optional().nullable(),
  status: z.literal("draft"),
});

// Type exports
export type ItemFormData = z.infer<typeof itemSchema>;
export type CreateItemData = z.infer<typeof createItemSchema>;
export type UpdateItemData = z.infer<typeof updateItemSchema>;
export type SaveDraftItemData = z.infer<typeof saveDraftItemSchema>;

// ============================================
// WATCH IMAGE VALIDATION
// ============================================

const MAX_IMAGE_SIZE_MB = 5;
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * KB_PER_MB * BYTES_PER_KB;
const MIN_IMAGES_REQUIRED = 3;
const MAX_IMAGES_ALLOWED = 10;

export const IMAGE_TYPES = [
  "front_dial",
  "case_back",
  "movement",
  "unique_features",
  "imperfections",
  "other",
] as const;

export type WatchImageType = (typeof IMAGE_TYPES)[number];

// Image type labels for UI
export const IMAGE_TYPE_LABELS: Record<WatchImageType, string> = {
  front_dial: "Front Dial",
  case_back: "Case Back with Serial Number",
  movement: "Movement (if accessible)",
  unique_features: "Unique Features",
  imperfections: "Imperfections",
  other: "Other",
};

// Image type descriptions
export const IMAGE_TYPE_DESCRIPTIONS: Record<WatchImageType, string> = {
  front_dial: "Clear photo of the watch face showing the dial and hands",
  case_back:
    "Photo of the case back clearly showing the serial number and markings",
  movement:
    "Photo of the movement if the case back is transparent or removable",
  unique_features:
    "Any unique features, engravings, or special characteristics",
  imperfections: "Any scratches, dents, or imperfections for accurate record",
  other: "Any other relevant photos",
};

// Watch image upload schema
export const watchImageSchema = z.object({
  imageType: z.enum(IMAGE_TYPES, {
    message: "Please select an image type",
  }),
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
      `Max file size is ${MAX_IMAGE_SIZE_MB}MB`
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/heic"].includes(file.type),
      "Only JPG, PNG, and HEIC files are accepted"
    ),
});

// Batch upload schema
export const watchImageBatchSchema = z.object({
  images: z
    .array(watchImageSchema)
    .min(MIN_IMAGES_REQUIRED, `Minimum ${MIN_IMAGES_REQUIRED} images required`)
    .max(MAX_IMAGES_ALLOWED, `Maximum ${MAX_IMAGES_ALLOWED} images allowed`),
  itemId: z.string().min(1, "Item ID is required"),
});

export type WatchImageData = z.infer<typeof watchImageSchema>;
export type WatchImageBatchData = z.infer<typeof watchImageBatchSchema>;
