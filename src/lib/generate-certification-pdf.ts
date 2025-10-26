import type { jsPDF } from "jspdf";
import type { CertificationReport } from "@/db/schema/tables/certification-report";

type MissionSummary = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceTier: string;
  createdAt: Date;
  completedAt?: Date;
};

// Layout constants
const MARGIN_LEFT = 20;
const MARGIN_TOP = 20;
const FONT_SIZE_TITLE = 20;
const FONT_SIZE_SECTION = 14;
const FONT_SIZE_BODY = 10;
const FONT_SIZE_SUBTITLE = 12;
const FONT_SIZE_FOOTER = 8;
const FONT_SIZE_SCORE = 16;
const LINE_HEIGHT_SMALL = 6;
const LINE_HEIGHT_MEDIUM = 7;
const LINE_HEIGHT_XL = 15;
const SECTION_SPACING = 10;
const PAGE_BREAK_THRESHOLD = 250;
const SCORE_SCALE = 10;
const LIQUIDITY_SCALE = 100;
const FOOTER_OFFSET = 10;
const COLOR_RED = 200;
const COLOR_BLUE = 41;
const COLOR_BLUE_MID = 128;
const COLOR_BLUE_LIGHT = 185;
const COLOR_GRAY = 150;
const TEXT_MAX_WIDTH_OFFSET = 40;
const COMMENT_LINE_SPACING = 5;

type PDFDoc = jsPDF & {
  autoTable: (options: unknown) => void;
  lastAutoTable?: { finalY: number };
};

