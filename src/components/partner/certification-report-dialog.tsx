"use client";

import {
  Award,
  Box,
  Clock,
  Cog,
  FileText,
  Info,
  Link2,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type CertificationReportData,
  getCertificationReport,
  saveCertificationReport,
} from "@/app/actions/certification-report";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AccessoriesSection } from "./report-sections/accessories-section";
import { BraceletSection } from "./report-sections/bracelet-section";
import { CaseSection } from "./report-sections/case-section";
import { DialSection } from "./report-sections/dial-section";
import { GeneralSection } from "./report-sections/general-section";
import { InterventionSection } from "./report-sections/intervention-section";
import { MarketSection } from "./report-sections/market-section";
import { MovementSection } from "./report-sections/movement-section";
import { ScoreSection } from "./report-sections/score-section";
import { TechnicalSection } from "./report-sections/technical-section";

type CertificationReportDialogProps = {
  clientName: string;
  missionId: string;
};

type Section =
  | "general"
  | "accessories"
  | "case"
  | "bracelet"
  | "dial"
  | "movement"
  | "technical"
  | "intervention"
  | "market"
  | "score";

const sections = [
  {
    id: "general" as const,
    label: "Infos générales",
    icon: Info,
  },
  {
    id: "accessories" as const,
    label: "Accessoires",
    icon: Package,
  },
  {
    id: "case" as const,
    label: "Boîtier",
    icon: Box,
  },
  {
    id: "bracelet" as const,
    label: "Bracelet",
    icon: Link2,
  },
  {
    id: "dial" as const,
    label: "Cadran",
    icon: Clock,
  },
  {
    id: "movement" as const,
    label: "Mouvement",
    icon: Cog,
  },
  {
    id: "technical" as const,
    label: "Technique",
    icon: Wrench,
    separator: true,
  },
  {
    id: "intervention" as const,
    label: "Intervention",
    icon: Wrench,
  },
  {
    id: "market" as const,
    label: "Marché/Valeur",
    icon: TrendingUp,
  },
  {
    id: "score" as const,
    label: "Score & Commentaire",
    icon: Award,
  },
];

const FORM_FILL_DELAY = 100;

export function CertificationReportDialog({
  clientName,
  missionId,
}: CertificationReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>("general");
  const [existingData, setExistingData] = useState<Record<string, string>>({});

  // Load existing data when dialog opens
  useEffect(() => {
    if (!open) {
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await getCertificationReport(missionId);

        if (result.success && result.report) {
          // Convert report data to a simple key-value object for form defaults
          const dataMap: Record<string, string> = {};
          for (const [key, value] of Object.entries(result.report)) {
            if (value !== null && value !== undefined) {
              dataMap[key] = String(value);
            }
          }
          setExistingData(dataMap);
        }
      } catch {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [open, missionId]);

  // Fill form fields with existing data
  useEffect(() => {
    if (Object.keys(existingData).length === 0) {
      return;
    }

    // Wait for form to render, then fill it
    setTimeout(() => {
      for (const [key, value] of Object.entries(existingData)) {
        const element = document.getElementById(key) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | null;

        if (element) {
          if (element.type === "checkbox") {
            (element as HTMLInputElement).checked = value === "true";
          } else {
            element.value = value;
          }
        }
      }
    }, FORM_FILL_DELAY);
  }, [existingData]);

  const convertFormDataToReport = (
    formData: FormData
  ): CertificationReportData => {
    const reportData: CertificationReportData = {
      missionId,
    };

    // Iterate through all form fields and add them to reportData
    for (const [key, value] of formData.entries()) {
      if (!value || value === "") {
        continue;
      }

      // Handle checkboxes and booleans
      if (value === "on" || value === "true") {
        reportData[key as keyof CertificationReportData] = true as never;
      } else if (value === "false") {
        reportData[key as keyof CertificationReportData] = false as never;
      } else {
        reportData[key as keyof CertificationReportData] = value as never;
      }
    }

    return reportData;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);
      const reportData = convertFormDataToReport(formData);

      const result = await saveCertificationReport(reportData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Rapport enregistré avec succès!");
      setOpen(false);
    } catch {
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSectionContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      );
    }

    // Pass existingData as key to force re-render when data loads
    const key = Object.keys(existingData).length > 0 ? "loaded" : "empty";

    switch (activeSection) {
      case "general":
        return <GeneralSection key={key} />;
      case "accessories":
        return <AccessoriesSection key={key} />;
      case "case":
        return <CaseSection key={key} />;
      case "bracelet":
        return <BraceletSection key={key} />;
      case "dial":
        return <DialSection key={key} />;
      case "movement":
        return <MovementSection key={key} />;
      case "technical":
        return <TechnicalSection key={key} />;
      case "intervention":
        return <InterventionSection key={key} />;
      case "market":
        return <MarketSection key={key} />;
      case "score":
        return <ScoreSection key={key} />;
      default:
        return null;
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-6xl p-0">
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <div className="flex w-64 flex-col border-r bg-muted/40">
            <div className="shrink-0 border-b p-6">
              <DialogTitle>Rapport de Certification</DialogTitle>
              <DialogDescription className="mt-2">
                {clientName}
              </DialogDescription>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-4">
                {sections.map((section) => (
                  <div key={section.id}>
                    {section.separator && <Separator className="my-4" />}
                    <Button
                      className={cn(
                        "w-full justify-start gap-3",
                        activeSection === section.id &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                      onClick={() => setActiveSection(section.id)}
                      size="sm"
                      variant={
                        activeSection === section.id ? "default" : "ghost"
                      }
                    >
                      <section.icon className="h-4 w-4" />
                      {section.label}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <DialogHeader className="shrink-0 border-b p-6">
              <DialogTitle>
                {sections.find((s) => s.id === activeSection)?.label}
              </DialogTitle>
            </DialogHeader>
            <form
              className="flex flex-1 flex-col overflow-hidden"
              onSubmit={handleSubmit}
            >
              <div className="flex-1 overflow-y-auto p-6">
                {renderSectionContent()}
              </div>
              <DialogFooter className="shrink-0 border-t p-6">
                <Button
                  disabled={isSubmitting}
                  onClick={() => setOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Annuler
                </Button>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting
                    ? "Enregistrement..."
                    : "Enregistrer le Rapport"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
