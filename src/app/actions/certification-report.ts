"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { certificationReport } from "@/db/schema/tables/certification-report";
import { getCurrentUser } from "@/lib/session";

export type CertificationReportData = {
  missionId: string;

  // General Information
  objectBrand?: string;
  objectModel?: string;
  objectReference?: string;
  objectSerial?: string;
  objectYear?: string;
  objectOrigin?: string;
  objectPurchaseDate?: string;
  objectPurchasePrice?: string;
  objectPurchaseLocation?: string;
  objectOwner?: string;
  objectPreviousOwner?: string;
  objectServiceHistory?: string;
  objectInvoice?: string;
  objectCertificate?: string;
  objectWarrantyCard?: string;
  objectBox?: string;
  objectPapers?: string;
  objectOtherDocs?: string;

  // Accessories
  accessoriesPresent?: string;
  accessoriesBox?: string;
  accessoriesPapers?: string;
  accessoriesWarranty?: string;
  accessoriesInvoice?: string;
  accessoriesLinks?: string;
  accessoriesTools?: string;
  accessoriesBuckles?: string;
  accessoriesOther?: string;

  // Case
  caseShape?: string;
  caseMaterial?: string;
  caseDiameter?: string;
  caseThickness?: string;
  caseSetting?: string;
  casePolishingScore?: string;
  caseScratches?: string;
  caseDents?: string;
  crownType?: string;
  crownFactory?: boolean;
  crownChange?: boolean;
  casebackType?: string;
  casebackMaterial?: string;
  casebackSignature?: string;
  bezelType?: string;
  bezelMaterial?: string;
  bezelSetting?: string;
  crystalType?: string;
  crystalTransparency?: string;
  crystalScratches?: string;
  crystalCracks?: string;

  // Bracelet
  braceletType?: string;
  braceletMaterial?: string;
  braceletEndlinks?: string;
  lugWidth?: string;
  springBars?: string;
  claspType?: string;
  claspMaterial?: string;
  claspFactory?: boolean;

  // Dial
  dialType?: string;
  dialColor?: string;
  dialLume?: string;
  dialPatina?: string;
  handsType?: string;
  handsFactory?: boolean;
  handsLume?: string;
  indexStyle?: string;
  indexType?: string;
  indexLume?: string;

  // Movement
  movementCaliber?: string;
  movementType?: string;
  movementJewels?: string;
  movementFunctions?: string;
  movementParts?: string;
  movementSerial?: string;
  movementFactory?: boolean;
  movementService?: string;
  movementNotes?: string;

  // Technical
  weightTotal?: string;
  weightTotalUnit?: string;
  weightCase?: string;
  weightCaseUnit?: string;
  weightBracelet?: string;
  weightBraceletUnit?: string;
  amplitudeDialUp?: string;
  amplitudeDialDown?: string;
  driftPerDay?: string;
  powerReserve?: string;
  waterResistance?: string;
  pressureTest?: string;
  deformationTest?: string;
  leakZones?: string;
  gasketCase?: string;
  gasketCrown?: string;
  movementOil?: string;
  rustZones?: string;

  // Intervention
  lastServiceDate?: string;
  lastServiceFactory?: boolean;
  lastServiceRepairs?: string;
  nextServiceDate?: string;
  nextServiceQuote?: string;
  nextServiceStatus?: string;

  // Market
  valueMarket?: string;
  valueEstimated?: string;
  liquidityScore?: string;

  // Score & Comments
  scoreCase?: string;
  scoreDial?: string;
  scoreMovement?: string;
  scoreStrap?: string;
  scoreTechnic?: string;
  scoreFinal?: string;
  commentaireCondition?: string;
  commentairesFinal?: string;
  commentairesGeneraux?: string;
  photosObligatoires?: string;
};

// ============================================
// SAVE CERTIFICATION REPORT
// ============================================
export async function saveCertificationReport(data: CertificationReportData) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (user.role !== "partner" && user.role !== "admin") {
    return {
      error: "Access denied. Only partners can save certification reports.",
    };
  }

  try {
    // Check if report already exists for this mission
    const existingReport = await db.query.certificationReport.findFirst({
      where: eq(certificationReport.missionId, data.missionId),
    });

    let report: typeof certificationReport.$inferSelect | undefined;

    if (existingReport) {
      // Update existing report
      [report] = await db
        .update(certificationReport)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(certificationReport.id, existingReport.id))
        .returning();
    } else {
      // Create new report
      [report] = await db.insert(certificationReport).values(data).returning();
    }

    return { success: true, report };
  } catch (_error) {
    return { error: "Failed to save certification report" };
  }
}

// ============================================
// GET CERTIFICATION REPORT BY MISSION ID
// ============================================
export async function getCertificationReport(missionId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (user.role !== "partner" && user.role !== "admin") {
    return { error: "Access denied" };
  }

  try {
    const report = await db.query.certificationReport.findFirst({
      where: eq(certificationReport.missionId, missionId),
    });

    return { success: true, report };
  } catch (_error) {
    return { error: "Failed to fetch certification report" };
  }
}
