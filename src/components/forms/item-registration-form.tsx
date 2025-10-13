"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  checkDuplicateSerialNumber,
  createItem,
  saveDraft,
} from "@/app/actions/items";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  createItemSchema,
  ITEM_TYPES,
  JEWELRY_BRANDS,
  WATCH_BRANDS,
} from "@/validations/item";

type FormData = z.infer<typeof createItemSchema>;

export function ItemRegistrationForm() {
  const router = useRouter();
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

  const selectedType = watch("type");
  const purchaseDate = watch("purchaseDate");
  const serialNumber = watch("serialNumber");

  // Check for duplicate serial number on blur
  const handleSerialNumberBlur = async () => {
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
      setShowSuccessSheet(true);
    } else {
      alert(result.error);
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
      alert(result.error);
    }

    setIsDraftSaving(false);
  };

  const getBrands = () => {
    if (selectedType === "watch") {
      return WATCH_BRANDS;
    }
    if (selectedType === "jewelry") {
      return JEWELRY_BRANDS;
    }
    return [];
  };
  const brands = getBrands();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Register Your Luxury Item</CardTitle>
          <CardDescription>
            Fill in the details below to register your watch, jewelry, or other
            luxury item for certification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Item Type */}
            <FieldGroup>
              <FieldLabel htmlFor="type">Item Type *</FieldLabel>
              <Select
                onValueChange={(value: string) =>
                  setValue("type", value as FormData["type"])
                }
                value={selectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <FieldError>{errors.type.message}</FieldError>}
            </FieldGroup>

            {/* Brand */}
            <FieldGroup>
              <FieldLabel htmlFor="brand">Brand *</FieldLabel>
              {brands.length > 0 ? (
                <Select
                  onValueChange={(value: string) => setValue("brand", value)}
                  value={watch("brand")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  {...register("brand")}
                  placeholder="Enter brand name"
                  type="text"
                />
              )}
              {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
            </FieldGroup>

            {/* Model */}
            <FieldGroup>
              <FieldLabel htmlFor="model">Model *</FieldLabel>
              <Input
                {...register("model")}
                placeholder="e.g., Submariner, Love Bracelet"
                type="text"
              />
              {errors.model && <FieldError>{errors.model.message}</FieldError>}
            </FieldGroup>

            {/* Reference Number */}
            <FieldGroup>
              <FieldLabel htmlFor="referenceNumber">
                Reference Number *
              </FieldLabel>
              <Input
                {...register("referenceNumber")}
                placeholder="e.g., 126610LN"
                type="text"
              />
              <FieldDescription>
                The manufacturer's reference or model number
              </FieldDescription>
              {errors.referenceNumber && (
                <FieldError>{errors.referenceNumber.message}</FieldError>
              )}
            </FieldGroup>

            {/* Serial Number */}
            <FieldGroup>
              <FieldLabel htmlFor="serialNumber">Serial Number *</FieldLabel>
              <div className="relative">
                <Input
                  {...register("serialNumber")}
                  onBlur={handleSerialNumberBlur}
                  placeholder="Unique serial number"
                  type="text"
                />
                {isCheckingSerial && (
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <FieldDescription>
                This must be unique to your item
              </FieldDescription>
              {serialError && <FieldError>{serialError}</FieldError>}
              {errors.serialNumber && (
                <FieldError>{errors.serialNumber.message}</FieldError>
              )}
            </FieldGroup>

            {/* Year Manufactured */}
            <FieldGroup>
              <FieldLabel htmlFor="yearManufactured">
                Year of Manufacture *
              </FieldLabel>
              <Input
                {...register("yearManufactured", {
                  valueAsNumber: true,
                })}
                max={new Date().getFullYear()}
                min={1800}
                placeholder={new Date().getFullYear().toString()}
                type="number"
              />
              {errors.yearManufactured && (
                <FieldError>{errors.yearManufactured.message}</FieldError>
              )}
            </FieldGroup>

            {/* Purchase Date */}
            <FieldGroup>
              <FieldLabel htmlFor="purchaseDate">Purchase Date *</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !purchaseDate && "text-muted-foreground"
                    )}
                    type="button"
                    variant="outline"
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {purchaseDate ? (
                      format(purchaseDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    mode="single"
                    onSelect={(date) => {
                      if (date) {
                        setValue("purchaseDate", date);
                      }
                    }}
                    selected={purchaseDate}
                  />
                </PopoverContent>
              </Popover>
              {errors.purchaseDate && (
                <FieldError>{errors.purchaseDate.message}</FieldError>
              )}
            </FieldGroup>

            {/* Purchase Price (Optional) */}
            <FieldGroup>
              <FieldLabel htmlFor="purchasePrice">
                Purchase Price (Optional)
              </FieldLabel>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  $
                </span>
                <Input
                  {...register("purchasePrice", {
                    valueAsNumber: true,
                  })}
                  className="pl-8"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                />
              </div>
              <FieldDescription>
                Your purchase price (kept confidential)
              </FieldDescription>
              {errors.purchasePrice && (
                <FieldError>{errors.purchasePrice.message}</FieldError>
              )}
            </FieldGroup>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                disabled={isSubmitting || isDraftSaving || !!serialError}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Verification"
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
