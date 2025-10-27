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

const MOVEMENT_FUNCTIONS = [
  { id: "date", label: "Date" },
  { id: "day", label: "Jour" },
  { id: "month", label: "Mois" },
  { id: "year", label: "Année" },
  { id: "moon-phase", label: "Phase de lune" },
  { id: "chronograph", label: "Chronographe" },
  { id: "gmt", label: "GMT" },
  { id: "power-reserve", label: "Indicateur réserve de marche" },
  { id: "tourbillon", label: "Tourbillon" },
  { id: "minute-repeater", label: "Répétition minutes" },
];

const MOVEMENT_PARTS = [
  { id: "mainspring", label: "Ressort spiral" },
  { id: "balance-wheel", label: "Balancier" },
  { id: "escapement", label: "Échappement" },
  { id: "gear-train", label: "Rouage" },
  { id: "rotor", label: "Rotor" },
  { id: "jewels", label: "Rubis" },
  { id: "crown-wheel", label: "Couronne" },
  { id: "bridge", label: "Pont" },
];

export function MovementSection() {
  return (
    <div className="space-y-8">
      {/* ========== MOUVEMENT ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Mouvement</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="movement_type">Type de mouvement</Label>
            <Select name="movement_type">
              <SelectTrigger id="movement_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatique</SelectItem>
                <SelectItem value="manual">Remontage manuel</SelectItem>
                <SelectItem value="quartz">Quartz</SelectItem>
                <SelectItem value="hybrid">Hybride</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caliber_type">Calibre de base</Label>
            <Input id="caliber_type" name="caliber_type" placeholder="Ex: ETA 2824-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caliber_ref">Référence du calibre</Label>
            <Input id="caliber_ref" name="caliber_ref" placeholder="Ex: 3135" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caliber_jewels">Nombre de pierres</Label>
            <Input id="caliber_jewels" name="caliber_jewels" placeholder="Ex: 31 rubis" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_frequence">Fréquence (Hz)</Label>
            <Input
              id="movement_frequence"
              name="movement_frequence"
              placeholder="Ex: 4 Hz (28800 A/h)"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_power_reserve_factory">
              Réserve de marche annoncée (heures)
            </Label>
            <Input
              id="movement_power_reserve_factory"
              name="movement_power_reserve_factory"
              placeholder="Ex: 48"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caliber_amplitude_factory">
              Amplitude annoncée par le constructeur
            </Label>
            <Input
              id="caliber_amplitude_factory"
              name="caliber_amplitude_factory"
              placeholder="Ex: 250-300°"
              type="number"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Fonctions du mouvement</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {MOVEMENT_FUNCTIONS.map((func) => (
              <div className="flex items-center space-x-2" key={func.id}>
                <Checkbox id={`movement_function_${func.id}`} name={`movement_function_${func.id}`} />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor={`movement_function_${func.id}`}
                >
                  {func.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Origine et Personnalisation
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="caliber_factory">Calibre d'origine ?</Label>
              <Select name="caliber_factory">
                <SelectTrigger id="caliber_factory">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                  <SelectItem value="unknown">Inconnu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caliber_custom">Calibre personnalisé ?</Label>
              <Input
                id="caliber_custom"
                name="caliber_custom"
                placeholder="Description personnalisation"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Changement du calibre</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="caliber_change">Calibre remplacé ?</Label>
              <Select name="caliber_change">
                <SelectTrigger id="caliber_change">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Non</SelectItem>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="partially">Partiellement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caliber_change_date">Date du remplacement</Label>
              <Input id="caliber_change_date" name="caliber_change_date" placeholder="Si disponible" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caliber_change_details">
              Détails du changement
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="caliber_change_details"
              name="caliber_change_details"
              placeholder="Description du changement..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caliber_change_proof">Preuve du changement</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="caliber_change_proof"
                name="caliber_change_proof"
                placeholder="Aucun fichier"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Pièces remplacées</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {MOVEMENT_PARTS.map((part) => (
              <div className="flex items-center space-x-2" key={part.id}>
                <Checkbox id={`movement_part_${part.id}`} name={`movement_part_${part.id}`} />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor={`movement_part_${part.id}`}
                >
                  {part.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Notation et Performance</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="movement_score">Score du mouvement</Label>
              <Input id="movement_score" name="movement_score" placeholder="0-10" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movement_score_precision">Score précision</Label>
              <Input
                id="movement_score_precision"
                name="movement_score_precision"
                placeholder="0-10"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movement_score_global">Score global</Label>
              <Input
                id="movement_score_global"
                name="movement_score_global"
                placeholder="0-10"
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_comment">
              Commentaire expert mouvement
            </Label>
            <Textarea
              className="min-h-[120px]"
              id="movement_comment"
              name="movement_comment"
              placeholder="Analyse du mouvement, état général, révisions effectuées..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
