"use client";

// ============================================
// 🎫 STEP 2: BASIC INFORMATION
// ============================================
// Enter object details and information
// ============================================

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Step2DetailsProps = {
  brand: string;
  model: string;
  reference?: string;
  price: number;
  hasDocuments: boolean;
  hasAccessories: boolean;
  notes?: string;
  onUpdate: (data: {
    brand: string;
    model: string;
    reference?: string;
    price: number;
    hasDocuments: boolean;
    hasAccessories: boolean;
    notes?: string;
  }) => void;
};

const PRICE_THRESHOLD = 10_000;

export function Step2Details({
  brand,
  model,
  reference = "",
  price,
  hasDocuments,
  hasAccessories,
  notes = "",
  onUpdate,
}: Step2DetailsProps) {
  const [formData, setFormData] = useState({
    brand,
    model,
    reference,
    price: price || 0,
    hasDocuments,
    hasAccessories,
    notes,
  });

  const updateField = (field: string, value: string | number | boolean) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const requiresIdentityVerification = formData.price > PRICE_THRESHOLD;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-2xl">Informations de l'objet</h2>
        <p className="text-muted-foreground">
          Renseignez les détails de votre objet
        </p>
      </div>

      <div className="space-y-4">
        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand">
            Marque <span className="text-destructive">*</span>
          </Label>
          <Input
            id="brand"
            onChange={(e) => updateField("brand", e.target.value)}
            placeholder="Ex: Rolex, Hermès, Apple..."
            required
            type="text"
            value={formData.brand}
          />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label htmlFor="model">
            Modèle <span className="text-destructive">*</span>
          </Label>
          <Input
            id="model"
            onChange={(e) => updateField("model", e.target.value)}
            placeholder="Ex: Submariner, Birkin 30..."
            required
            type="text"
            value={formData.model}
          />
        </div>

        {/* Reference */}
        <div className="space-y-2">
          <Label htmlFor="reference">Référence (optionnel)</Label>
          <Input
            id="reference"
            onChange={(e) => updateField("reference", e.target.value)}
            placeholder="Ex: 116610LN"
            type="text"
            value={formData.reference}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">
            Prix estimé (€) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            min="0"
            onChange={(e) => updateField("price", Number(e.target.value))}
            placeholder="Ex: 15000"
            required
            step="100"
            type="number"
            value={formData.price || ""}
          />

          {/* Identity Verification Warning */}
          {requiresIdentityVerification && (
            <Alert
              className="border-amber-500 bg-amber-50 dark:bg-amber-950/20"
              variant="default"
            >
              <AlertTriangle className="size-4 text-amber-600" />
              <div className="ml-2">
                <p className="font-medium text-amber-900 text-sm dark:text-amber-100">
                  Vérification d'identité supplémentaire requise
                </p>
                <p className="text-amber-800 text-xs dark:text-amber-200">
                  Pour les objets de plus de 10 000€, une vérification
                  d'identité supplémentaire est nécessaire (hors B2C)
                </p>
              </div>
            </Alert>
          )}
        </div>

        {/* Documents Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.hasDocuments}
            id="hasDocuments"
            onCheckedChange={(checked) =>
              updateField("hasDocuments", checked === true)
            }
          />
          <Label
            className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="hasDocuments"
          >
            Je possède les documents originaux (certificat d'authenticité,
            facture...)
          </Label>
        </div>

        {/* Accessories Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.hasAccessories}
            id="hasAccessories"
            onCheckedChange={(checked) =>
              updateField("hasAccessories", checked === true)
            }
          />
          <Label
            className="font-normal text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="hasAccessories"
          >
            Je possède les accessoires et/ou la boîte d'origine
          </Label>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes additionnelles (optionnel)</Label>
          <Textarea
            id="notes"
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Ajoutez des informations supplémentaires (historique, état, particularités...)"
            rows={4}
            value={formData.notes}
          />
        </div>
      </div>
    </div>
  );
}
