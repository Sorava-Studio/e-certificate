// ============================================
// 🎫 SERVICE TIER CONSTANTS
// ============================================
// Configuration for EMERA certification service tiers
// ============================================

import type { ObjectTypeOption, ServiceTier } from "@/types/certification";

// ============================================
// Service Tiers
// ============================================
export const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "initium",
    name: "Initium",
    tagline: "Enregistrement",
    icon: "🔷",
    price: 2900, // 29€
    timeline: "Immédiat",
    features: [
      "Numéro de certificat unique",
      "Recherche de données historiques",
      "Analyse de prix du marché",
      "Enregistrement base de données",
    ],
    status: "Enregistré",
    color: "blue",
  },
  {
    id: "visus",
    name: "Visus",
    tagline: "Vérification",
    icon: "📸",
    price: 9900, // 99€
    timeline: "2-5 jours",
    features: [
      "Contrôle visuel IA + expert",
      "Rapport d'authentification",
      "Vérification base anti-fraude",
      "Statut vérifié",
    ],
    status: "Vérifié",
    color: "amber",
  },
  {
    id: "custodia",
    name: "Custodia",
    tagline: "Certification",
    icon: "🛡️",
    price: 29_900, // 299€
    timeline: "1-2 semaines",
    popular: true,
    features: [
      "Inspection physique au point de contrôle",
      "Contrôle technique léger",
      "Photos professionnelles (15)",
      "Carte de certification gravée",
      "QR Code digital",
      "Options transport & assurance",
    ],
    status: "Certifié",
    color: "green",
  },
  {
    id: "imperium",
    name: "Imperium",
    tagline: "Authentification Premium",
    icon: "✨",
    price: 99_900, // 999€
    timeline: "2-4 semaines",
    features: [
      "Contrôle technique approfondi",
      "Photos professionnelles (30)",
      "Génération 3D (IA)",
      "Certificat NFT blockchain",
      "Jumeau numérique complet",
    ],
    status: "Authentifié",
    requirements: "> 5 objets enregistrés",
    color: "purple",
    disabled: false,
  },
];

// ============================================
// Object Types
// ============================================
export const OBJECT_TYPES: ObjectTypeOption[] = [
  { id: "montre", label: "Montre", icon: "⌚" },
  { id: "bijou", label: "Bijou", icon: "💍" },
  { id: "sac", label: "Sac", icon: "👜" },
  { id: "chaussures", label: "Chaussures", icon: "👟" },
  { id: "vetement", label: "Vêtement", icon: "👔" },
  { id: "art", label: "Art", icon: "🖼️" },
  { id: "electronique", label: "Électronique", icon: "💻" },
  { id: "autre", label: "Autre", icon: "📦" },
];

// ============================================
// Photo Upload Sections
// ============================================
export const PHOTO_SECTIONS = {
  main: {
    category: "main" as const,
    label: "Photos principales",
    helperText: "Vue claire de face, bon éclairage, fond neutre",
    minPhotos: 1,
    maxPhotos: 3,
    required: true,
    conditional: false,
  },
  full: {
    category: "full" as const,
    label: "Vues complètes de l'objet",
    helperText: "Face, dos, côtés, dessus/dessous, numéros de série",
    minPhotos: 5,
    maxPhotos: 10,
    required: true,
    conditional: false,
  },
  accessories: {
    category: "accessories" as const,
    label: "Accessoires et documents",
    helperText: "Boîte, certificats, factures, cartes de garantie",
    minPhotos: 5,
    maxPhotos: 10,
    required: false,
    conditional: true,
  },
  possession: {
    category: "possession" as const,
    label: "Preuve de possession",
    helperText:
      "Photo avec date du jour écrite, photo montrant l'objet en votre possession",
    minPhotos: 2,
    maxPhotos: 5,
    required: true,
    conditional: false,
  },
};

// ============================================
// Insurance Tiers
// ============================================
export const INSURANCE_TIERS = [
  { value: "basic", label: "Basique", price: 1000, coverage: "Jusqu'à 5 000€" },
  {
    value: "standard",
    label: "Standard",
    price: 2500,
    coverage: "Jusqu'à 15 000€",
  },
  {
    value: "premium",
    label: "Premium",
    price: 5000,
    coverage: "Jusqu'à 50 000€",
  },
];
