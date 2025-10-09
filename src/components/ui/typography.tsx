import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 font-extrabold text-4xl tracking-tight md:text-5xl lg:text-6xl",
      h2: "scroll-m-20 font-semibold text-3xl tracking-tight md:text-4xl lg:text-5xl",
      h3: "scroll-m-20 font-semibold text-2xl tracking-tight md:text-3xl lg:text-4xl",
      h4: "scroll-m-20 font-semibold text-xl tracking-tight md:text-2xl lg:text-3xl",
      h5: "scroll-m-20 font-semibold text-lg tracking-tight md:text-xl lg:text-2xl",
      h6: "scroll-m-20 font-semibold text-base tracking-tight md:text-lg lg:text-xl",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-muted-foreground text-xl",
      large: "font-semibold text-lg",
      small: "font-medium text-sm leading-none",
      muted: "text-muted-foreground text-sm",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
    },
    affects: {
      default: "",
      removePMargin: "[&:not(:first-child)]:mt-0",
    },
  },
  defaultVariants: {
    variant: "p",
    affects: "default",
  },
});

type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "blockquote"
  | "code"
  | "ul"
  | "ol";

type TypographyProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof typographyVariants>;

export function Typography<T extends ElementType = "p">({
  as,
  variant,
  affects,
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? getDefaultElement(variant);

  return (
    <Component
      className={cn(typographyVariants({ variant, affects }), className)}
      {...props}
    />
  );
}

function getDefaultElement(
  variant: VariantProps<typeof typographyVariants>["variant"]
): TypographyElement {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "blockquote":
      return "blockquote";
    case "code":
      return "code";
    case "list":
      return "ul";
    case "muted":
    case "small":
    case "large":
    case "lead":
      return "span";
    default:
      return "p";
  }
}
