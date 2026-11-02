import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const plaqueVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display uppercase tracking-[0.16em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 rounded-[2px]",
  {
    variants: {
      variant: {
        primary: "plaque plaque-primary text-[13px]",
        ghost: "plaque text-[13px]",
        bare: "font-display uppercase tracking-[0.18em] text-gilt-400 hover:text-gilt-200 underline-offset-4 hover:underline decoration-gilt-600/60",
      },
      size: {
        sm: "h-9 px-4 text-[11px]",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-[13px]",
        xl: "h-14 px-10 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface PlaqueProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof plaqueVariants> {
  href?: string;
}

export function Plaque({ className, variant, size, href, children, ...props }: PlaqueProps) {
  if (href) {
    return (
      <Link href={href} className={cn(plaqueVariants({ variant, size }), className)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cn(plaqueVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}
