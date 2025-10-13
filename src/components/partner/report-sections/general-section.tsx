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
import { Textarea } from "@/components/ui/textarea";

export function GeneralSection() {
  return (
    <div className="space-y-8">
      {/* Identification de l'objet */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Identification</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="object_type">
              Type d'objet <span className="text-destructive">*</span>
            </Label>
            <Input disabled id="object_type" readOnly value="Montre" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectBrand">
              Marque <span className="text-destructive">*</span>
            </Label>
            <Input
              id="objectBrand"
              name="objectBrand"
              placeholder="Ex: Rolex"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectModel">
              Modèle <span className="text-destructive">*</span>
            </Label>
            <Input
              id="objectModel"
              name="objectModel"
              placeholder="Ex: Submariner"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectReference">Référence</Label>
            <Input
              id="objectReference"
              name="objectReference"
              placeholder="Ex: 116610LN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_surname">Surnom</Label>
            <Input
              id="object_surname"
              placeholder='Ex: Rolex Submariner "Red"'
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_serial_number">Numéro de série</Label>
            <Input id="object_serial_number" placeholder="Ex: Z123456" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_year">Année de fabrication</Label>
            <Input id="object_year" placeholder="Ex: 2020" type="number" />
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Localisation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="object_country_origin">Lieu d'origine</Label>
            <Input
              id="object_country_origin"
              placeholder="Ex: Boutique Rolex Paris, France"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_country_purchase">
              Lieu d'achat (dernier)
            </Label>
            <Input
              id="object_country_purchase"
              placeholder="Ex: Espagne, Madrid"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_country_actual">Lieu actuel</Label>
            <Input id="object_country_actual" placeholder="Ex: Belgique" />
          </div>
        </div>
      </div>

      {/* Transaction */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Transaction</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="object_transaction_type">Type de transaction</Label>
            <Select>
              <SelectTrigger id="object_transaction_type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Achat</SelectItem>
                <SelectItem value="sale">Vente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_transaction_date">Date de transaction</Label>
            <Input id="object_transaction_date" type="date" />
          </div>

          <div className="col-span-full space-y-2">
            <Label htmlFor="object_transaction_proof">
              Preuves de transactions
            </Label>
            <Textarea
              className="min-h-[80px]"
              id="object_transaction_proof"
              placeholder="Tickets, reçus, confirmations..."
            />
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Historique</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="object_history_owners">
              Historique des propriétaires
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="object_history_owners"
              placeholder="Liste chronologique des propriétaires connus..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_history_sales">
              Historique des achats/ventes
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="object_history_sales"
              placeholder="Ventes aux enchères, transactions privées, etc..."
            />
          </div>
        </div>
      </div>

      {/* Preuve de possession */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Preuve de possession</h3>
        <div className="space-y-2">
          <Label htmlFor="ownership_proof">
            Preuve de possession (2 photos marquées)
          </Label>
          <Textarea
            className="min-h-[80px]"
            id="ownership_proof"
            placeholder="Description des photos de preuve de possession..."
          />
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Documents</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="object_factory_documents">
              Facture d'achat d'origine
            </Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="object_factory_documents"
                placeholder="Aucun fichier sélectionné"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_purchase_documents">
              Facture d'achat hors boutique d'origine
            </Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="object_purchase_documents"
                placeholder="Aucun fichier sélectionné"
                readOnly
              />
              <Button size="icon" type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_add_documents">
              Documents supplémentaires
            </Label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                id="object_add_documents"
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
    </div>
  );
}
