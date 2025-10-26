"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createWalkInClient } from "@/app/actions/walk-in-client";
import { Button } from "@/components/ui/button";
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

export function WalkInClientDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createWalkInClient(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Client walk-in enregistré avec succès!");

      // Reset form and close dialog
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
      setOpen(false);

      // Refresh the page to show the new mission
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="lg">
          <UserPlus className="mr-2 h-5 w-5" />
          Nouveau Client Walk-in
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enregistrer un Client Walk-in</DialogTitle>
          <DialogDescription>
            Saisissez les informations du client qui se présente en boutique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Annuler
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Enregistrement..." : "Enregistrer le Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
