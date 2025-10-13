"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ACCESSORY_OPTIONS = [
  { id: "original_box", label: "Boîte d'origine" },
  { id: "original_documents", label: "Documents d'origine" },
  { id: "warranty_card", label: "Carte de garantie" },
  { id: "manual", label: "Manuel d'utilisation" },
  { id: "extra_links", label: "Maillons supplémentaires" },
  { id: "service_papers", label: "Papiers de révision" },
  { id: "certificate", label: "Certificat d'authenticité" },
  { id: "invoice", label: "Facture" },
  { id: "case", label: "Écrin/Étui" },
  { id: "tools", label: "Outils" },
];

export function AccessoriesSection() {
  return (
    <div className="space-y-8">
      {/* 1. Accessoires inclus */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessories_included">
            La montre est-elle accompagnée d'accessoires ?{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Select required>
            <SelectTrigger id="accessories_included">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Oui</SelectItem>
              <SelectItem value="no">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. Types d'accessoires fournis */}
      <div className="space-y-4">
        <Label>Quels sont les accessoires fournis avec la montre ?</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACCESSORY_OPTIONS.map((accessory) => (
            <div className="flex items-center space-x-2" key={accessory.id}>
              <Checkbox id={`accessories_type_${accessory.id}`} />
              <label
                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={`accessories_type_${accessory.id}`}
              >
                {accessory.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Preuves photos/PDF */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Preuves et Images</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="accessories_proof">Photo/PDF des accessoires</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="accessories_proof"
                placeholder="Aucun fichier sélectionné"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessories_image">Images des accessoires</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="accessories_image"
                placeholder="Aucun fichier sélectionné"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 & 5. Accessoires d'origine (Expert) */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Évaluation Expert</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Accessoires d'origine</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {ACCESSORY_OPTIONS.map((accessory) => (
                <div className="flex items-center space-x-2" key={accessory.id}>
                  <Checkbox id={`accessories_factory_${accessory.id}`} />
                  <label
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor={`accessories_factory_${accessory.id}`}
                  >
                    {accessory.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accessoires non d'origine</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {ACCESSORY_OPTIONS.map((accessory) => (
                <div className="flex items-center space-x-2" key={accessory.id}>
                  <Checkbox id={`accessories_factory_not_${accessory.id}`} />
                  <label
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor={`accessories_factory_not_${accessory.id}`}
                  >
                    {accessory.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Score des accessoires */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Notation Expert</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="accessories_score">
              Score des accessoires (0-1)
            </Label>
            <Input
              id="accessories_score"
              max="1"
              min="0"
              placeholder="Ex: 0.8"
              step="0.1"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              Qualité des documents, boîte, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessories_score_global">
              Score global de la catégorie
            </Label>
            <Input
              id="accessories_score_global"
              placeholder="Ex: 8.5"
              step="0.1"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              Addition des scores de cette catégorie
            </p>
          </div>
        </div>
      </div>

      {/* 7. Commentaire expert */}
      <div className="space-y-2">
        <Label htmlFor="accessories_comment">Commentaire de l'expert</Label>
        <Textarea
          className="min-h-[120px]"
          id="accessories_comment"
          placeholder="Commentaire détaillé sur les accessoires, leur authenticité, leur état..."
        />
      </div>
    </div>
  );
}
