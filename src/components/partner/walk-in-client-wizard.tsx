"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Package,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createWalkInClient } from "@/app/actions/walk-in-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  PRICING_TIERS,
  type ServiceTierId,
} from "@/config/pricing";

type Step = "info" | "service" | "payment";
type PaymentMethod = "cash" | "card_shop" | "stripe";

type ClientFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type WalkInClientData = ClientFormData & {
  serviceId: ServiceTierId;
  paymentMethod: PaymentMethod;
};

const MAX_FEATURES_PREVIEW = 6;

function StepIndicator({
  steps,
  currentStep,
}: {
  steps: Array<{ id: string; label: string; icon: React.ElementType }>;
  currentStep: Step;
}) {
  return (
    <div className="flex items-center justify-between px-4">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted =
          (step.id === "info" &&
            (currentStep === "service" || currentStep === "payment")) ||
          (step.id === "service" && currentStep === "payment");

        let stepClasses = "";
        if (isCompleted) {
          stepClasses = "border-primary bg-primary text-primary-foreground";
        } else if (isActive) {
          stepClasses = "border-primary bg-background text-primary";
        } else {
          stepClasses =
            "border-muted-foreground/30 bg-background text-muted-foreground";
        }

        return (
          <div className="flex flex-1 items-center" key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${stepClasses}`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  isActive || isCompleted
                    ? "font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <Separator
                className={`mx-2 flex-1 ${
                  isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WalkInClientWizard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ClientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [selectedService, setSelectedService] = useState<ServiceTierId | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === "info") {
      // Validate required fields
      if (
        !(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        )
      ) {
        toast.error("Veuillez remplir tous les champs requis");
        return;
      }
      setCurrentStep("service");
    } else if (currentStep === "service") {
      if (!selectedService) {
        toast.error("Veuillez sélectionner un service");
        return;
      }
      setCurrentStep("payment");
    }
  };

  const handleBack = () => {
    if (currentStep === "payment") {
      setCurrentStep("service");
    } else if (currentStep === "service") {
      setCurrentStep("info");
    }
  };

  const handleSubmit = async () => {
    if (!selectedService) {
      toast.error("Veuillez sélectionner un service");
      return;
    }

    if (!paymentMethod) {
      toast.error("Veuillez sélectionner un mode de paiement");
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData: WalkInClientData = {
        ...formData,
        serviceId: selectedService,
        paymentMethod,
      };

      const result = await createWalkInClient(clientData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Handle payment
      if (paymentMethod === "stripe") {
        // Redirect to Stripe checkout or payment page
        toast.info("Redirection vers le paiement Stripe...");
        // TODO: Implement Stripe checkout redirect
      } else {
        toast.success(
          `Client enregistré avec succès! Paiement: ${
            paymentMethod === "cash" ? "Espèces" : "Carte en boutique"
          }`
        );
      }

      // Reset form and close dialog
      resetForm();
      setOpen(false);

      // Refresh the page to show the new mission
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    });
    setSelectedService(null);
    setPaymentMethod(null);
    setCurrentStep("info");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const selectedServiceData =
    selectedService && PRICING_TIERS.find((t) => t.id === selectedService);

  const steps = [
    { id: "info", label: "Informations", icon: UserPlus },
    { id: "service", label: "Service", icon: Package },
    { id: "payment", label: "Paiement", icon: CreditCard },
  ];

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button size="lg">
          <UserPlus className="mr-2 h-5 w-5" />
          Nouveau Client Walk-in
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enregistrer un Client Walk-in</DialogTitle>
          <DialogDescription>
            Processus en {steps.length} étapes pour créer un client et une
            mission
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={steps} />

        <Separator className="my-4" />

        {/* Step Content */}
        <div className="min-h-[400px] py-4">
          {/* Step 1: Client Information */}
          {currentStep === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    Prénom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    onChange={handleChange}
                    placeholder="Jean"
                    required
                    value={formData.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Nom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    onChange={handleChange}
                    placeholder="Dupont"
                    required
                    value={formData.lastName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="jean.dupont@example.com"
                    required
                    type="email"
                    value={formData.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Téléphone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                    required
                    type="tel"
                    value={formData.phone}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  onChange={handleChange}
                  placeholder="123 Rue de la Paix"
                  value={formData.address}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    name="city"
                    onChange={handleChange}
                    placeholder="Paris"
                    value={formData.city}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    onChange={handleChange}
                    placeholder="75001"
                    value={formData.postalCode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    name="country"
                    onChange={handleChange}
                    placeholder="France"
                    value={formData.country}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === "service" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 font-semibold text-lg">
                  Choisissez le service de certification
                </h3>
                <p className="mb-6 text-muted-foreground text-sm">
                  Sélectionnez le niveau de certification adapté aux besoins du
                  client
                </p>
              </div>

              <RadioGroup
                onValueChange={(value: string) =>
                  setSelectedService(value as ServiceTierId)
                }
                value={selectedService || undefined}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Custodia Card */}
                  {PRICING_TIERS.filter((tier) => tier.id === "custodia").map(
                    (tier) => (
                      <Card
                        className={`cursor-pointer transition-all hover:border-primary ${
                          selectedService === tier.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        key={tier.id}
                        onClick={() => setSelectedService(tier.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                {tier.name}
                              </CardTitle>
                              <p className="mt-2 text-muted-foreground text-sm">
                                {tier.tagline}
                              </p>
                            </div>
                            <RadioGroupItem
                              className="mt-1"
                              id={tier.id}
                              value={tier.id}
                            />
                          </div>
                          <div className="mt-4">
                            <span className="font-bold text-3xl">
                              {tier.displayPrice}
                            </span>
                            {tier.note && (
                              <span className="ml-2 text-muted-foreground text-sm">
                                {tier.note}
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {tier.features
                              .slice(0, MAX_FEATURES_PREVIEW)
                              .map((feature) => (
                                <li
                                  className="flex items-start gap-2 text-sm"
                                  key={feature}
                                >
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                          </ul>
                          {tier.features.length > MAX_FEATURES_PREVIEW && (
                            <p className="mt-3 text-muted-foreground text-xs">
                              +{tier.features.length - MAX_FEATURES_PREVIEW}{" "}
                              autres fonctionnalités
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}

                  {/* Imperium Card */}
                  {PRICING_TIERS.filter((tier) => tier.id === "imperium").map(
                    (tier) => (
                      <Card
                        className={`cursor-pointer transition-all hover:border-primary ${
                          selectedService === tier.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        key={tier.id}
                        onClick={() => setSelectedService(tier.id)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">
                                {tier.name}
                              </CardTitle>
                              <p className="mt-2 text-muted-foreground text-sm">
                                {tier.tagline}
                              </p>
                            </div>
                            <RadioGroupItem
                              className="mt-1"
                              id={tier.id}
                              value={tier.id}
                            />
                          </div>
                          <div className="mt-4">
                            <span className="font-bold text-3xl">
                              {tier.displayPrice}
                            </span>
                            {tier.note && (
                              <span className="ml-2 text-muted-foreground text-sm">
                                {tier.note}
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {tier.features
                              .slice(0, MAX_FEATURES_PREVIEW)
                              .map((feature) => (
                                <li
                                  className="flex items-start gap-2 text-sm"
                                  key={feature}
                                >
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                          </ul>
                          {tier.features.length > MAX_FEATURES_PREVIEW && (
                            <p className="mt-3 text-muted-foreground text-xs">
                              +{tier.features.length - MAX_FEATURES_PREVIEW}{" "}
                              autres fonctionnalités
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === "payment" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold text-lg">Mode de paiement</h3>
                <p className="mb-6 text-muted-foreground text-sm">
                  Sélectionnez comment le client souhaite payer
                </p>
              </div>

              {/* Summary */}
              {selectedServiceData && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Récapitulatif</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Client
                      </span>
                      <span className="font-medium text-sm">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Service
                      </span>
                      <span className="font-medium text-sm">
                        {selectedServiceData.name}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg text-primary">
                        {formatPrice(selectedServiceData.price)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Options */}
              <RadioGroup
                onValueChange={(value: string) =>
                  setPaymentMethod(value as PaymentMethod)
                }
                value={paymentMethod || undefined}
              >
                <div className="space-y-3">
                  {/* Cash */}
                  <Card
                    className={`cursor-pointer transition-all hover:border-primary ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Wallet className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Espèces</p>
                          <p className="text-muted-foreground text-xs">
                            Paiement en liquide
                          </p>
                        </div>
                      </div>
                      <RadioGroupItem id="cash" value="cash" />
                    </CardContent>
                  </Card>

                  {/* Card at Shop */}
                  <Card
                    className={`cursor-pointer transition-all hover:border-primary ${
                      paymentMethod === "card_shop"
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setPaymentMethod("card_shop")}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Carte en boutique</p>
                          <p className="text-muted-foreground text-xs">
                            Terminal de paiement
                          </p>
                        </div>
                      </div>
                      <RadioGroupItem id="card_shop" value="card_shop" />
                    </CardContent>
                  </Card>

                  {/* Stripe Online */}
                  <Card
                    className={`cursor-pointer transition-all hover:border-primary ${
                      paymentMethod === "stripe"
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setPaymentMethod("stripe")}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">Paiement en ligne</p>
                          <p className="text-muted-foreground text-xs">
                            Via Stripe (lien de paiement)
                          </p>
                        </div>
                      </div>
                      <RadioGroupItem id="stripe" value="stripe" />
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="flex items-center justify-between">
          <Button
            disabled={currentStep === "info" || isSubmitting}
            onClick={handleBack}
            type="button"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="ghost"
            >
              Annuler
            </Button>

            {currentStep !== "payment" ? (
              <Button onClick={handleNext} type="button">
                Suivant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "Traitement..." : "Confirmer et Payer"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
