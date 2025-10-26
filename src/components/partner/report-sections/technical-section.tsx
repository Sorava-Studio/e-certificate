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

const RUST_ZONES = [
  { id: "case", label: "Boîtier" },
  { id: "bracelet", label: "Bracelet" },
  { id: "movement", label: "Mouvement" },
  { id: "caseback", label: "Fond" },
  { id: "crown", label: "Couronne" },
  { id: "clasp", label: "Fermoir" },
];

const LEAK_ZONES = [
  { id: "caseback", label: "Fond" },
  { id: "crown", label: "Couronne" },
  { id: "pushers", label: "Poussoirs" },
  { id: "crystal", label: "Verre" },
  { id: "multiple", label: "Multiple" },
];

export function TechnicalSection() {
  return (
    <div className="space-y-8">
      {/* ========== POIDS ET DIMENSIONS ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Poids et Dimensions</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="object_weight">Poids de la montre</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="object_weight"
                placeholder="Ex: 150"
                type="number"
              />
              <Select>
                <SelectTrigger className="w-24" id="object_weight_value">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_weight">Poids du boîtier</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="case_weight"
                placeholder="Ex: 80"
                type="number"
              />
              <Select>
                <SelectTrigger className="w-24" id="case_weight_value">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_weight">Poids du bracelet</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="strap_weight"
                placeholder="Ex: 60"
                type="number"
              />
              <Select>
                <SelectTrigger className="w-24" id="strap_weight_value">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_weight">Poids du mouvement/calibre</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="movement_weight"
                placeholder="Ex: 10"
                type="number"
              />
              <Select>
                <SelectTrigger className="w-24" id="movement_weight_value">
                  <SelectValue placeholder="g" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PERFORMANCE DU MOUVEMENT ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Performance du Mouvement</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="caliber_amplitude">Amplitude observée (°)</Label>
            <Input id="caliber_amplitude" placeholder="Ex: 280" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_daily_variation">
              Dérive journalière observée (s/j)
            </Label>
            <Input
              id="movement_daily_variation"
              placeholder="Ex: +2 ou -3"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_power_reserve_test">
              Réserve de marche observée (h)
            </Label>
            <Input
              id="movement_power_reserve_test"
              placeholder="Ex: 48"
              type="number"
            />
          </div>
        </div>
      </div>

      {/* ========== ÉTANCHÉITÉ ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Étanchéité</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="water_resistance">
              Résistance annoncée par le fabricant
            </Label>
            <Select>
              <SelectTrigger id="water_resistance">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">30m (3 ATM)</SelectItem>
                <SelectItem value="50m">50m (5 ATM)</SelectItem>
                <SelectItem value="100m">100m (10 ATM)</SelectItem>
                <SelectItem value="200m">200m (20 ATM)</SelectItem>
                <SelectItem value="300m">300m (30 ATM)</SelectItem>
                <SelectItem value="500m">500m (50 ATM)</SelectItem>
                <SelectItem value="1000m">1000m (100 ATM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_resistance_test">
              Étanchéité déclarée (PASS/FAIL)
            </Label>
            <Select>
              <SelectTrigger id="water_resistance_test">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pass">PASS</SelectItem>
                <SelectItem value="fail">FAIL</SelectItem>
                <SelectItem value="not-tested">Non testé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_resistance_score">Score étanchéité</Label>
            <Input
              id="water_resistance_score"
              placeholder="0-10"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_resistance_date">Date du dernier test</Label>
            <Input
              id="water_resistance_date"
              placeholder="JJ/MM/AAAA"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_resistance_details">
              Pression testée (bar)
            </Label>
            <Input id="water_resistance_details" placeholder="Ex: 10 bar" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water_resistance_leak">
              Fuite mesurée (si disponible)
            </Label>
            <Select>
              <SelectTrigger id="water_resistance_leak">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Déformation du boîtier</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="water_resistance_case_before">
                Avant test (µm)
              </Label>
              <Input
                id="water_resistance_case_before"
                placeholder="Ex: 100"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water_resistance_case_after">
                Après test (µm)
              </Label>
              <Input
                id="water_resistance_case_after"
                placeholder="Ex: 105"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water_resistance_case">Variation (µm)</Label>
              <Input
                id="water_resistance_case"
                placeholder="Calculée"
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Zones suspectes identifiées
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {LEAK_ZONES.map((zone) => (
              <div className="flex items-center space-x-2" key={zone.id}>
                <Checkbox id={`leak_zone_${zone.id}`} />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor={`leak_zone_${zone.id}`}
                >
                  {zone.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="water_resistance_proof">Rapport/Ticket du test</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="water_resistance_proof"
              placeholder="Aucun fichier"
              readOnly
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ========== JOINTS ET LUBRIFICATION ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Joints et Lubrification</h2>
          <Separator className="mt-2" />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Joints du boîtier</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="case_joint">Joints présents</Label>
              <Select>
                <SelectTrigger id="case_joint">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous présents</SelectItem>
                  <SelectItem value="partial">Partiellement</SelectItem>
                  <SelectItem value="missing">Manquants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_joint_score">Score des joints</Label>
              <Input id="case_joint_score" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_joint_comment">État des joints</Label>
            <Select>
              <SelectTrigger id="case_joint_comment">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ras">RAS</SelectItem>
                <SelectItem value="dry">Secs</SelectItem>
                <SelectItem value="cracked">Fissurés</SelectItem>
                <SelectItem value="crushed">Écrasés</SelectItem>
                <SelectItem value="contaminated">Contaminés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_joint_service">Joints à remplacer</Label>
            <Textarea
              className="min-h-[60px]"
              id="case_joint_service"
              placeholder="Liste des joints à changer..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Lubrification du boîtier</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="case_oil">Lubrification joints</Label>
              <Select>
                <SelectTrigger id="case_oil">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Présente</SelectItem>
                  <SelectItem value="absent">Absente</SelectItem>
                  <SelectItem value="to-redo">À refaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_oil_score">Score lubrification</Label>
              <Input id="case_oil_score" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_oil_comment">État des huiles boîtier</Label>
            <Textarea
              className="min-h-[60px]"
              id="case_oil_comment"
              placeholder="État des huiles..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_oil_service">Huiles boîtier à changer</Label>
            <Textarea
              className="min-h-[60px]"
              id="case_oil_service"
              placeholder="Liste des huiles à changer..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Lubrification du mouvement
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="movement_oil">Lubrification calibre</Label>
              <Select>
                <SelectTrigger id="movement_oil">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Présente</SelectItem>
                  <SelectItem value="absent">Absente</SelectItem>
                  <SelectItem value="to-redo">À refaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="movement_oil_score">
                Score lubrification mouvement
              </Label>
              <Input id="movement_oil_score" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_oil_comment">
              État des huiles mouvement
            </Label>
            <Textarea
              className="min-h-[60px]"
              id="movement_oil_comment"
              placeholder="État des huiles..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement_oil_service">
              Huiles mouvement à changer
            </Label>
            <Textarea
              className="min-h-[60px]"
              id="movement_oil_service"
              placeholder="Liste des huiles à changer..."
            />
          </div>
        </div>
      </div>

      {/* ========== ROUILLE ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Rouille et Corrosion</h2>
          <Separator className="mt-2" />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Zones où de la rouille est présente
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {RUST_ZONES.map((zone) => (
              <div className="flex items-center space-x-2" key={zone.id}>
                <Checkbox id={`rust_zone_${zone.id}`} />
                <Label
                  className="cursor-pointer font-normal"
                  htmlFor={`rust_zone_${zone.id}`}
                >
                  {zone.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
