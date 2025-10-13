// ============================================
// 💳 PAYMENT RETURN HANDLER
// ============================================
// Handle user return from Stripe checkout
// Create certification after successful payment
// ============================================

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { CertificationFormData } from "@/types/certification";

// Helper functions from CertificationButton
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

const SERVICE_PRICES: Record<string, number> = {
  initium: 2900,
  visus: 9900,
  custodia: 29_900,
  imperium: 99_900,
};

const TRANSPORT_KIT_FEE = 1500;
const TRANSPORT_PACKAGE_FEE = 2500;

const INSURANCE_FEES: Record<string, number> = {
  basic: 1000,
  standard: 2500,
  premium: 5000,
};

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

export function PaymentReturnHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleSuccessfulPayment = useCallback(async () => {
    try {
      // Retrieve stored form data
      const storedData = sessionStorage.getItem("certificationFormData");
      if (!storedData) {
        toast.error("Session data not found", {
          description: "Please try creating your certification again",
        });
        router.push("/dashboard");
        return;
      }

      const formData: CertificationFormData = JSON.parse(storedData);

      // Upload photos
      const photoUrls: Record<string, string[]> = {
        main: [],
        full: [],
        accessories: [],
        possession: [],
      };

      toast.info("Uploading photos...");

      for (const [category, files] of Object.entries(formData.photos)) {
        if (files.length === 0) {
          continue;
        }

        photoUrls[category] = await uploadPhotos(category, files);
      }

      // Calculate pricing
      const pricing = calculatePricing(formData);

      // Create certification
      toast.info("Creating certification...");

      const response = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectType: formData.objectType,
          brand: formData.brand,
          model: formData.model,
          reference: formData.reference,
          price: formData.price,
          hasDocuments: formData.hasDocuments,
          hasAccessories: formData.hasAccessories,
          notes: formData.notes,
          serviceType: formData.selectedService,
          options: formData.options,
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

      // Clear stored data
      sessionStorage.removeItem("certificationFormData");

      toast.success("Certification créée avec succès!", {
        description: `Numéro de certificat : ${result.certificateNumber}`,
        duration: 5000,
      });

      // Redirect to certificates list
      router.push("/dashboard/certificates");
    } catch (error) {
      toast.error("Error creating certification", {
        description:
          error instanceof Error
            ? error.message
            : "Please contact support if the problem persists",
      });
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId && !processing) {
      setProcessing(true);
      handleSuccessfulPayment();
    }
  }, [searchParams, processing, handleSuccessfulPayment]);

  return null;
}
