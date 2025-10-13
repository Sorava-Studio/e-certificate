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

export function CaseSection() {
  return (
    <div className="space-y-8">
      {/* ========== BOÎTIER ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Boîtier</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="case_shape">Forme du boîtier</Label>
            <Select>
              <SelectTrigger id="case_shape">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round">Rond</SelectItem>
                <SelectItem value="square">Carré</SelectItem>
                <SelectItem value="rectangular">Rectangulaire</SelectItem>
                <SelectItem value="tonneau">Tonneau</SelectItem>
                <SelectItem value="cushion">Coussin</SelectItem>
                <SelectItem value="oval">Ovale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_material">Matériau</Label>
            <Select>
              <SelectTrigger id="case_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="steel">Acier</SelectItem>
                <SelectItem value="silver">Argent</SelectItem>
                <SelectItem value="platinum">Platine</SelectItem>
                <SelectItem value="titanium">Titane</SelectItem>
                <SelectItem value="ceramic">Céramique</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="two-tone">Bi-ton</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_diameter">Diamètre (L x l en mm)</Label>
            <Input id="case_diameter" placeholder="Ex: 40 x 38" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_thickness">Épaisseur (mm)</Label>
            <Input id="case_thickness" placeholder="Ex: 12" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lug_width">Largeur entre cornes (mm)</Label>
            <Input id="lug_width" placeholder="Ex: 20" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_number">Numéro de série du boîtier</Label>
            <Input id="case_number" placeholder="Optionnel" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_signature">Marque ou gravure spéciale</Label>
            <Input id="case_signature" placeholder="Gravure particulière" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_hallmark">Poinçon sur le boîtier</Label>
            <Select>
              <SelectTrigger id="case_hallmark">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                <SelectItem value="silver">Argent</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="platinum">Platine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="case_setting">Le boîtier est-il serti ?</Label>
            <Select>
              <SelectTrigger id="case_setting">
                <SelectValue placeholder="Non (par défaut)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">Non</SelectItem>
                <SelectItem value="yes">Oui</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_setting_type">Type de sertissage</Label>
            <Select>
              <SelectTrigger id="case_setting_type">
                <SelectValue placeholder="Si serti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diamonds">Diamants</SelectItem>
                <SelectItem value="emeralds">Émeraudes</SelectItem>
                <SelectItem value="rubies">Rubis</SelectItem>
                <SelectItem value="sapphires">Saphirs</SelectItem>
                <SelectItem value="mixed">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_setting_factory">Sertissage d'origine ?</Label>
            <Select>
              <SelectTrigger id="case_setting_factory">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_surface_plated">Placage de surface</Label>
            <Select>
              <SelectTrigger id="case_surface_plated">
                <SelectValue placeholder="Non (par défaut)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Non</SelectItem>
                <SelectItem value="rhodium">Rhodium</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="silver">Argent</SelectItem>
                <SelectItem value="pvd">PVD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base">Images et Preuves</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="case_image">Image du boîtier</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="case_image"
                  placeholder="Aucun fichier"
                  readOnly
                />
                <Button size="icon" type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_number_image">
                Image numéro de série boîtier
              </Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="case_number_image"
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
              <Label htmlFor="case_factory">Boîtier d'origine ?</Label>
              <Select>
                <SelectTrigger id="case_factory">
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
              <Label htmlFor="case_custom">Boîtier personnalisé ?</Label>
              <Select>
                <SelectTrigger id="case_custom">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_change">
                Le boîtier a-t-il été changé ?
              </Label>
              <Select>
                <SelectTrigger id="case_change">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_change_date">Date du changement</Label>
              <Input id="case_change_date" placeholder="Si disponible" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_polished">
                Le boîtier a-t-il été poli ?
              </Label>
              <Select>
                <SelectTrigger id="case_polished">
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
              <Label htmlFor="case_score">Score du boîtier</Label>
              <Input id="case_score" placeholder="0-10" type="number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_score_global">Score global</Label>
              <Input id="case_score_global" placeholder="0-10" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_change_details">
              Détails sur le changement
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="case_change_details"
              placeholder="Commentaire sur le changement du boîtier..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_polished_details">
              Détails sur le polissage
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="case_polished_details"
              placeholder="Lien avec documents service..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="case_change_proof">Preuve du changement</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="case_change_proof"
                  placeholder="Aucun fichier"
                  readOnly
                />
                <Button size="icon" type="button" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case_polished_proof">Preuve du polissage</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  id="case_polished_proof"
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
            <Label htmlFor="case_comment">
              Commentaire expert sur le boîtier
            </Label>
            <Textarea
              className="min-h-[120px]"
              id="case_comment"
              placeholder="Analyse détaillée du boîtier..."
            />
          </div>
        </div>
      </div>

      {/* ========== COURONNE ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Couronne</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crown_type">Type de couronne</Label>
            <Select>
              <SelectTrigger id="crown_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="screw">Vissée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_pusher">Nombre de poussoirs</Label>
            <Input id="case_pusher" placeholder="Ex: 2" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crown_factory">Couronne d'origine ?</Label>
            <Select>
              <SelectTrigger id="crown_factory">
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
            <Label htmlFor="crown_change">Couronne changée ?</Label>
            <Select>
              <SelectTrigger id="crown_change">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crown_change_date">
              Date du changement couronne
            </Label>
            <Input id="crown_change_date" placeholder="Si disponible" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case_pusher_score">État des poussoirs</Label>
            <Input
              id="case_pusher_score"
              placeholder="Score 0-10"
              type="number"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="crown_change_details">
            Détails changement couronne
          </Label>
          <Textarea
            className="min-h-[80px]"
            id="crown_change_details"
            placeholder="Informations sur le changement..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="crown_change_proof">Preuve changement couronne</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="crown_change_proof"
              placeholder="Aucun fichier"
              readOnly
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="crown_comment">Commentaire expert couronne</Label>
          <Textarea
            className="min-h-[120px]"
            id="crown_comment"
            placeholder="Analyse de la couronne et des poussoirs..."
          />
        </div>
      </div>

      {/* ========== FOND ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Fond de boîte</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="caseback_type">Type de fond</Label>
            <Select>
              <SelectTrigger id="caseback_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="snap">Clipsé</SelectItem>
                <SelectItem value="screw">Vissé</SelectItem>
                <SelectItem value="transparent">Transparent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseback_material">Matériau du fond</Label>
            <Select>
              <SelectTrigger id="caseback_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Acier</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="titanium">Titane</SelectItem>
                <SelectItem value="sapphire">Saphir</SelectItem>
                <SelectItem value="mineral">Verre minéral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseback_factory">Fond d'origine ?</Label>
            <Select>
              <SelectTrigger id="caseback_factory">
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
            <Label htmlFor="caseback_hallmark">Poinçon fond de boîte</Label>
            <Select>
              <SelectTrigger id="caseback_hallmark">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseback_change">Fond changé ?</Label>
            <Select>
              <SelectTrigger id="caseback_change">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseback_change_date">Date changement fond</Label>
            <Input id="caseback_change_date" placeholder="Si disponible" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseback_signature">Gravure ou signature</Label>
          <Input
            id="caseback_signature"
            placeholder="Description de la gravure"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="caseback_image">Image du fond</Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="caseback_image"
                placeholder="Aucun fichier"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseback_change_proof">
              Preuve changement fond
            </Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="caseback_change_proof"
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
          <Label htmlFor="caseback_change_details">
            Détails changement fond
          </Label>
          <Textarea
            className="min-h-[80px]"
            id="caseback_change_details"
            placeholder="Informations sur le changement..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="caseback_comment">Commentaire expert fond</Label>
          <Textarea
            className="min-h-[120px]"
            id="caseback_comment"
            placeholder="Analyse du fond de boîte..."
          />
        </div>
      </div>

      {/* ========== LUNETTE ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Lunette</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bezel_type">Type de lunette</Label>
            <Select>
              <SelectTrigger id="bezel_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smooth">Lisse</SelectItem>
                <SelectItem value="fluted">Cannelée</SelectItem>
                <SelectItem value="rotating">Rotative</SelectItem>
                <SelectItem value="ceramic">Céramique</SelectItem>
                <SelectItem value="gem-set">Sertie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_material">Matériau de la lunette</Label>
            <Select>
              <SelectTrigger id="bezel_material">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Acier</SelectItem>
                <SelectItem value="gold">Or</SelectItem>
                <SelectItem value="ceramic">Céramique</SelectItem>
                <SelectItem value="aluminum">Aluminium</SelectItem>
                <SelectItem value="platinum">Platine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_factory">Lunette d'origine ?</Label>
            <Select>
              <SelectTrigger id="bezel_factory">
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
            <Label htmlFor="bezel_custom">Lunette personnalisée ?</Label>
            <Select>
              <SelectTrigger id="bezel_custom">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_setting">Lunette sertie ?</Label>
            <Select>
              <SelectTrigger id="bezel_setting">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_setting_type">Type de sertissage</Label>
            <Select>
              <SelectTrigger id="bezel_setting_type">
                <SelectValue placeholder="Si sertie" />
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
            <Label htmlFor="bezel_setting_factory">
              Sertissage d'origine ?
            </Label>
            <Select>
              <SelectTrigger id="bezel_setting_factory">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_change">Lunette changée ?</Label>
            <Input id="bezel_change" placeholder="Oui/Non" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_change_date">Date changement lunette</Label>
            <Input id="bezel_change_date" placeholder="Si disponible" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bezel_score">Score de la lunette</Label>
            <Input id="bezel_score" placeholder="0-10" type="number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bezel_change_details">
            Détails changement lunette
          </Label>
          <Textarea
            className="min-h-[80px]"
            id="bezel_change_details"
            placeholder="Informations sur le changement..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bezel_change_proof">Preuve changement lunette</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              id="bezel_change_proof"
              placeholder="Aucun fichier"
              readOnly
            />
            <Button size="icon" type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bezel_comment">Commentaire expert lunette</Label>
          <Textarea
            className="min-h-[120px]"
            id="bezel_comment"
            placeholder="Analyse de la lunette..."
          />
        </div>
      </div>

      {/* ========== VERRE ========== */}
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-xl">Verre</h2>
          <Separator className="mt-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="crystal_type">Type de verre</Label>
            <Select>
              <SelectTrigger id="crystal_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sapphire">Saphir</SelectItem>
                <SelectItem value="mineral">Verre minéral</SelectItem>
                <SelectItem value="acrylic">Acrylique</SelectItem>
                <SelectItem value="hesalite">Hesalite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crystal_factory">Verre d'origine ?</Label>
            <Select>
              <SelectTrigger id="crystal_factory">
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
            <Label htmlFor="crystal_change">Verre changé ?</Label>
            <Input id="crystal_change" placeholder="Oui/Non/Date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crystal_score">État du verre (1-10)</Label>
            <Input
              id="crystal_score"
              placeholder="Griffé, opaque, etc."
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crystal_score_transparency">
              Score de transparence
            </Label>
            <Input
              id="crystal_score_transparency"
              placeholder="0-10"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crystal_score_global">Score global verre</Label>
            <Input id="crystal_score_global" placeholder="0-10" type="number" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="crystal_comment">Commentaire expert verre</Label>
          <Textarea
            className="min-h-[120px]"
            id="crystal_comment"
            placeholder="Analyse du verre, griffures, transparence..."
          />
        </div>
      </div>
    </div>
  );
}
