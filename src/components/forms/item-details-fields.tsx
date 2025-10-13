import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { cn } from "@/lib/utils";
import {
  type createItemSchema,
  ITEM_TYPES,
  JEWELRY_BRANDS,
  WATCH_BRANDS,
} from "@/validations/item";

type FormData = z.infer<typeof createItemSchema>;

type ItemDetailsFieldsProps = {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  isCheckingSerial: boolean;
  serialError: string | null;
  onSerialNumberBlur: () => void;
};

export function ItemDetailsFields({
  register,
  watch,
  setValue,
  errors,
  isCheckingSerial,
  serialError,
  onSerialNumberBlur,
}: ItemDetailsFieldsProps) {
  const selectedType = watch("type");
  const purchaseDate = watch("purchaseDate");

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
        <FieldLabel htmlFor="referenceNumber">Reference Number *</FieldLabel>
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
            onBlur={onSerialNumberBlur}
            placeholder="Unique serial number"
            type="text"
          />
          {isCheckingSerial && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        <FieldDescription>This must be unique to your item</FieldDescription>
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
    </>
  );
}
