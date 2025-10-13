// ============================================
// 🎫 CERTIFICATION BUTTON
// ============================================
// Trigger button for certification wizard
// ============================================

"use client";

import { Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CertificationFormData } from "@/types/certification";
import { CertificationWizard } from "./CertificationWizard";

// Constants
const SERVICE_PRICES: Record<string, number> = {
  initium: 2900,
  visus: 9900,
  custodia: 29_900,
  imperium: 99_900,
};

const TRANSPORT_KIT_FEE = 1500; // 15€
const TRANSPORT_PACKAGE_FEE = 2500; // 25€

const INSURANCE_FEES: Record<string, number> = {
  basic: 1000,
  standard: 2500,
  premium: 5000,
};

// Helper: Upload photos for a category
async function uploadPhotos(
  category: string,
  files: File[]
): Promise<string[]> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  formData.append("category", category);

  const response = await fetch("/api/certifications/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload ${category} photos`);
  }

  const result = await response.json();
  return result.urls;
}

// Helper: Calculate pricing
function calculatePricing(data: CertificationFormData) {
  const pricing = {
    basePrice: 0,
    additionalFees: 0,
    totalPrice: 0,
  };

  pricing.basePrice = SERVICE_PRICES[data.selectedService] || 0;

  if (data.options) {
    if (data.options.transportKit) {
      pricing.additionalFees += TRANSPORT_KIT_FEE;
    }
    if (data.options.transportPackage) {
      pricing.additionalFees += TRANSPORT_PACKAGE_FEE;
    }
    if (data.options.insurance) {
      pricing.additionalFees += INSURANCE_FEES[data.options.insurance] || 0;
    }
  }

  pricing.totalPrice = pricing.basePrice + pricing.additionalFees;
  return pricing;
}

export function CertificationButton() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (data: CertificationFormData) => {
    try {
      setIsSubmitting(true);

      // Check if this is a free tier (Initium)
      const isFree = data.selectedService === "initium";

      if (isFree) {
        // For free tier, proceed directly with certification creation
        await createCertification(data);
      } else {
        // For paid tiers, redirect to Stripe checkout
        await handlePayment(data);
      }
    } catch (error) {
      toast.error("Erreur", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la création de la certification",
      });
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (data: CertificationFormData) => {
    // Store form data in sessionStorage for after payment
    sessionStorage.setItem("certificationFormData", JSON.stringify(data));

    // Create Stripe checkout session
    const checkoutResponse = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: data.selectedService,
        options: data.options,
        certificationData: {
          objectType: data.objectType,
          brand: data.brand,
          model: data.model,
          reference: data.reference,
          price: data.price,
        },
      }),
    });

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.json();
      throw new Error(error.error || "Failed to create checkout session");
    }

    const checkoutData = await checkoutResponse.json();

    if (checkoutData.url) {
      // Redirect to Stripe checkout
      window.location.href = checkoutData.url;
    }
  };

  const createCertification = async (data: CertificationFormData) => {
    // Step 1: Upload all photos
    const photoUrls: Record<string, string[]> = {
      main: [],
      full: [],
      accessories: [],
      possession: [],
    };

    for (const [category, files] of Object.entries(data.photos)) {
      if (files.length === 0) {
        continue;
      }

      photoUrls[category] = await uploadPhotos(category, files);
    }

    // Step 2: Calculate pricing
    const pricing = calculatePricing(data);

    // Step 3: Create certification
    const response = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectType: data.objectType,
        brand: data.brand,
        model: data.model,
        reference: data.reference,
        price: data.price,
        hasDocuments: data.hasDocuments,
        hasAccessories: data.hasAccessories,
        notes: data.notes,
        serviceType: data.selectedService,
        options: data.options,
        photoUrls,
        pricing,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.details || error.error || "Failed to create certification"
      );
    }

    const result = await response.json();

    toast.success("Certification créée avec succès!", {
      description: `Numéro de certificat : ${result.certificateNumber}`,
    });

    setOpen(false);
    setIsSubmitting(false);

    // Refresh the page to show new certification
    window.location.reload();
  };

  return (
    <>
      <Button
        className="gap-2"
        disabled={isSubmitting}
        onClick={() => setOpen(true)}
        size="lg"
      >
        <Shield className="h-5 w-5" />
        Créer une certification
      </Button>

      <CertificationWizard
        onComplete={handleComplete}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
}
