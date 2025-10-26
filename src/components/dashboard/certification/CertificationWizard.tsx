"use client";

// ============================================
// 🎫 CERTIFICATION WIZARD
// ============================================
// Main multi-step wizard for creating certifications
// ============================================

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCertificationForm } from "@/hooks/use-certification-form";
import type { CertificationFormData } from "@/types/certification";
import { Step1ObjectType } from "./steps/Step1ObjectType";
import { Step2Details } from "./steps/Step2Details";
import { Step3Photos } from "./steps/Step3Photos";
import { Step4Services } from "./steps/Step4Services";
import { StepIndicator } from "./steps/StepIndicator";

type CertificationWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: CertificationFormData) => Promise<void>;
};

const STEP_OBJECT_TYPE = 1;
const STEP_DETAILS = 2;
const STEP_PHOTOS = 3;
const STEP_SERVICE = 4;

const STEPS = [
  { number: STEP_OBJECT_TYPE, title: "Type" },
  { number: STEP_DETAILS, title: "Détails" },
  { number: STEP_PHOTOS, title: "Photos" },
  { number: STEP_SERVICE, title: "Service" },
];

export function CertificationWizard({
  open,
  onOpenChange,
  onComplete,
}: CertificationWizardProps) {
  const {
    currentStep,
    formData,
    setObjectType,
    setBasicInfo,
    setPhotos,
    setService,
    setDeliveryMethod,
    toggleOption,
    setInsurance,
    nextStep,
    previousStep,
    canProceedFromStep1,
    canProceedFromStep2,
    canProceedFromStep3,
    canProceedFromStep4,
    resetForm,
  } = useCertificationForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificationCount] = useState(0); // TODO: Fetch from API

  const getValidationMessage = (step: number): string | null => {
    if (step === STEP_OBJECT_TYPE && !canProceedFromStep1) {
      return "Veuillez sélectionner un type d'objet";
    }
    if (step === STEP_DETAILS && !canProceedFromStep2) {
      return "Veuillez remplir tous les champs obligatoires";
    }
    if (step === STEP_PHOTOS && !canProceedFromStep3) {
      return "Veuillez télécharger toutes les photos requises";
    }
    if (step === STEP_SERVICE && !canProceedFromStep4) {
      return "Veuillez sélectionner un service";
    }
    return null;
  };

  const handleNext = () => {
    const error = getValidationMessage(currentStep);
    if (error) {
      toast.error(error);
      return;
    }
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSubmit = async () => {
    const error = getValidationMessage(STEP_SERVICE);
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      await onComplete(formData as CertificationFormData);
      resetForm();
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const canProceedMap: Record<number, boolean> = {
    [STEP_OBJECT_TYPE]: canProceedFromStep1,
    [STEP_DETAILS]: canProceedFromStep2,
    [STEP_PHOTOS]: canProceedFromStep3,
    [STEP_SERVICE]: canProceedFromStep4,
  };

  const canProceed = canProceedMap[currentStep];

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle certification EMERA</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="py-6">
          <StepIndicator
            currentStep={currentStep}
            steps={STEPS}
            totalSteps={STEPS.length}
          />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] py-6">
          {currentStep === STEP_OBJECT_TYPE && (
            <Step1ObjectType
              onSelect={setObjectType}
              selectedType={formData.objectType}
            />
          )}

          {currentStep === STEP_DETAILS && (
            <Step2Details
              brand={formData.brand || ""}
              hasAccessories={!!formData.hasAccessories}
              hasDocuments={!!formData.hasDocuments}
              model={formData.model || ""}
              notes={formData.notes}
              onUpdate={setBasicInfo}
              price={formData.price || 0}
              reference={formData.reference}
            />
          )}

          {currentStep === STEP_PHOTOS && formData.photos && (
            <Step3Photos
              hasAccessories={!!formData.hasAccessories}
              hasDocuments={!!formData.hasDocuments}
              onPhotosChange={setPhotos}
              photos={formData.photos}
            />
          )}

          {currentStep === STEP_SERVICE && (
            <Step4Services
              certificationCount={certificationCount}
              deliveryMethod={formData.options?.deliveryMethod}
              onDeliveryMethodChange={setDeliveryMethod}
              onInsuranceChange={setInsurance}
              onServiceSelect={setService}
              onToggleOption={toggleOption}
              options={formData.options}
              selectedService={formData.selectedService}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t pt-6">
          <Button
            disabled={currentStep === STEP_OBJECT_TYPE || isSubmitting}
            onClick={handlePrevious}
            type="button"
            variant="outline"
          >
            <ChevronLeft className="mr-2 size-4" />
            Précédent
          </Button>

          <div className="text-muted-foreground text-sm">
            Étape {currentStep} sur {STEPS.length}
          </div>

          {currentStep < STEPS.length ? (
            <Button
              disabled={!canProceed || isSubmitting}
              onClick={handleNext}
              type="button"
            >
              Suivant
              <ChevronRight className="ml-2 size-4" />
            </Button>
          ) : (
            <Button
              disabled={!canProceed || isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la certification"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
