// ============================================
// 🎫 CERTIFICATION UTILITIES
// ============================================
// Utility functions for certification system
// ============================================

import { nanoid } from "nanoid";
import type {
  PricingOptions,
  PricingResult,
  ServiceType,
} from "@/types/certification";

// ============================================
// Certificate Number Generation
// ============================================
const CERTIFICATE_SEGMENT_LENGTH = 4;

export function generateCertificateNumber(): string {
  // Generate format: EMERA-XXXX-XXXX
  return `EMERA-${nanoid(CERTIFICATE_SEGMENT_LENGTH).toUpperCase()}-${nanoid(CERTIFICATE_SEGMENT_LENGTH).toUpperCase()}`;
}

// ============================================
// Pricing Calculation
// ============================================
const BASE_PRICES: Record<ServiceType, number> = {
  initium: 2900, // 29€
  visus: 9900, // 99€
  custodia: 29_900, // 299€
  imperium: 99_900, // 999€
};

const INSURANCE_FEES = {
  basic: 1000, // 10€
  standard: 2500, // 25€
  premium: 5000, // 50€
};

const TRANSPORT_PACKAGE_FEE = 15_000; // 150€
const TRANSPORT_KIT_FEE = 2500; // 25€
const NO_EXPERTISE_FEE = 5000; // 50€

export function calculatePricing(
  serviceType: ServiceType,
  options?: PricingOptions
): PricingResult {
  const basePrice = BASE_PRICES[serviceType];
  const breakdown: Array<{ label: string; amount: number }> = [
    { label: `Service ${serviceType}`, amount: basePrice },
  ];

  let additionalFees = 0;

  if (options) {
    if (options.transportPackage) {
      additionalFees += TRANSPORT_PACKAGE_FEE;
      breakdown.push({
        label: "Forfait transport",
        amount: TRANSPORT_PACKAGE_FEE,
      });
    }

    if (options.transportKit) {
      additionalFees += TRANSPORT_KIT_FEE;
      breakdown.push({ label: "Kit de transport", amount: TRANSPORT_KIT_FEE });
    }

    if (options.noExpertise) {
      additionalFees += NO_EXPERTISE_FEE;
      breakdown.push({
        label: "Point de contrôle sans expertise",
        amount: NO_EXPERTISE_FEE,
      });
    }

    if (options.insurance) {
      const insuranceFee =
        INSURANCE_FEES[options.insurance as keyof typeof INSURANCE_FEES] || 0;
      if (insuranceFee > 0) {
        additionalFees += insuranceFee;
        breakdown.push({
          label: `Assurance ${options.insurance}`,
          amount: insuranceFee,
        });
      }
    }
  }

  return {
    basePrice,
    additionalFees,
    totalPrice: basePrice + additionalFees,
    breakdown,
  };
}

// ============================================
// Format Price
// ============================================
const CENTS_PER_EURO = 100;

export function formatPrice(cents: number): string {
  const euros = cents / CENTS_PER_EURO;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(euros);
}

// ============================================
// Validate Photo Requirements
// ============================================
const MIN_MAIN_PHOTOS = 1;
const MAX_MAIN_PHOTOS = 3;
const REQUIRED_FULL_PHOTOS = 5;
const REQUIRED_ACCESSORIES_PHOTOS = 5;
const REQUIRED_POSSESSION_PHOTOS = 2;

export function validatePhotoRequirements(
  photos: {
    main: File[];
    full: File[];
    accessories: File[];
    possession: File[];
  },
  hasAccessories: boolean,
  hasDocuments: boolean
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Main photos: 1-3 required
  if (photos.main.length < MIN_MAIN_PHOTOS) {
    errors.push("Au moins 1 photo principale est requise");
  }
  if (photos.main.length > MAX_MAIN_PHOTOS) {
    errors.push("Maximum 3 photos principales");
  }

  // Full photos: 5 required
  if (photos.full.length < REQUIRED_FULL_PHOTOS) {
    errors.push("5 photos complètes sont requises");
  }

  // Accessories: 5 required if has accessories or documents
  if (
    (hasAccessories || hasDocuments) &&
    photos.accessories.length < REQUIRED_ACCESSORIES_PHOTOS
  ) {
    errors.push(
      "5 photos d'accessoires et documents sont requises quand vous en possédez"
    );
  }

  // Possession proof: 2 required
  if (photos.possession.length < REQUIRED_POSSESSION_PHOTOS) {
    errors.push("2 photos de preuve de possession sont requises");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// File Validation
// ============================================
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * KB_PER_MB * BYTES_PER_KB; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format non supporté. Utilisez JPEG, PNG ou WebP.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Fichier trop volumineux. Maximum 10MB.",
    };
  }

  return { valid: true };
}

// ============================================
// Status Translation
// ============================================
export function getStatusLabel(
  status:
    | "enregistre"
    | "verifie"
    | "certifie"
    | "authentifie"
    | "refuse"
    | "en_attente"
): string {
  const labels = {
    enregistre: "Enregistré",
    verifie: "Vérifié",
    certifie: "Certifié",
    authentifie: "Authentifié",
    refuse: "Refusé",
    en_attente: "En attente",
  };

  return labels[status];
}

// ============================================
// Object Type Labels
// ============================================
export function getObjectTypeLabel(
  objectType:
    | "montre"
    | "bijou"
    | "sac"
    | "chaussures"
    | "vetement"
    | "art"
    | "electronique"
    | "autre"
): string {
  const labels = {
    montre: "Montre",
    bijou: "Bijou",
    sac: "Sac",
    chaussures: "Chaussures",
    vetement: "Vêtement",
    art: "Art",
    electronique: "Électronique",
    autre: "Autre",
  };

  return labels[objectType];
}
