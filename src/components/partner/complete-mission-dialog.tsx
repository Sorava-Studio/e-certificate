"use client";

import { CheckCircle2, FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getCertificationReport } from "@/app/actions/certification-report";
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
import { generateCertificationPDF } from "@/lib/generate-certification-pdf";

type CompleteMissionDialogProps = {
  missionId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceTier: string;
  createdAt: Date;
  onConfirm: (missionId: string) => Promise<void>;
};

export function CompleteMissionDialog({
  missionId,
  clientName,
  clientEmail,
  clientPhone,
  serviceTier,
  createdAt,
  onConfirm,
}: CompleteMissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // Fetch the certification report
      const result = await getCertificationReport(missionId);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      // Generate PDF
      await generateCertificationPDF(
        {
          clientName,
          clientEmail,
          clientPhone,
          serviceTier,
          createdAt,
        },
        result.report || null
      );

      toast.success("PDF généré avec succès");
    } catch {
      toast.error("Erreur lors de la génération du PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      await onConfirm(missionId);
      setOpen(false);
      toast.success("Mission terminée avec succès");
    } catch {
      toast.error("Erreur lors de la finalisation de la mission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Terminer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer la fin de mission</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir terminer la mission pour {clientName} ?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm">
            Cette action marquera la mission comme terminée. Assurez-vous
            d&apos;avoir complété tous les rapports nécessaires avant de
            continuer.
          </p>
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-blue-800 text-xs dark:text-blue-200">
              💡 Vous pouvez télécharger le rapport PDF avant de finaliser la
              mission.
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={isGeneratingPDF || isSubmitting}
            onClick={handleGeneratePDF}
            type="button"
            variant="outline"
          >
            <FileDown className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? "Génération..." : "Télécharger PDF"}
          </Button>
          <div className="flex gap-2">
            <Button
              disabled={isSubmitting || isGeneratingPDF}
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Annuler
            </Button>
            <Button
              disabled={isSubmitting || isGeneratingPDF}
              onClick={handleConfirm}
            >
              {isSubmitting ? "Finalisation..." : "Confirmer"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
