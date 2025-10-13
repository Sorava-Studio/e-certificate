"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  checkDuplicateSerialNumber,
  createItem,
  saveDraft,
} from "@/app/actions/items";
import { ItemDetailsFields } from "@/components/forms/item-details-fields";
import { WatchPhotoUpload } from "@/components/forms/watch-photo-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { createItemSchema } from "@/validations/item";

type FormData = z.infer<typeof createItemSchema>;

type Step = "details" | "photos" | "complete";

export function ItemRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isCheckingSerial, setIsCheckingSerial] = useState(false);
  const [serialError, setSerialError] = useState<string | null>(null);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      type: "watch",
      purchaseDate: new Date(),
    },
  });

  // Check for duplicate serial number on blur
  const handleSerialNumberBlur = async () => {
    const serialNumber = watch("serialNumber");

    if (!serialNumber || serialNumber.trim() === "") {
      return;
    }

    setIsCheckingSerial(true);
    setSerialError(null);

    const result = await checkDuplicateSerialNumber(serialNumber);

    if (result.success && result.data.exists) {
      setSerialError("An item with this serial number already exists");
    }

    setIsCheckingSerial(false);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const result = await createItem(data);

    if (result.success) {
      setCreatedItemId(result.data.id);
      setCurrentStep("photos"); // Move to photo upload step
    } else {
      setSerialError(result.error || "Failed to create item");
    }

    setIsSubmitting(false);
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);

    const formData = watch();
    const result = await saveDraft({
      ...formData,
      status: "draft",
    });

    if (result.success) {
      router.push("/dashboard/certificates");
    } else {
      setSerialError(result.error || "Failed to save draft");
    }

    setIsDraftSaving(false);
  };

  const handlePhotoUploadComplete = () => {
    setCurrentStep("complete");
    setShowSuccessSheet(true);
  };

  const handleSkipPhotos = () => {
    setCurrentStep("complete");
    setShowSuccessSheet(true);
  };

  return (
    <>
      {/* Step 1: Item Details */}
      {currentStep === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Register Your Luxury Item</CardTitle>
            <CardDescription>
              Fill in the details below to register your watch, jewelry, or
              other luxury item for certification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <ItemDetailsFields
                errors={errors}
                isCheckingSerial={isCheckingSerial}
                onSerialNumberBlur={handleSerialNumberBlur}
                register={register}
                serialError={serialError}
                setValue={setValue}
                watch={watch}
              />

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  disabled={isSubmitting || isDraftSaving || !!serialError}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating Item...
                    </>
                  ) : (
                    "Continue to Photos"
                  )}
                </Button>
                <Button
                  disabled={isDraftSaving || isSubmitting}
                  onClick={handleSaveDraft}
                  type="button"
                  variant="outline"
                >
                  {isDraftSaving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save as Draft"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Upload Photos */}
      {currentStep === "photos" && createdItemId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Watch Photos</CardTitle>
            <CardDescription>
              Upload 3-10 clear photos of your item for verification. Include
              front dial, case back with serial number, and any unique features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WatchPhotoUpload
              itemId={createdItemId}
              onUploadComplete={handlePhotoUploadComplete}
            />
            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleSkipPhotos}
                type="button"
                variant="outline"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Sheet */}
      <Sheet onOpenChange={setShowSuccessSheet} open={showSuccessSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Item Registered Successfully!</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p className="text-muted-foreground">
              Your item has been registered and submitted for verification.
              You'll receive a notification once the verification process is
              complete.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowSuccessSheet(false);
                  router.push("/dashboard/certificates");
                }}
              >
                View My Items
              </Button>
              <Button
                onClick={() => {
                  setShowSuccessSheet(false);
                  if (createdItemId) {
                    router.push(`/dashboard/certificates/${createdItemId}`);
                  }
                }}
                variant="outline"
              >
                View Certificate
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
