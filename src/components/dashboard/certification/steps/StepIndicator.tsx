"use client";

// ============================================
// 🎫 STEP INDICATOR
// ============================================
// Progress indicator for certification wizard
// ============================================

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    number: number;
    title: string;
  }>;
};

export function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div className="flex flex-1 items-center" key={step.number}>
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2 transition-all",
                  step.number < currentStep &&
                    "border-primary bg-primary text-primary-foreground",
                  step.number === currentStep &&
                    "border-primary bg-background text-primary",
                  step.number > currentStep &&
                    "border-muted bg-background text-muted-foreground"
                )}
              >
                {step.number < currentStep ? (
                  <Check className="size-5" />
                ) : (
                  <span className="font-semibold text-sm">{step.number}</span>
                )}
              </div>

              {/* Step Title */}
              <span
                className={cn(
                  "absolute top-12 whitespace-nowrap font-medium text-xs",
                  step.number === currentStep && "text-foreground",
                  step.number !== currentStep && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 transition-all",
                  step.number < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
