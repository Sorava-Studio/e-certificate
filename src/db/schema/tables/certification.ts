// ============================================
// 🎫 CERTIFICATION TABLES
// ============================================
// Tables for EMERA certification system
// ============================================

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  certificationStatusEnum,
  inspectionResultEnum,
  objectTypeEnum,
  photoCategoryEnum,
  serviceTypeEnum,
} from "../enums/certification";
import { user } from "./auth";

// ============================================
// Certifications Table
// ============================================
export const certification = pgTable("certification", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  certificateNumber: varchar("certificate_number", { length: 20 })
    .notNull()
    .unique(),

  // Partner assignment
  partnerId: text("partner_id").references(() => user.id, {
    onDelete: "set null",
  }),
  assignedAt: timestamp("assigned_at"),

  // Step 1 & 2: Object details
  objectType: objectTypeEnum("object_type").notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  reference: varchar("reference", { length: 255 }),
  price: integer("price").notNull(), // in cents
  hasDocuments: boolean("has_documents").default(false).notNull(),
  hasAccessories: boolean("has_accessories").default(false).notNull(),
  notes: text("notes"),

  // Step 4: Service selection
  serviceType: serviceTypeEnum("service_type").notNull(),
  status: certificationStatusEnum("status").default("enregistre").notNull(),

  // Options (stored as JSONB for flexibility)
  options: jsonb("options").$type<{
    deliveryMethod?: "pickup" | "dropoff";
    transportKit?: boolean;
    transportPackage?: boolean;
    insurance?: string;
    controlPointId?: string;
    noExpertise?: boolean;
  }>(),

  // Pricing
  basePrice: integer("base_price").notNull(), // in cents
  additionalFees: integer("additional_fees").default(0).notNull(), // in cents
  totalPrice: integer("total_price").notNull(), // in cents

  // Status tracking
  paidAt: timestamp("paid_at"),
  identityVerifiedAt: timestamp("identity_verified_at"),
  inspectedAt: timestamp("inspected_at"),
  completedAt: timestamp("completed_at"),

  // QR Code & NFT (for Custodia/Imperium)
  qrCode: text("qr_code"),
  nftTokenId: varchar("nft_token_id", { length: 255 }), // Imperium only
  threeDModelUrl: text("three_d_model_url"), // Imperium only

  // Metadata
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// Certification Photos Table
// ============================================
export const certificationPhoto = pgTable("certification_photo", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificationId: uuid("certification_id")
    .notNull()
    .references(() => certification.id, { onDelete: "cascade" }),

  category: photoCategoryEnum("category").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  order: integer("order").default(0).notNull(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// ============================================
// Inspection Reports Table
// ============================================
export const inspectionReport = pgTable("inspection_report", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificationId: uuid("certification_id")
    .notNull()
    .references(() => certification.id, { onDelete: "cascade" }),

  // Inspection metadata
  inspectionLevel: integer("inspection_level").notNull(), // 1, 2, or 3
  result: inspectionResultEnum("result").notNull(),
  inspectedBy: text("inspected_by"), // Partner name or expert name

  // Detailed inspection data (JSONB for flexibility)
  inspectionData: jsonb("inspection_data").$type<{
    // General Information
    marque?: string;
    modele?: string;
    diametreBoitier?: string;
    epaisseurBoitier?: string;
    annee?: string;
    emplacement?: string;
    etatContenuLivre?: string;
    vendeurTypeAnnonce?: string;
    categorie?: string;
    numeroReference?: string;
    mouvementFonctions?: string;

    // Case (Boîtier)
    cadran?: {
      etat?: string;
      couleur?: string;
      finish?: string;
      index?: string;
      aiguilles?: string;
      luminova?: string;
      complications?: string;
      etatGeneral?: string;
    };

    // Bracelet
    bracelet?: {
      type?: string;
      materiau?: string;
      couleur?: string;
      etat?: string;
      boucle?: string;
      longueur?: string;
    };

    // Movement (Mouvement)
    mouvement?: {
      type?: string;
      calibre?: string;
      nombreRubis?: string;
      reserve?: string;
      frequency?: string;
      etat?: string;
      precision?: string;
      serviceHistory?: string;
    };

    // Case (Boîtier)
    boitier?: {
      materiau?: string;
      etat?: string;
      finish?: string;
      engravings?: string;
      caseback?: string;
      crown?: string;
      pushers?: string;
      crystal?: string;
      waterResistance?: string;
    };

    // Documentation & Accessories
    documentation?: {
      box?: boolean;
      papers?: boolean;
      warranty?: boolean;
      serviceRecords?: boolean;
      originalReceipt?: boolean;
      manuals?: boolean;
      certificat?: boolean;
    };

    accessories?: {
      extraLinks?: boolean;
      tools?: boolean;
      travelCase?: boolean;
      other?: string;
    };

    // Verification & Authentication
    verification?: {
      serialNumber?: string;
      serialLocation?: string;
      serialVerified?: boolean;
      referenceNumber?: string;
      hallmarks?: string;
      authentificationMarks?: string;
    };

    // Condition Assessment
    condition?: {
      overall?: "excellent" | "very_good" | "good" | "fair" | "poor";
      bezel?: string;
      lug?: string;
      caseback?: string;
      braceletClasp?: string;
      signs?: string;
      modifications?: string;
      damages?: string;
    };

    // Value & Market
    market?: {
      estimatedValue?: number; // in cents
      marketTrend?: string;
      rarity?: string;
      demand?: string;
      comparables?: string;
    };

    // Notes & Recommendations
    notes?: {
      general?: string;
      recommendations?: string;
      serviceNeeded?: string;
      concerns?: string;
      highlights?: string;
    };

    // Photos & Evidence
    photos?: {
      dialCloseup?: string[];
      movementPhotos?: string[];
      casebackPhotos?: string[];
      braceletPhotos?: string[];
      serialNumberPhotos?: string[];
      documentsPhotos?: string[];
    };
  }>(),

  // Summary report text
  report: text("report"),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// Relations
// ============================================
export const certificationRelations = relations(
  certification,
  ({ one, many }) => ({
    user: one(user, {
      fields: [certification.userId],
      references: [user.id],
    }),
    partner: one(user, {
      fields: [certification.partnerId],
      references: [user.id],
    }),
    photos: many(certificationPhoto),
    inspectionReports: many(inspectionReport),
  })
);

export const certificationPhotoRelations = relations(
  certificationPhoto,
  ({ one }) => ({
    certification: one(certification, {
      fields: [certificationPhoto.certificationId],
      references: [certification.id],
    }),
  })
);

export const inspectionReportRelations = relations(
  inspectionReport,
  ({ one }) => ({
    certification: one(certification, {
      fields: [inspectionReport.certificationId],
      references: [certification.id],
    }),
  })
);

// ============================================
// TypeScript Types
// ============================================
export type Certification = typeof certification.$inferSelect;
export type NewCertification = typeof certification.$inferInsert;

export type CertificationPhoto = typeof certificationPhoto.$inferSelect;
export type NewCertificationPhoto = typeof certificationPhoto.$inferInsert;

export type InspectionReport = typeof inspectionReport.$inferSelect;
export type NewInspectionReport = typeof inspectionReport.$inferInsert;
