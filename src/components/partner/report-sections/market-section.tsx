"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function MarketSection() {
  return (
    <div className="space-y-8">
      {/* ========== MARCHÉ & VALEUR ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Marché & Valeur</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="value_market">
              Valeur intrinsèque du modèle sur le marché (€)
            </Label>
            <Input
              id="value_market"
              placeholder="Ex: 8000"
              step="0.01"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              Valeur de marché moyenne pour ce modèle
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value_estimated">
              Valeur estimée par rapport à l'état (€)
            </Label>
            <Input
              id="value_estimated"
              placeholder="Ex: 7200"
              step="0.01"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              Valeur ajustée selon l'état de la montre
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="liquidity_score">
              Score de liquidité (sur 100)
            </Label>
            <Input
              id="liquidity_score"
              max="100"
              min="0"
              placeholder="Ex: 85"
              type="number"
            />
            <p className="text-muted-foreground text-xs">
              Facilité de revente sur le marché (0-100)
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="mb-2 font-semibold text-sm">Informations</h3>
          <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>Valeur intrinsèque :</strong> Prix moyen observé sur le
              marché pour ce modèle
            </li>
            <li>
              <strong>Valeur estimée :</strong> Ajustée selon l'état, la rareté,
              les accessoires et l'historique
            </li>
            <li>
              <strong>Score de liquidité :</strong> Facilité de revente (100 =
              très liquide, 0 = difficile à vendre)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
