"use client";

// ============================================
// 🎫 STEP 4: SERVICE SELECTION
// ============================================
// Select certification service tier and options
// ============================================

import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculatePricing, formatPrice } from "@/lib/certification-utils";
import type {
  DeliveryMethod,
  PricingOptions,
  ServiceType,
} from "@/types/certification";
import { INSURANCE_TIERS, SERVICE_TIERS } from "../constants";
import { ServiceCard } from "../ServiceCard";

type Step4ServicesProps = {
  selectedService?: ServiceType;
  onServiceSelect: (service: ServiceType) => void;
  deliveryMethod?: DeliveryMethod;
  onDeliveryMethodChange: (method: DeliveryMethod) => void;
  options?: PricingOptions;
  onToggleOption: (option: keyof NonNullable<PricingOptions>) => void;
  onInsuranceChange: (insurance: string) => void;
  certificationCount?: number;
};

const DEFAULT_OPTIONS: PricingOptions = {};

export function Step4Services({
  selectedService,
  onServiceSelect,
  deliveryMethod,
  onDeliveryMethodChange,
  options,
  onToggleOption,
  onInsuranceChange,
  certificationCount = 0,
}: Step4ServicesProps) {
  // Use default options if none provided, but maintain reference stability
  const currentOptions = options || DEFAULT_OPTIONS;
  const [totalPrice, setTotalPrice] = useState(0);
  const [breakdown, setBreakdown] = useState<
    Array<{ label: string; amount: number }>
  >([]);

  const IMPERIUM_REQUIREMENT = 5;
  const PICKUP_FEE = 15_000;
  const TRANSPORT_PACKAGE_FEE = 15_000;
  const TRANSPORT_KIT_FEE = 2500;
  const NO_EXPERTISE_FEE = 5000;

  const imperiumEligible = certificationCount >= IMPERIUM_REQUIREMENT;
  const showCustodiaOptions = selectedService === "custodia";

  // Recalculate price when service or options change
  useEffect(() => {
    if (!selectedService) {
      return;
    }

    const pricing = calculatePricing(selectedService, currentOptions);
    setTotalPrice(pricing.totalPrice);
    setBreakdown(pricing.breakdown);
  }, [selectedService, currentOptions]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-2xl">Choix du service</h2>
        <p className="text-muted-foreground">
          Sélectionnez le niveau de certification souhaité
        </p>
      </div>

      {/* Service Tiers Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {SERVICE_TIERS.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            imperiumEligible={imperiumEligible}
            onSelect={() => onServiceSelect(service.id)}
            selected={selectedService === service.id}
          />
        ))}
      </div>

      {/* Custodia Additional Options */}
      {showCustodiaOptions && (
        <div className="space-y-6 rounded-lg border bg-card p-6">
          <h3 className="font-semibold text-lg">Options Custodia</h3>

          {/* Delivery Method */}
          <div className="space-y-3">
            <Label>Mode de livraison</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  checked={deliveryMethod === "pickup"}
                  className="size-4 border-gray-300 text-primary focus:ring-primary"
                  id="pickup"
                  name="deliveryMethod"
                  onChange={(e) =>
                    onDeliveryMethodChange(e.target.value as DeliveryMethod)
                  }
                  type="radio"
                  value="pickup"
                />
                <Label className="font-normal" htmlFor="pickup">
                  Pick-up (récupération par EMERA) +{formatPrice(PICKUP_FEE)}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  checked={deliveryMethod === "dropoff"}
                  className="size-4 border-gray-300 text-primary focus:ring-primary"
                  id="dropoff"
                  name="deliveryMethod"
                  onChange={(e) =>
                    onDeliveryMethodChange(e.target.value as DeliveryMethod)
                  }
                  type="radio"
                  value="dropoff"
                />
                <Label className="font-normal" htmlFor="dropoff">
                  Drop-off (dépôt/envoi par client)
                </Label>
              </div>
            </div>
          </div>

          {/* Transport Package (for pickup) */}
          {deliveryMethod === "pickup" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={currentOptions.transportPackage}
                id="transportPackage"
                onCheckedChange={() => onToggleOption("transportPackage")}
              />
              <Label className="font-normal" htmlFor="transportPackage">
                Forfait transport (+{formatPrice(TRANSPORT_PACKAGE_FEE)})
              </Label>
            </div>
          )}

          {/* Transport Kit (for dropoff) */}
          {deliveryMethod === "dropoff" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={currentOptions.transportKit}
                id="transportKit"
                onCheckedChange={() => onToggleOption("transportKit")}
              />
              <Label className="font-normal" htmlFor="transportKit">
                Kit de transport (+{formatPrice(TRANSPORT_KIT_FEE)})
              </Label>
            </div>
          )}

          {/* Insurance */}
          <div className="space-y-3">
            <Label htmlFor="insurance">Assurance (optionnelle)</Label>
            <Select
              onValueChange={onInsuranceChange}
              value={currentOptions.insurance}
            >
              <SelectTrigger id="insurance">
                <SelectValue placeholder="Sélectionner une assurance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune assurance</SelectItem>
                {INSURANCE_TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label} - {formatPrice(tier.price)} ({tier.coverage})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* No Expertise Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={currentOptions.noExpertise}
              id="noExpertise"
              onCheckedChange={() => onToggleOption("noExpertise")}
            />
            <Label className="font-normal" htmlFor="noExpertise">
              Point de contrôle sans expertise (+{formatPrice(NO_EXPERTISE_FEE)}
              )
            </Label>
          </div>

          {/* Info Note */}
          <Alert>
            <Info className="size-4" />
            <div className="ml-2">
              <p className="text-sm">
                Le choix du point de contrôle se fera après validation de votre
                commande. Les frais de transport et d'assurance peuvent varier
                selon la localisation.
              </p>
            </div>
          </Alert>
        </div>
      )}

      {/* Price Summary */}
      {selectedService && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 font-semibold text-lg">Récapitulatif</h3>
          <div className="space-y-2">
            {breakdown.map((item) => (
              <div
                className="flex items-center justify-between text-sm"
                key={item.label}
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{formatPrice(item.amount)}</span>
              </div>
            ))}
            <div className="border-t pt-2">
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
