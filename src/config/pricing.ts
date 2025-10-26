// ============================================
// 💰 PRICING CONFIGURATION
// ============================================
// Centralized pricing for service tiers
// Shared between homepage and certification wizard
// ============================================

export type ServiceTierId = "initium" | "visus" | "custodia" | "imperium";

export type PricingTier = {
  id: ServiceTierId;
  name: string;
  tagline: string;
  price: number; // in cents
  displayPrice: string; // formatted for display
  features: string[];
  popular?: boolean;
  premium?: boolean;
  freemium?: boolean;
  note?: string;
};

// ============================================
// Service Tier Prices (in cents)
// ============================================
export const SERVICE_PRICES: Record<ServiceTierId, number> = {
  initium: 0, // Free (then 500 cents = 5€)
  visus: 5000, // 50€
  custodia: 12_500, // 125€ (promotional from 150€)
  imperium: 25_000, // 250€ (promotional from 300€)
};

// ============================================
// Additional Fees (in cents)
// ============================================
export const ADDITIONAL_FEES = {
  transportKit: 1500, // 15€
  transportPackage: 2500, // 25€
  insurance: {
    basic: 1000, // 10€
    standard: 2500, // 25€
    premium: 5000, // 50€
  },
} as const;

// ============================================
// Service Tier Configuration
// ============================================
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "initium",
    name: "Initium",
    tagline:
      "Free registration (freemium), proof of traceability, entry point into Certificate",
    price: SERVICE_PRICES.initium,
    displayPrice: "Free",
    note: "(then 5€)",
    freemium: true,
    features: [
      "Online registration",
      "Unique Certificate ID generation",
      "QR code",
      "Minimal client dashboard",
      '"Not verified" status display',
      "Creation history",
    ],
  },
  {
    id: "visus",
    name: "Visus",
    tagline:
      "Light certification Activation verified remotely, certificate tied to owner identity",
    price: SERVICE_PRICES.visus,
    displayPrice: "50€",
    popular: true,
    features: [
      "Online registration",
      "Proof of ownership",
      "At-home verification",
      "Identity verification",
      "Link identity between client and item",
      "Certificate update",
      "Light history",
    ],
  },
  {
    id: "custodia",
    name: "Custodia",
    tagline:
      "Physical quality control, expert verification, professional certification",
    price: SERVICE_PRICES.custodia,
    displayPrice: "125€",
    note: "(then 150€)",
    features: [
      "Physical registration",
      "Physical verification",
      "Identity verification",
      "Privacy mode",
      "Quality control",
      "HD photos",
      "Digital certificate",
      "Revision reminder",
      "Value estimation",
      "Price tracking",
      "Complete history",
    ],
  },
  {
    id: "imperium",
    name: "Imperium",
    tagline:
      "Complete full-service experience, logistics included, maximum security, heritage value",
    price: SERVICE_PRICES.imperium,
    displayPrice: "250€",
    note: "(then 300€)",
    premium: true,
    features: [
      "Complete transport",
      "Physical registration",
      "Physical verification",
      "Identity verification",
      "Privacy mode",
      "Quality control",
      "Revision reminder",
      "UHD photos",
      "In-depth control",
      "Digital certificate",
      "NFT certificate",
      "NFC physical card (metal)",
      "Complete history",
      "Stolen passive mode",
      "Premium prime mode",
    ],
  },
];

// ============================================
// Helper Functions
// ============================================

const CENTS_PER_EURO = 100;

/**
 * Get pricing tier by ID
 */
export function getPricingTier(id: ServiceTierId): PricingTier | undefined {
  return PRICING_TIERS.find((tier) => tier.id === id);
}

/**
 * Format price in cents to display string
 */
export function formatPrice(cents: number): string {
  if (cents === 0) {
    return "Free";
  }
  const euros = cents / CENTS_PER_EURO;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(euros);
}

/**
 * Calculate total price including additional fees
 */
export function calculateTotalPrice(
  serviceId: ServiceTierId,
  options?: {
    transportKit?: boolean;
    transportPackage?: boolean;
    insurance?: "basic" | "standard" | "premium";
  }
): {
  basePrice: number;
  additionalFees: number;
  totalPrice: number;
  breakdown: Array<{ label: string; amount: number }>;
} {
  const basePrice = SERVICE_PRICES[serviceId];
  const breakdown: Array<{ label: string; amount: number }> = [
    { label: "Service tier", amount: basePrice },
  ];

  let additionalFees = 0;

  if (options?.transportKit) {
    additionalFees += ADDITIONAL_FEES.transportKit;
    breakdown.push({
      label: "Transport kit",
      amount: ADDITIONAL_FEES.transportKit,
    });
  }

  if (options?.transportPackage) {
    additionalFees += ADDITIONAL_FEES.transportPackage;
    breakdown.push({
      label: "Transport package",
      amount: ADDITIONAL_FEES.transportPackage,
    });
  }

  if (options?.insurance) {
    const insuranceFee = ADDITIONAL_FEES.insurance[options.insurance];
    additionalFees += insuranceFee;
    breakdown.push({
      label: `Insurance (${options.insurance})`,
      amount: insuranceFee,
    });
  }

  const totalPrice = basePrice + additionalFees;

  return {
    basePrice,
    additionalFees,
    totalPrice,
    breakdown,
  };
}
