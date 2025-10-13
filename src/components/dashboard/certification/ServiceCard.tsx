"use client";

// ============================================
// 🎫 SERVICE CARD
// ============================================
// Display service tier with features and pricing
// ============================================

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/certification-utils";
import { cn } from "@/lib/utils";
import type { ServiceTier } from "@/types/certification";

type ServiceCardProps = ServiceTier & {
  selected: boolean;
  onSelect: () => void;
  imperiumEligible?: boolean;
};

export function ServiceCard({
  id,
  name,
  tagline,
  icon,
  price,
  timeline,
  features,
  status,
  color,
  popular,
  requirements,
  disabled: disabledProp,
  selected,
  onSelect,
  imperiumEligible = true,
}: ServiceCardProps) {
  const isImperium = id === "imperium";
  const disabled = isImperium ? !imperiumEligible : disabledProp;

  const colorClasses = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500",
      text: "text-blue-600",
      bgLight: "bg-blue-50 dark:bg-blue-950/20",
    },
    amber: {
      border: "border-amber-500",
      bg: "bg-amber-500",
      text: "text-amber-600",
      bgLight: "bg-amber-50 dark:bg-amber-950/20",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-500",
      text: "text-green-600",
      bgLight: "bg-green-50 dark:bg-green-950/20",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-500",
      text: "text-purple-600",
      bgLight: "bg-purple-50 dark:bg-purple-950/20",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        selected && `ring-2 ${colors.border} shadow-md`,
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {/* Popular Badge */}
      {popular && (
        <div className={cn("absolute top-0 right-0 px-4 py-1", colors.bg)}>
          <p className="font-semibold text-white text-xs uppercase tracking-wide">
            Populaire
          </p>
        </div>
      )}

      {/* Requirements Badge */}
      {requirements && (
        <div
          className={cn(
            "absolute top-0 left-0 px-4 py-1",
            disabled ? "bg-muted" : colors.bgLight
          )}
        >
          <p
            className={cn(
              "font-semibold text-xs uppercase tracking-wide",
              disabled ? "text-muted-foreground" : colors.text
            )}
          >
            {disabled ? "Non éligible" : requirements}
          </p>
        </div>
      )}

      <div className="p-6 pt-12">
        {/* Icon & Name */}
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-xl">{name}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{tagline}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <p className="font-bold text-3xl">{formatPrice(price)}</p>
          <p className="text-muted-foreground text-sm">{timeline}</p>
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-2">
          {features.map((feature) => (
            <li className="flex items-start gap-2" key={feature}>
              <Check className={cn("mt-0.5 size-4 shrink-0", colors.text)} />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Status Badge */}
        <Badge
          className={cn("mb-4", colors.bgLight, colors.text)}
          variant="outline"
        >
          Statut : {status}
        </Badge>

        {/* Select Button */}
        <Button
          className="w-full"
          disabled={disabled}
          onClick={onSelect}
          type="button"
          variant={selected ? "default" : "outline"}
        >
          {selected ? "Sélectionné" : "Sélectionner"}
        </Button>
      </div>
    </Card>
  );
}
