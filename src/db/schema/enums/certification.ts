// ============================================
// 🎫 CERTIFICATION ENUMS
// ============================================
// Enums for certification system
// ============================================

import { pgEnum } from "drizzle-orm/pg-core";

// Object types for certification
export const objectTypeEnum = pgEnum("object_type", [
  "montre",
  "bijou",
  "sac",
  "chaussures",
  "vetement",
  "art",
  "electronique",
  "autre",
]);

// Service tiers
export const serviceTypeEnum = pgEnum("service_type", [
  "initium",
  "visus",
  "custodia",
  "imperium",
]);

// Certification status
export const certificationStatusEnum = pgEnum("certification_status", [
  "enregistre",
  "verifie",
  "certifie",
  "authentifie",
  "refuse",
  "en_attente",
]);

// Delivery method for Custodia
export const deliveryMethodEnum = pgEnum("delivery_method", [
  "pickup",
  "dropoff",
]);

// Photo category
export const photoCategoryEnum = pgEnum("photo_category", [
  "main",
  "full",
  "accessories",
  "possession",
  "professional",
  // Inspection evidence photos
  "inspection_dial",
  "inspection_caseback",
  "inspection_movement",
  "inspection_serial",
  "inspection_bracelet",
  "inspection_clasp",
  "inspection_documents",
  "inspection_other",
]);

// Inspection result
export const inspectionResultEnum = pgEnum("inspection_result", [
  "authentic",
  "counterfeit",
  "requires_further_inspection",
]);
