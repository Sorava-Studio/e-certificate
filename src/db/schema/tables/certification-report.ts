// ============================================
// 📋 CERTIFICATION REPORT TABLE
// ============================================
// Detailed certification report with all inspection fields
// ============================================

import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { walkInMission } from "./walk-in-client";

export const certificationReport = pgTable("certification_report", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  missionId: text("mission_id")
    .notNull()
    .references(() => walkInMission.id, { onDelete: "cascade" }),

  // ============================================
  // GENERAL INFORMATION
  // ============================================
  objectBrand: text("object_brand"),
  objectModel: text("object_model"),
  objectReference: text("object_reference"),
  objectSerial: text("object_serial"),
  objectYear: text("object_year"),
  objectOrigin: text("object_origin"),
  objectPurchaseDate: text("object_purchase_date"),
  objectPurchasePrice: text("object_purchase_price"),
  objectPurchaseLocation: text("object_purchase_location"),
  objectOwner: text("object_owner"),
  objectPreviousOwner: text("object_previous_owner"),
  objectServiceHistory: text("object_service_history"),
  objectInvoice: text("object_invoice"),
  objectCertificate: text("object_certificate"),
  objectWarrantyCard: text("object_warranty_card"),
  objectBox: text("object_box"),
  objectPapers: text("object_papers"),
  objectOtherDocs: text("object_other_docs"),

  // ============================================
  // ACCESSORIES
  // ============================================
  accessoriesPresent: text("accessories_present"), // JSON array
  accessoriesBox: text("accessories_box"),
  accessoriesPapers: text("accessories_papers"),
  accessoriesWarranty: text("accessories_warranty"),
  accessoriesInvoice: text("accessories_invoice"),
  accessoriesLinks: text("accessories_links"),
  accessoriesTools: text("accessories_tools"),
  accessoriesBuckles: text("accessories_buckles"),
  accessoriesOther: text("accessories_other"),

  // ============================================
  // CASE
  // ============================================
  // Boîtier
  caseShape: text("case_shape"),
  caseMaterial: text("case_material"),
  caseDiameter: text("case_diameter"),
  caseThickness: text("case_thickness"),
  caseSetting: text("case_setting"),
  casePolishingScore: text("case_polishing_score"),
  caseScratches: text("case_scratches"),
  caseDents: text("case_dents"),

  // Couronne
  crownType: text("crown_type"),
  crownFactory: boolean("crown_factory"),
  crownChange: boolean("crown_change"),

  // Fond
  casebackType: text("caseback_type"),
  casebackMaterial: text("caseback_material"),
  casebackSignature: text("caseback_signature"),

  // Lunette
  bezelType: text("bezel_type"),
  bezelMaterial: text("bezel_material"),
  bezelSetting: text("bezel_setting"),

  // Verre
  crystalType: text("crystal_type"),
  crystalTransparency: text("crystal_transparency"),
  crystalScratches: text("crystal_scratches"),
  crystalCracks: text("crystal_cracks"),

  // ============================================
  // BRACELET
  // ============================================
  // Bracelet
  braceletType: text("bracelet_type"),
  braceletMaterial: text("bracelet_material"),
  braceletEndlinks: text("bracelet_endlinks"),

  // Entre-cornes
  lugWidth: text("lug_width"),
  springBars: text("spring_bars"),

  // Fermoir
  claspType: text("clasp_type"),
  claspMaterial: text("clasp_material"),
  claspFactory: boolean("clasp_factory"),

  // ============================================
  // DIAL
  // ============================================
  // Cadran
  dialType: text("dial_type"),
  dialColor: text("dial_color"),
  dialLume: text("dial_lume"),
  dialPatina: text("dial_patina"),

  // Aiguilles
  handsType: text("hands_type"),
  handsFactory: boolean("hands_factory"),
  handsLume: text("hands_lume"),

  // Index
  indexStyle: text("index_style"),
  indexType: text("index_type"),
  indexLume: text("index_lume"),

  // ============================================
  // MOVEMENT
  // ============================================
  movementCaliber: text("movement_caliber"),
  movementType: text("movement_type"),
  movementJewels: text("movement_jewels"),
  movementFunctions: text("movement_functions"), // JSON array
  movementParts: text("movement_parts"), // JSON array
  movementSerial: text("movement_serial"),
  movementFactory: boolean("movement_factory"),
  movementService: text("movement_service"),
  movementNotes: text("movement_notes"),

  // ============================================
  // TECHNICAL
  // ============================================
  // Poids et Dimensions
  weightTotal: text("weight_total"),
  weightTotalUnit: text("weight_total_unit"),
  weightCase: text("weight_case"),
  weightCaseUnit: text("weight_case_unit"),
  weightBracelet: text("weight_bracelet"),
  weightBraceletUnit: text("weight_bracelet_unit"),

  // Performance du Mouvement
  amplitudeDialUp: text("amplitude_dial_up"),
  amplitudeDialDown: text("amplitude_dial_down"),
  driftPerDay: text("drift_per_day"),
  powerReserve: text("power_reserve"),

  // Étanchéité
  waterResistance: text("water_resistance"),
  pressureTest: text("pressure_test"),
  deformationTest: text("deformation_test"),
  leakZones: text("leak_zones"), // JSON array

  // Joints et Lubrification
  gasketCase: text("gasket_case"),
  gasketCrown: text("gasket_crown"),
  movementOil: text("movement_oil"),

  // Rouille et Corrosion
  rustZones: text("rust_zones"), // JSON array

  // ============================================
  // INTERVENTION
  // ============================================
  // Dernière Intervention
  lastServiceDate: text("last_service_date"),
  lastServiceFactory: boolean("last_service_factory"),
  lastServiceRepairs: text("last_service_repairs"), // JSON array

  // Prochaine Intervention
  nextServiceDate: text("next_service_date"),
  nextServiceQuote: text("next_service_quote"),
  nextServiceStatus: text("next_service_status"),

  // ============================================
  // MARKET
  // ============================================
  valueMarket: text("value_market"),
  valueEstimated: text("value_estimated"),
  liquidityScore: text("liquidity_score"),

  // ============================================
  // SCORE & COMMENTAIRE
  // ============================================
  scoreCase: text("score_case"),
  scoreDial: text("score_dial"),
  scoreMovement: text("score_movement"),
  scoreStrap: text("score_strap"),
  scoreTechnic: text("score_technic"),
  scoreFinal: text("score_final"),
  commentaireCondition: text("commentaire_condition"),
  commentairesFinal: text("commentaires_final"),
  commentairesGeneraux: text("commentaires_generaux"),
  photosObligatoires: text("photos_obligatoires"), // JSON array of file paths

  // ============================================
  // METADATA
  // ============================================
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// ============================================
// TypeScript Types
// ============================================
export type CertificationReport = typeof certificationReport.$inferSelect;
export type NewCertificationReport = typeof certificationReport.$inferInsert;
