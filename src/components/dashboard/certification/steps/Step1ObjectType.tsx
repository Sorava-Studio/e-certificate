"use client";

// ============================================
// 🎫 STEP 1: OBJECT TYPE SELECTION
// ============================================
// Select the type of object to certify
// ============================================

import { cn } from "@/lib/utils";
import type { ObjectType } from "@/types/certification";
import { OBJECT_TYPES } from "../constants";

type Step1ObjectTypeProps = {
  selectedType?: ObjectType;
  onSelect: (type: ObjectType) => void;
};

export function Step1ObjectType({
  selectedType,
  onSelect,
}: Step1ObjectTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl">Type d'objet</h2>
        <p className="text-muted-foreground">
          Sélectionnez le type d'objet que vous souhaitez certifier
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {OBJECT_TYPES.map((type) => (
          <button
            className={cn(
              "group flex flex-col items-center gap-3 rounded-lg border-2 bg-card p-6 transition-all hover:border-primary hover:shadow-md",
              selectedType === type.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border"
            )}
            key={type.id}
            onClick={() => onSelect(type.id)}
            type="button"
          >
            <span className="text-4xl transition-transform group-hover:scale-110">
              {type.icon}
            </span>
            <span
              className={cn(
                "font-medium text-sm",
                selectedType === type.id ? "text-primary" : "text-foreground"
              )}
            >
              {type.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
