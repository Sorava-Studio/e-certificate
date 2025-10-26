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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const REPAIR_TYPES = [
  { id: "revision", label: "Révision" },
  { id: "polishing", label: "Polissage" },
  { id: "cleaning", label: "Nettoyage" },
  { id: "restoration", label: "Restauration complète" },
  { id: "seal-replacement", label: "Remplacement joints" },
  { id: "crystal-replacement", label: "Remplacement verre" },
  { id: "bracelet-repair", label: "Réparation bracelet" },
  { id: "movement-repair", label: "Réparation mouvement" },
];

const NEXT_REPAIR_TYPES = [
  { id: "revision", label: "Révision complète" },
  { id: "partial-service", label: "Révision partielle" },
  { id: "polishing", label: "Polissage" },
  { id: "cleaning", label: "Nettoyage professionnel" },
  { id: "seal-replacement", label: "Remplacement joints" },
  { id: "crystal-replacement", label: "Remplacement verre" },
  { id: "bracelet-service", label: "Entretien bracelet" },
  { id: "movement-service", label: "Service mouvement" },
  { id: "restoration", label: "Restauration complète" },
];

export function InterventionSection() {
  return (
    <div className="space-y-8">
      {/* ========== DERNIÈRE INTERVENTION ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Dernière Intervention</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="repair_date">
              Date de la dernière intervention
            </Label>
            <Input id="repair_date" placeholder="JJ/MM/AAAA" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repair_factory">Effectuée par</Label>
            <Select>
              <SelectTrigger id="repair_factory">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturer">
                  Maison mère de la marque
                </SelectItem>
                <SelectItem value="authorized">Point agréé</SelectItem>
                <SelectItem value="external">Atelier externe</SelectItem>
                <SelectItem value="unknown">Inconnu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Type d'intervention effectuée
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {REPAIR_TYPES.map((type) => (
              <div className="flex items-center space-x-2" key={type.id}>
                <Checkbox id={`repair_type_${type.id}`} />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor={`repair_type_${type.id}`}
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="repair_proof">Documents d'interventions</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="repair_proof"
              placeholder="Aucun fichier"
              readOnly
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Factures, certificats de service, rapports d'intervention
          </p>
        </div>
      </div>

      {/* ========== PROCHAINE INTERVENTION CONSEILLÉE ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">
            Prochaine Intervention Conseillée
          </h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="next_repair_date">
              Date de l'intervention conseillée
            </Label>
            <Input id="next_repair_date" placeholder="JJ/MM/AAAA" type="date" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Type d'intervention nécessaire
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {NEXT_REPAIR_TYPES.map((type) => (
              <div className="flex items-center space-x-2" key={type.id}>
                <Checkbox id={`next_repair_type_${type.id}`} />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor={`next_repair_type_${type.id}`}
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="next_repair_quote">
            Devis de l'intervention conseillée
          </Label>
          <Textarea
            className="min-h-[120px]"
            id="next_repair_quote"
            placeholder="Détails du devis, pièces à remplacer, coût estimé..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="next_repair_quote_pdf">Devis PDF</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="next_repair_quote_pdf"
                placeholder="Aucun fichier"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_repair_quote_status">Statut du devis</Label>
            <Select>
              <SelectTrigger id="next_repair_quote_status">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="refused">Refusé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="not-applicable">Non applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
