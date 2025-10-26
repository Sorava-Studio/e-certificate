// ============================================
// 🎫 CERTIFICATION FORM HOOK
// ============================================
// Custom hook for managing certification wizard state
// ============================================

import { useState } from "react";
import type {
  CertificationFormData,
  DeliveryMethod,
  ObjectType,
  ServiceType,
} from "@/types/certification";

export function useCertificationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CertificationFormData>>({
    photos: {
      main: [],
      full: [],
      accessories: [],
      possession: [],
    },
    hasDocuments: false,
    hasAccessories: false,
  });

  // Step 1: Object Type
  const setObjectType = (objectType: ObjectType) => {
    setFormData((prev) => ({ ...prev, objectType }));
  };

  // Step 2: Basic Information
  const setBasicInfo = (data: {
    brand: string;
    model: string;
    reference?: string;
    price: number;
    hasDocuments: boolean;
    hasAccessories: boolean;
    notes?: string;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Step 3: Photos
  const addPhoto = (
    category: keyof CertificationFormData["photos"],
    file: File
  ) => {
    setFormData((prev) => ({
      ...prev,
      photos: {
        main: prev.photos?.main || [],
        full: prev.photos?.full || [],
        accessories: prev.photos?.accessories || [],
        possession: prev.photos?.possession || [],
        [category]: [...(prev.photos?.[category] || []), file],
      },
    }));
  };

  const removePhoto = (
    category: keyof CertificationFormData["photos"],
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      photos: {
        main: prev.photos?.main || [],
        full: prev.photos?.full || [],
        accessories: prev.photos?.accessories || [],
        possession: prev.photos?.possession || [],
        [category]:
          prev.photos?.[category]?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const setPhotos = (
    category: keyof CertificationFormData["photos"],
    files: File[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      photos: {
        main: prev.photos?.main || [],
        full: prev.photos?.full || [],
        accessories: prev.photos?.accessories || [],
        possession: prev.photos?.possession || [],
        [category]: files,
      },
    }));
  };

  // Step 4: Service Selection
  const setService = (serviceType: ServiceType) => {
    setFormData((prev) => ({
      ...prev,
      selectedService: serviceType,
      // Reset options when changing service
      options: undefined,
    }));
  };

  const setDeliveryMethod = (deliveryMethod: DeliveryMethod) => {
    setFormData((prev) => {
      const currentOptions = prev.options || {};
      // Only update if the value actually changed
      if (currentOptions.deliveryMethod === deliveryMethod) {
        return prev;
      }
      return {
        ...prev,
        options: {
          ...currentOptions,
          deliveryMethod,
        },
      };
    });
  };

  const toggleOption = (
    option: keyof NonNullable<CertificationFormData["options"]>
  ) => {
    setFormData((prev) => {
      const currentOptions = prev.options || {};
      const currentValue = currentOptions[option];
      return {
        ...prev,
        options: {
          ...currentOptions,
          [option]: !currentValue,
        },
      };
    });
  };

  const setInsurance = (insurance: string) => {
    setFormData((prev) => {
      const currentOptions = prev.options || {};
      // Only update if the value actually changed
      if (currentOptions.insurance === insurance) {
        return prev;
      }
      return {
        ...prev,
        options: {
          ...currentOptions,
          insurance,
        },
      };
    });
  };

  // Navigation
  const TOTAL_STEPS = 4;
  const FIRST_STEP = 1;

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, FIRST_STEP));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.min(Math.max(step, FIRST_STEP), TOTAL_STEPS));
  };

  // Validation
  const canProceedFromStep1 = !!formData.objectType;

  const canProceedFromStep2 =
    !!formData.brand &&
    !!formData.model &&
    typeof formData.price === "number" &&
    formData.price > 0;

  const MIN_MAIN_PHOTOS = 1;
  const MAX_MAIN_PHOTOS = 3;
  const MIN_FULL_PHOTOS = 5;
  const MIN_POSSESSION_PHOTOS = 2;
  const MIN_ACCESSORIES_PHOTOS = 5;

  const canProceedFromStep3 = () => {
    const photos = formData.photos;
    if (!photos) {
      return false;
    }

    const hasMainPhotos =
      photos.main.length >= MIN_MAIN_PHOTOS &&
      photos.main.length <= MAX_MAIN_PHOTOS;
    const hasFullPhotos = photos.full.length >= MIN_FULL_PHOTOS;
    const hasPossessionPhotos =
      photos.possession.length >= MIN_POSSESSION_PHOTOS;

    const needsAccessoryPhotos =
      formData.hasAccessories || formData.hasDocuments;
    const hasAccessoryPhotos = needsAccessoryPhotos
      ? photos.accessories.length >= MIN_ACCESSORIES_PHOTOS
      : true;

    return (
      hasMainPhotos &&
      hasFullPhotos &&
      hasPossessionPhotos &&
      hasAccessoryPhotos
    );
  };

  const canProceedFromStep4 = !!formData.selectedService;

  // Reset form
  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      photos: {
        main: [],
        full: [],
        accessories: [],
        possession: [],
      },
      hasDocuments: false,
      hasAccessories: false,
    });
  };

  return {
    currentStep,
    formData,
    setObjectType,
    setBasicInfo,
    addPhoto,
    removePhoto,
    setPhotos,
    setService,
    setDeliveryMethod,
    toggleOption,
    setInsurance,
    nextStep,
    previousStep,
    goToStep,
    canProceedFromStep1,
    canProceedFromStep2,
    canProceedFromStep3: canProceedFromStep3(),
    canProceedFromStep4,
    resetForm,
  };
}