function addClientSection(
  doc: PDFDoc,
  mission: MissionSummary,
  yPos: number
): number {
  let currentY = yPos;

  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont("helvetica", "bold");
  doc.text("Informations Client", MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_MEDIUM;

  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");
  doc.text(`Nom: ${mission.clientName}`, MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_SMALL;
  doc.text(`Email: ${mission.clientEmail}`, MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_SMALL;
  doc.text(`Téléphone: ${mission.clientPhone}`, MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_SMALL;
  doc.text(
    `Service: ${mission.serviceTier.toUpperCase()}`,
    MARGIN_LEFT,
    currentY
  );
  currentY += LINE_HEIGHT_SMALL;
  doc.text(
    `Date de création: ${new Date(mission.createdAt).toLocaleDateString("fr-FR")}`,
    MARGIN_LEFT,
    currentY
  );
  currentY += LINE_HEIGHT_SMALL;

  if (mission.completedAt) {
    doc.text(
      `Date de finalisation: ${new Date(mission.completedAt).toLocaleDateString("fr-FR")}`,
      MARGIN_LEFT,
      currentY
    );
    currentY += LINE_HEIGHT_SMALL;
  }

  currentY += SECTION_SPACING;
  return currentY;
}

function addWatchSection(
  doc: PDFDoc,
  report: CertificationReport,
  yPos: number
): number {
  let currentY = yPos;

  const hasWatchInfo = Boolean(report.objectBrand || report.objectModel);
  if (!hasWatchInfo) {
    return currentY;
  }

  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Identification de la Montre", MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_MEDIUM;

  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");

  if (report.objectBrand) {
    doc.text(`Marque: ${report.objectBrand}`, MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
  }
  if (report.objectModel) {
    doc.text(`Modèle: ${report.objectModel}`, MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
  }
  if (report.objectReference) {
    doc.text(`Référence: ${report.objectReference}`, MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
  }
  if (report.objectSerial) {
    doc.text(`Numéro de série: ${report.objectSerial}`, MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
  }
  if (report.objectYear) {
    doc.text(`Année: ${report.objectYear}`, MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
  }

  currentY += SECTION_SPACING;
  return currentY;
}

function addScoresSection(
  doc: PDFDoc,
  report: CertificationReport,
  yPos: number
): number {
  let currentY = yPos;

  const hasScores =
    report.scoreCase ||
    report.scoreDial ||
    report.scoreMovement ||
    report.scoreStrap ||
    report.scoreTechnic;

  if (!hasScores) {
    return currentY;
  }

  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont("helvetica", "bold");
  doc.text("Scores d'Évaluation", MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_MEDIUM;

  const scores = [
    ["Boîtier", report.scoreCase],
    ["Cadran", report.scoreDial],
    ["Mouvement", report.scoreMovement],
    ["Bracelet", report.scoreStrap],
    ["Technique", report.scoreTechnic],
  ].filter(([, score]) => score);

  doc.autoTable({
    startY: currentY,
    head: [["Catégorie", "Score"]],
    body: scores,
    theme: "striped",
    headStyles: { fillColor: [COLOR_BLUE, COLOR_BLUE_MID, COLOR_BLUE_LIGHT] },
    margin: { left: MARGIN_LEFT },
  });

  currentY = doc.lastAutoTable?.finalY || currentY + TEXT_MAX_WIDTH_OFFSET;
  currentY += SECTION_SPACING;
  return currentY;
}

function addFinalScoreSection(
  doc: PDFDoc,
  report: CertificationReport,
  yPos: number,
  pageWidth: number
): number {
  let currentY = yPos;

  if (!report.scoreFinal) {
    return currentY;
  }

  doc.setFontSize(FONT_SIZE_SCORE);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLOR_BLUE, COLOR_BLUE_MID, COLOR_BLUE_LIGHT);
  doc.text(
    `Score Final: ${report.scoreFinal}/${SCORE_SCALE}`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );
  currentY += LINE_HEIGHT_XL;
  doc.setTextColor(0, 0, 0);

  return currentY;
}

function addMarketValueSection(
  doc: PDFDoc,
  report: CertificationReport,
  yPos: number
): number {
  let currentY = yPos;

  const hasMarketInfo = Boolean(report.valueEstimated || report.valueMarket);
  if (!hasMarketInfo) {
    return currentY;
  }

  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont("helvetica", "bold");
  doc.text("Valeur Estimée", MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_MEDIUM;

  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");

  if (report.valueMarket) {
    doc.text(`Valeur marché: ${report.valueMarket}€`, MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
  }
  if (report.valueEstimated) {
    doc.text(
      `Valeur ajustée: ${report.valueEstimated}€`,
      MARGIN_LEFT,
      currentY
    );
    currentY += LINE_HEIGHT_SMALL;
  }
  if (report.liquidityScore) {
    doc.text(
      `Score de liquidité: ${report.liquidityScore}/${LIQUIDITY_SCALE}`,
      MARGIN_LEFT,
      currentY
    );
    currentY += LINE_HEIGHT_SMALL;
  }

  currentY += SECTION_SPACING;
  return currentY;
}

function addCommentsSection(
  doc: PDFDoc,
  report: CertificationReport,
  yPos: number,
  pageWidth: number
): number {
  let currentY = yPos;

  const hasComments = Boolean(
    report.commentairesGeneraux ||
      report.commentaireCondition ||
      report.commentairesFinal
  );

  if (!hasComments) {
    return currentY;
  }

  // Check if we need a new page
  if (currentY > PAGE_BREAK_THRESHOLD) {
    doc.addPage();
    currentY = MARGIN_TOP;
  }

  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont("helvetica", "bold");
  doc.text("Commentaires", MARGIN_LEFT, currentY);
  currentY += LINE_HEIGHT_MEDIUM;

  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");

  if (report.commentaireCondition) {
    doc.text("État général:", MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
    const lines = doc.splitTextToSize(
      report.commentaireCondition,
      pageWidth - TEXT_MAX_WIDTH_OFFSET
    );
    doc.text(lines, MARGIN_LEFT, currentY);
    currentY += lines.length * COMMENT_LINE_SPACING + COMMENT_LINE_SPACING;
  }

  if (report.commentairesGeneraux) {
    doc.text("Commentaires généraux:", MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
    const lines = doc.splitTextToSize(
      report.commentairesGeneraux,
      pageWidth - TEXT_MAX_WIDTH_OFFSET
    );
    doc.text(lines, MARGIN_LEFT, currentY);
    currentY += lines.length * COMMENT_LINE_SPACING + COMMENT_LINE_SPACING;
  }

  if (report.commentairesFinal) {
    doc.text("Conclusion:", MARGIN_LEFT, currentY);
    currentY += LINE_HEIGHT_SMALL;
    const lines = doc.splitTextToSize(
      report.commentairesFinal,
      pageWidth - TEXT_MAX_WIDTH_OFFSET
    );
    doc.text(lines, MARGIN_LEFT, currentY);
    currentY += lines.length * COMMENT_LINE_SPACING;
  }

  return currentY;
}

function addFooter(doc: PDFDoc, pageWidth: number): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(FONT_SIZE_FOOTER);
    doc.setTextColor(COLOR_GRAY);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - FOOTER_OFFSET,
      { align: "center" }
    );
  }
}

export async function generateCertificationPDF(
  mission: MissionSummary,
  report: CertificationReport | null
) {
  // Dynamic import to avoid SSR issues
  const jsPDFModule = await import("jspdf");
  const PDFConstructor = jsPDFModule.default;
  await import("jspdf-autotable");

  const doc = new PDFConstructor() as PDFDoc;

  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = MARGIN_TOP;

  // Header
  doc.setFontSize(FONT_SIZE_TITLE);
  doc.setFont("helvetica", "bold");
  doc.text("RAPPORT DE CERTIFICATION", pageWidth / 2, yPos, {
    align: "center",
  });

  yPos += SECTION_SPACING;
  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR")}`,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );

  yPos += LINE_HEIGHT_XL;

  // Client Information
  yPos = addClientSection(doc, mission, yPos);

  if (!report) {
    doc.setFontSize(FONT_SIZE_SUBTITLE);
    doc.setTextColor(COLOR_RED, 0, 0);
    doc.text("Aucun rapport de certification disponible", MARGIN_LEFT, yPos);
    doc.save(`certification-${mission.clientName.replace(/\s/g, "_")}.pdf`);
    return;
  }

  // Watch Information
  yPos = addWatchSection(doc, report, yPos);

  // Scores
  yPos = addScoresSection(doc, report, yPos);

  // Final Score
  yPos = addFinalScoreSection(doc, report, yPos, pageWidth);

  // Market Value
  yPos = addMarketValueSection(doc, report, yPos);

  // Comments
  addCommentsSection(doc, report, yPos, pageWidth);

  // Footer
  addFooter(doc, pageWidth);

  // Download the PDF
  doc.save(`certification-${mission.clientName.replace(/\s/g, "_")}.pdf`);
}
