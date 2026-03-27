import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]",
        muted: "bg-[color:var(--surface-subtle)] text-[color:var(--muted-foreground)]",
        success: "bg-[color:color-mix(in srgb,var(--success) 16%, transparent)] text-[color:var(--success)]",
        warning: "bg-[color:color-mix(in srgb,var(--warning) 16%, transparent)] text-[color:var(--warning)]",
        danger: "bg-[color:color-mix(in srgb,var(--danger) 16%, transparent)] text-[color:var(--danger)]",
        info: "bg-[color:color-mix(in srgb,var(--info) 16%, transparent)] text-[color:var(--info)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
