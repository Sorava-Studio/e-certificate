// ============================================
// 🎫 CERTIFICATION TYPES
// ============================================
// TypeScript types for certification system
// ============================================

// ============================================
// Object Types
// ============================================
export type ObjectType =
  | "montre"
  | "bijou"
  | "sac"
  | "chaussures"
  | "vetement"
  | "art"
  | "electronique"
  | "autre";

export type ServiceType = "initium" | "visus" | "custodia" | "imperium";

export type CertificationStatus =
  | "enregistre"
  | "verifie"
  | "certifie"
  | "authentifie"
  | "refuse"
  | "en_attente";

export type DeliveryMethod = "pickup" | "dropoff";

export type PhotoCategory =
  | "main"
  | "full"
  | "accessories"
  | "possession"
  | "professional";

// ============================================
// Form Data Structures
// ============================================
export type CertificationFormData = {
  // Step 1: Object Type
  objectType: ObjectType;

  // Step 2: Basic Information
  brand: string;
  model: string;
  reference?: string;
  price: number;
  hasDocuments: boolean;
  hasAccessories: boolean;
  notes?: string;

  // Step 3: Photos
  photos: {
    main: File[];
    full: File[];
    accessories: File[];
    possession: File[];
  };

  // Step 4: Service Selection
  selectedService: ServiceType;
  options?: {
    deliveryMethod?: DeliveryMethod;
    transportKit?: boolean;
    transportPackage?: boolean;
    insurance?: string;
    controlPointId?: string;
    noExpertise?: boolean;
  };
};

// ============================================
// Service Tier Configuration
// ============================================
export type ServiceTier = {
  id: ServiceType;
  name: string;
  tagline: string;
  icon: string;
  price: number; // in cents
  timeline: string;
  features: string[];
  status: string;
  color: "blue" | "amber" | "green" | "purple";
  popular?: boolean;
  requirements?: string;
  disabled?: boolean;
};

// ============================================
// Photo Upload Types
// ============================================
export type PhotoUploadSection = {
  category: PhotoCategory;
  label: string;
  helperText: string;
  minPhotos: number;
  maxPhotos: number;
  required: boolean;
  conditional?: boolean;
};

export type UploadedPhoto = {
  url: string;
  thumbnailUrl?: string;
  file: File;
  category: PhotoCategory;
};

// ============================================
// API Response Types
// ============================================
export type CreateCertificationResponse = {
  success: boolean;
  certificateNumber?: string;
  certificationId?: string;
  status?: CertificationStatus;
  error?: string;
};

export type GetCertificationsResponse = {
  certifications: Array<{
    id: string;
    certificateNumber: string;
    objectType: ObjectType;
    brand: string;
    model: string;
    serviceType: ServiceType;
    status: CertificationStatus;
    totalPrice: number;
    createdAt: Date;
    photos: Array<{
      url: string;
      thumbnailUrl?: string;
      category: PhotoCategory;
    }>;
  }>;
};

export type CertificationCountResponse = {
  count: number;
  imperiumEligible: boolean;
};

export type UploadPhotosResponse = {
  urls: string[];
  error?: string;
};

// ============================================
// Pricing Configuration
// ============================================
export type PricingOptions = {
  deliveryMethod?: DeliveryMethod;
  transportKit?: boolean;
  transportPackage?: boolean;
  insurance?: string;
  controlPointId?: string;
  noExpertise?: boolean;
};

export type PricingResult = {
  basePrice: number;
  additionalFees: number;
  totalPrice: number;
  breakdown: Array<{
    label: string;
    amount: number;
  }>;
};

// ============================================
// Object Type Configuration
// ============================================
export type ObjectTypeOption = {
  id: ObjectType;
  label: string;
  icon: string;
};
