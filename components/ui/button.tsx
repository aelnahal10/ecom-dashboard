"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--primary)] px-4 py-2 text-[color:var(--primary-foreground)] shadow-[0_16px_40px_rgba(212,163,115,0.2)] hover:-translate-y-0.5 hover:bg-[#ddb287] hover:shadow-[0_22px_54px_rgba(212,163,115,0.26)]",
        secondary:
          "border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-2 text-[color:var(--foreground)] shadow-sm hover:border-[color:var(--border-strong)] hover:bg-[color:#1b2533]",
        ghost:
          "px-3 py-2 text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-subtle)] hover:text-[color:var(--foreground)]",
        outline:
          "border border-[color:var(--border-strong)] bg-transparent px-4 py-2 text-[color:var(--foreground)] hover:bg-[color:var(--surface-subtle)]",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-11 px-5 text-sm",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
