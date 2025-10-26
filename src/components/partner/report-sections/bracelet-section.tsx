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

export function BraceletSection() {
  return (
    <div className="space-y-8">
      {/* ========== BRACELET ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Bracelet</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="strap_type">Type de bracelet</Label>
            <Select>
              <SelectTrigger id="strap_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oyster">Oyster</SelectItem>
                <SelectItem value="jubilee">Jubilé</SelectItem>
                <SelectItem value="president">President</SelectItem>
                <SelectItem value="nato">NATO</SelectItem>
                <SelectItem value="leather">Cuir</SelectItem>
                <SelectItem value="rubber">Caoutchouc</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_material">Matériau du bracelet</Label>
            <Select>
              <SelectTrigger id="strap_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Acier</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="platinum">Platine</SelectItem>
                <SelectItem value="titanium">Titane</SelectItem>
                <SelectItem value="rubber">Caoutchouc</SelectItem>
                <SelectItem value="leather">Cuir</SelectItem>
                <SelectItem value="ceramic">Céramique</SelectItem>
                <SelectItem value="two-tone">Bi-ton</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_color">Couleur du bracelet</Label>
            <Input id="strap_color" placeholder="Ex: Noir, Marron, Bleu" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_length">Longueur du bracelet</Label>
            <Input id="strap_length" placeholder="En mm ou taille" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_reference">Référence du bracelet</Label>
            <Input
              id="strap_reference"
              placeholder='Ex: Gay Frères, Rolex "Pateted"'
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_number">Numéro de série du bracelet</Label>
            <Input id="strap_number" placeholder="Si disponible" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_hallmark">Poinçon du bracelet</Label>
            <Input id="strap_hallmark" placeholder="Poinçon expert" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_factory">Bracelet d'origine ?</Label>
            <Select>
              <SelectTrigger id="strap_factory">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
                <SelectItem value="unknown">Inconnu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="strap_setting">Le bracelet est-il serti ?</Label>
            <Select>
              <SelectTrigger id="strap_setting">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_setting_type">Type de sertissage</Label>
            <Select>
              <SelectTrigger id="strap_setting_type">
                <SelectValue placeholder="Si serti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diamonds">Diamants</SelectItem>
                <SelectItem value="emeralds">Émeraudes</SelectItem>
                <SelectItem value="rubies">Rubis</SelectItem>
                <SelectItem value="sapphires">Saphirs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_setting_factory">
              Sertissage d'origine ?
            </Label>
            <Select>
              <SelectTrigger id="strap_setting_factory">
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
          <h3 className="font-semibold text-base">Maillons End-Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strap_endlinks">
                Nombre de maillons end-links
              </Label>
              <Input
                id="strap_endlinks"
                placeholder="Fournis/attachés"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strap_endlinks_reference">
                Référence des maillons
              </Label>
              <Input id="strap_endlinks_reference" placeholder="Référence" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Images et Preuves</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strap_image">Image du bracelet</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="strap_image"
                  placeholder="Aucun fichier"
                  readOnly
                />
                <Button size="icon" type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strap_number_image">
                Image numéro de série bracelet
              </Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="strap_number_image"
                  placeholder="Aucun fichier"
                  readOnly
                />
                <Button size="icon" type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Évaluation Expert</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strap_change">Bracelet changé ?</Label>
              <Select>
                <SelectTrigger id="strap_change">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strap_change_date">Date du changement</Label>
              <Input id="strap_change_date" placeholder="Si disponible" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strap_score">Score du bracelet</Label>
              <Input id="strap_score" placeholder="0-10" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strap_score_global">Score global</Label>
              <Input id="strap_score_global" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_change_details">
              Détails sur le changement
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="strap_change_details"
              placeholder="Informations sur le changement du bracelet..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_change_proof">Preuve du changement</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="strap_change_proof"
                placeholder="Aucun fichier"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strap_comment">Commentaire expert bracelet</Label>
            <Textarea
              className="min-h-[120px]"
              id="strap_comment"
              placeholder="Analyse détaillée du bracelet..."
            />
          </div>
        </div>
      </div>

      {/* ========== ENTRE-CORNES ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Entre-cornes</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="endlinks_reference">Référence endlinks</Label>
            <Input id="endlinks_reference" placeholder="Référence" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="spring_bar_type">Type de barres à ressort</Label>
            <Select>
              <SelectTrigger id="spring_bar_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="quick-release">Quick Release</SelectItem>
                <SelectItem value="screw">Vissées</SelectItem>
                <SelectItem value="original">Originales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ========== FERMOIR ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Fermoir</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fermoir_type">Type de fermoir</Label>
            <Select>
              <SelectTrigger id="fermoir_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deployant">Déployant</SelectItem>
                <SelectItem value="buckle">Boucle ardillon</SelectItem>
                <SelectItem value="butterfly">Papillon</SelectItem>
                <SelectItem value="folding">Pliant</SelectItem>
                <SelectItem value="safety">Sécurité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clasp_type">Système de fermeture</Label>
            <Select>
              <SelectTrigger id="clasp_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oysterlock">Oysterlock</SelectItem>
                <SelectItem value="crownclasp">Crownclasp</SelectItem>
                <SelectItem value="oysterclasp">Oysterclasp</SelectItem>
                <SelectItem value="glidelock">Glidelock</SelectItem>
                <SelectItem value="easylink">Easylink</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clasp_material">Matériau du fermoir</Label>
            <Select>
              <SelectTrigger id="clasp_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Acier</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="platinum">Platine</SelectItem>
                <SelectItem value="titanium">Titane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clasp_factory">Fermoir d'origine ?</Label>
            <Select>
              <SelectTrigger id="clasp_factory">
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
            <Label htmlFor="clasp_change">Fermoir changé ?</Label>
            <Select>
              <SelectTrigger id="clasp_change">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clasp_change_date">Date changement fermoir</Label>
            <Input id="clasp_change_date" placeholder="Si disponible" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clasp_score">Score du fermoir</Label>
            <Input id="clasp_score" placeholder="0-10" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clasp_score_globale">Score global fermoir</Label>
            <Input id="clasp_score_globale" placeholder="0-10" type="number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clasp_image">Image du fermoir</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="clasp_image"
              placeholder="Aucun fichier"
              readOnly
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clasp_change_details">
            Détails changement fermoir
          </Label>
          <Textarea
            className="min-h-[80px]"
            id="clasp_change_details"
            placeholder="Informations sur le changement..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clasp_change_proof">Preuve changement fermoir</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="clasp_change_proof"
              placeholder="Aucun fichier"
              readOnly
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clasp_comment">Commentaire expert fermoir</Label>
          <Textarea
            className="min-h-[120px]"
            id="clasp_comment"
            placeholder="Analyse du fermoir..."
          />
        </div>
      </div>
    </div>
  );
}
