"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function DialSection() {
  return (
    <div className="space-y-8">
      {/* ========== CADRAN ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Cadran</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dial_type">Type de cadran</Label>
            <Select>
              <SelectTrigger id="dial_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="skeleton">Squelette</SelectItem>
                <SelectItem value="chronograph">Chronographe</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_color">Couleur du cadran</Label>
            <Input id="dial_color" placeholder="Ex: Noir, Bleu, Blanc" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_finition">Finition du cadran</Label>
            <Select>
              <SelectTrigger id="dial_finition">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matte">Matte</SelectItem>
                <SelectItem value="glossy">Brillant</SelectItem>
                <SelectItem value="sunburst">Sunburst</SelectItem>
                <SelectItem value="satin">Satiné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_material">Matériau du cadran</Label>
            <Select>
              <SelectTrigger id="dial_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metal">Métal</SelectItem>
                <SelectItem value="meteorite">Météorite</SelectItem>
                <SelectItem value="silver">Argent</SelectItem>
                <SelectItem value="mother-of-pearl">Nacre</SelectItem>
                <SelectItem value="enamel">Émail</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_texture">Texture du cadran</Label>
            <Select>
              <SelectTrigger id="dial_texture">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smooth">Lisse</SelectItem>
                <SelectItem value="guilloche">Guilloché</SelectItem>
                <SelectItem value="carbon">Carbone</SelectItem>
                <SelectItem value="wave">Vague</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_signature">Signature cadran</Label>
            <Input id="dial_signature" placeholder="Ex: Cartier - Zenith" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_gems">Pierres précieuses sur cadran</Label>
            <Select>
              <SelectTrigger id="dial_gems">
                <SelectValue placeholder="Aucun (par défaut)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                <SelectItem value="diamonds">Diamants</SelectItem>
                <SelectItem value="rubies">Rubis</SelectItem>
                <SelectItem value="sapphires">Saphirs</SelectItem>
                <SelectItem value="emeralds">Émeraudes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_factory">Cadran d'origine ?</Label>
            <Select>
              <SelectTrigger id="dial_factory">
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
            <Label htmlFor="dial_custom">Cadran personnalisé ?</Label>
            <Select>
              <SelectTrigger id="dial_custom">
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
          <h3 className="font-semibold text-base">Luminescence (Lume)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dial_lume_type">Type de luminescence</Label>
              <Input
                id="dial_lume_type"
                placeholder="Tritium, Luminova, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dial_lume_change">Index repeints ?</Label>
              <Select>
                <SelectTrigger id="dial_lume_change">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dial_lume_change_date">Date repeint index</Label>
              <Input id="dial_lume_change_date" placeholder="Si disponible" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dial_score_lume">Score luminescence</Label>
              <Input id="dial_score_lume" placeholder="0-10" type="number" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Patine</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dial_patina_color">Couleur de la patine</Label>
              <Select>
                <SelectTrigger id="dial_patina_color">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  <SelectItem value="tropical">Tropicale</SelectItem>
                  <SelectItem value="brown">Marron</SelectItem>
                  <SelectItem value="cream">Crème</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dial_score_patina">Score patine</Label>
              <Input id="dial_score_patina" placeholder="0-10" type="number" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Changement du cadran</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dial_change">Cadran changé ?</Label>
              <Input id="dial_change" placeholder="Oui/Non" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dial_change_date">Date changement cadran</Label>
              <Input
                id="dial_change_date"
                placeholder="Si disponible"
                type="date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_change_details">
              Détails changement cadran
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="dial_change_details"
              placeholder="Informations sur le changement..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_change_proof">Preuve changement cadran</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="dial_change_proof"
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
          <h3 className="font-semibold text-base">Notation</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dial_score">Score du cadran</Label>
              <Input id="dial_score" placeholder="0-10" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dial_score_global">Score global cadran</Label>
              <Input id="dial_score_global" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dial_comment">Commentaire expert cadran</Label>
            <Textarea
              className="min-h-[120px]"
              id="dial_comment"
              placeholder="Analyse détaillée du cadran..."
            />
          </div>
        </div>
      </div>

      {/* ========== AIGUILLES ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Aiguilles</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hands_type">Type d'aiguilles</Label>
            <Select>
              <SelectTrigger id="hands_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baton">Bâton</SelectItem>
                <SelectItem value="sword">Épée</SelectItem>
                <SelectItem value="dauphine">Dauphine</SelectItem>
                <SelectItem value="leaf">Feuille</SelectItem>
                <SelectItem value="mercedes">Mercedes</SelectItem>
                <SelectItem value="alpha">Alpha</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_factory">Aiguilles d'origine ?</Label>
            <Select>
              <SelectTrigger id="hands_factory">
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
            <Label htmlFor="hands_change">Aiguilles remplacées ?</Label>
            <Select>
              <SelectTrigger id="hands_change">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_change_date">
              Date remplacement aiguilles
            </Label>
            <Input id="hands_change_date" placeholder="Si disponible" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_custom">Aiguilles personnalisées ?</Label>
            <Select>
              <SelectTrigger id="hands_custom">
                <SelectValue placeholder="Non (par défaut)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">Non</SelectItem>
                <SelectItem value="yes">Oui</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_color">Couleur des aiguilles</Label>
            <Select>
              <SelectTrigger id="hands_color">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="silver">Argentée</SelectItem>
                <SelectItem value="gold">Dorée</SelectItem>
                <SelectItem value="blue">Bleue</SelectItem>
                <SelectItem value="black">Noire</SelectItem>
                <SelectItem value="white">Blanche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_material">Matériau des aiguilles</Label>
            <Select>
              <SelectTrigger id="hands_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Acier</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="rhodium">Rhodium</SelectItem>
                <SelectItem value="blued">Acier bleui</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">
            Luminescence des aiguilles
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hands_lume_type">Type de luminescence</Label>
              <Select>
                <SelectTrigger id="hands_lume_type">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tritium">Tritium</SelectItem>
                  <SelectItem value="luminova">Luminova</SelectItem>
                  <SelectItem value="super-luminova">Super-LumiNova</SelectItem>
                  <SelectItem value="chromalight">Chromalight</SelectItem>
                  <SelectItem value="none">Aucune</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hands_lume_change">Aiguilles repeintes ?</Label>
              <Select>
                <SelectTrigger id="hands_lume_change">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hands_lume_change_date">
                Date repeint aiguilles
              </Label>
              <Input
                id="hands_lume_change_date"
                placeholder="Si disponible"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hands_score_lume">
                Score luminescence aiguilles
              </Label>
              <Input id="hands_score_lume" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_lume_change_details">
              Détails repeint aiguilles
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="hands_lume_change_details"
              placeholder="Commentaire sur le changement..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Image et Preuves</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hands_image">Image des aiguilles</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="hands_image"
                  placeholder="Aucun fichier"
                  readOnly
                />
                <Button size="icon" type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hands_change_proof">
                Preuve changement aiguilles
              </Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="hands_change_proof"
                  placeholder="Aucun fichier"
                  readOnly
                />
                <Button size="icon" type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_change_details">
              Détails changement aiguilles
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="hands_change_details"
              placeholder="Description/explications sur le changement..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Notation</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hands_score">Score des aiguilles</Label>
              <Input id="hands_score" placeholder="1-10" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hands_score_global">Score global aiguilles</Label>
              <Input id="hands_score_global" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hands_comment">Commentaire général aiguilles</Label>
            <Textarea
              className="min-h-[120px]"
              id="hands_comment"
              placeholder="Ex: oxydées, état général..."
            />
          </div>
        </div>
      </div>

      {/* ========== INDEX ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Index</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="index_style">Style des index</Label>
            <Select>
              <SelectTrigger id="index_style">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arabic">Chiffres arabes</SelectItem>
                <SelectItem value="roman">Chiffres romains</SelectItem>
                <SelectItem value="stick">Bâtons</SelectItem>
                <SelectItem value="dot">Points</SelectItem>
                <SelectItem value="mixed">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="index_type">Type d'index</Label>
            <Input
              id="index_type"
              placeholder="Appliqué, Imprimé, etc."
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="index_material">Matériau des index</Label>
            <Input
              id="index_material"
              placeholder="Or, Acier, etc."
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="index_factory">Index d'origine ?</Label>
            <Select>
              <SelectTrigger id="index_factory">
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
            <Label htmlFor="index_change">Index changés ?</Label>
            <Select>
              <SelectTrigger id="index_change">
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
          <h3 className="font-semibold text-base">Luminescence des index</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="index_lume">Index luminescents ?</Label>
              <Select>
                <SelectTrigger id="index_lume">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="index_lume_type">
                Type de luminescence index
              </Label>
              <Select>
                <SelectTrigger id="index_lume_type">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tritium">Tritium</SelectItem>
                  <SelectItem value="luminova">Luminova</SelectItem>
                  <SelectItem value="super-luminova">Super-LumiNova</SelectItem>
                  <SelectItem value="none">Aucune</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="index_lume_change">Index repeints ?</Label>
              <Select>
                <SelectTrigger id="index_lume_change">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="index_lume_change_date">Date repeint index</Label>
              <Select>
                <SelectTrigger id="index_lume_change_date">
                  <SelectValue placeholder="Si disponible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Inconnue</SelectItem>
                  <SelectItem value="recent">Récent</SelectItem>
                  <SelectItem value="old">Ancien</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Notation</h3>
          <div className="space-y-2">
            <Label htmlFor="index_score">Score des index</Label>
            <Input id="index_score" placeholder="0-10" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="index_comment">Commentaire expert index</Label>
            <Textarea
              className="min-h-[120px]"
              id="index_comment"
              placeholder="Analyse des index..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
