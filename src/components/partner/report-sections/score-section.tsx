"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function ScoreSection() {
  const [caseScore, setCaseScore] = useState("");
  const [dialScore, setDialScore] = useState("");
  const [strapScore, setStrapScore] = useState("");
  const [movementScore, setMovementScore] = useState("");
  const [technicScore, setTechnicScore] = useState("");

  const calculateFinalScore = () => {
    const scores = [
      Number.parseFloat(caseScore) || 0,
      Number.parseFloat(dialScore) || 0,
      Number.parseFloat(strapScore) || 0,
      Number.parseFloat(movementScore) || 0,
      Number.parseFloat(technicScore) || 0,
    ].filter((score) => score > 0);

    if (scores.length === 0) {
      return 0;
    }
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(average * 10) / 10;
  };

  return (
    <div className="space-y-8">
      {/* ========== SCORES PAR CATÉGORIE ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Scores par Catégorie</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="score_case">Score du boîtier (0-10)</Label>
            <Input
              id="score_case"
              max="10"
              min="0"
              onChange={(e) => setCaseScore(e.target.value)}
              placeholder="Addition finale score boîtier"
              step="0.1"
              type="number"
              value={caseScore}
            />
            <p className="text-muted-foreground text-xs">
              Addition finale du bloc boîtier
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_dial">Score du cadran (0-10)</Label>
            <Input
              id="score_dial"
              max="10"
              min="0"
              onChange={(e) => setDialScore(e.target.value)}
              placeholder="Addition finale score cadran"
              step="0.1"
              type="number"
              value={dialScore}
            />
            <p className="text-muted-foreground text-xs">
              Addition finale du bloc cadran
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_strap">Score du bracelet (0-10)</Label>
            <Input
              id="score_strap"
              max="10"
              min="0"
              onChange={(e) => setStrapScore(e.target.value)}
              placeholder="Addition finale score bracelet"
              step="0.1"
              type="number"
              value={strapScore}
            />
            <p className="text-muted-foreground text-xs">
              Addition finale du bloc bracelet
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_movement">Score du mouvement (0-10)</Label>
            <Input
              id="score_movement"
              max="10"
              min="0"
              onChange={(e) => setMovementScore(e.target.value)}
              placeholder="Addition finale score mouvement"
              step="0.1"
              type="number"
              value={movementScore}
            />
            <p className="text-muted-foreground text-xs">
              Addition finale du bloc mouvement
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_technic">Score technique (0-10)</Label>
            <Input
              id="score_technic"
              max="10"
              min="0"
              onChange={(e) => setTechnicScore(e.target.value)}
              placeholder="Moyenne du score technique"
              step="0.1"
              type="number"
              value={technicScore}
            />
            <p className="text-muted-foreground text-xs">
              Moyenne du score technique
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Score Final sur 100</Label>
              <p className="text-muted-foreground text-xs">
                Moyenne de tous les scores réunis
              </p>
            </div>
            <span className="font-bold text-3xl text-primary">
              {calculateFinalScore()}/10
            </span>
          </div>
        </div>
      </div>

      {/* ========== COMMENTAIRES ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Commentaires et Notes</h2>
          <Separator className="mt-2" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commentaire_condition">
            Commentaire condition/état général de la montre
          </Label>
          <Textarea
            className="min-h-[120px]"
            id="commentaire_condition"
            placeholder="Commentaire détaillé sur la condition et l'état général de la montre..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commentaires_generaux">Commentaires généraux</Label>
          <Textarea
            className="min-h-[120px]"
            id="commentaires_generaux"
            placeholder="Observations générales, remarques particulières..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commentaire_final">
            Commentaire final (fin de formulaire)
          </Label>
          <Textarea
            className="min-h-[150px]"
            id="commentaire_final"
            placeholder="Conclusion finale de l'expertise, recommandations, résumé global..."
          />
        </div>
      </div>

      {/* ========== PHOTOS OBLIGATOIRES ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Photos Obligatoires</h2>
          <Separator className="mt-2" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photos_obligatoires">
            Photos de la montre (multiples)
          </Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="photos_obligatoires"
              multiple
              placeholder="Sélectionner plusieurs fichiers"
              readOnly
              type="file"
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Photos obligatoires : cadran, boîtier, fond, bracelet, mouvement,
            etc.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="mb-2 font-semibold text-sm">Photos recommandées</h3>
          <ul className="ml-4 list-disc space-y-1 text-muted-foreground text-sm">
            <li>Vue complète du cadran</li>
            <li>Vue de profil du boîtier</li>
            <li>Fond de boîte (avec numéros de série si visible)</li>
            <li>Bracelet et fermoir</li>
            <li>Mouvement (si fond transparent ou ouvert)</li>
            <li>Détails spécifiques (gravures, signatures, défauts)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
