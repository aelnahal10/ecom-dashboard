import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDelta } from "@/lib/utils";

export function StatCard({
  eyebrow,
  title,
  value,
  delta,
  tone = "default",
  subtitle,
  variant = "standard",
}: {
  eyebrow: string;
  title: string;
  value: string;
  delta?: number;
  tone?: "default" | "success" | "warning";
  subtitle?: string;
  variant?: "compact" | "standard" | "featured";
}) {
  const positive = (delta ?? 0) >= 0;

  return (
    <Card
      className={cn(
        "overflow-hidden",
        tone === "warning" && "border-[color:color-mix(in srgb,var(--warning) 30%, white)] bg-[color:color-mix(in srgb,var(--warning) 8%, white)]",
        tone === "success" && "border-[color:color-mix(in srgb,var(--success) 24%, white)] bg-[color:color-mix(in srgb,var(--success) 6%, white)]",
        variant === "featured" && "shadow-[var(--shadow-xl)]",
      )}
    >
      <CardContent
        className={cn(
          "relative flex h-full flex-col p-5 sm:p-6",
          variant === "featured" && "min-h-[220px] justify-between p-7",
          variant === "compact" && "min-h-[150px]",
          variant === "standard" && "min-h-[176px]",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--border-strong),transparent)]" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
              {eyebrow}
            </p>
            <p className="mt-3 text-sm font-medium text-[color:var(--muted-foreground)]">{title}</p>
          </div>
          {typeof delta === "number" ? (
            <Badge variant={positive ? "success" : "danger"} className="shrink-0">
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {formatDelta(delta)}
            </Badge>
          ) : null}
        </div>
        <div className="mt-5 flex-1">
          <p
            className={cn(
              "max-w-full break-words font-semibold tracking-[-0.05em] text-[color:var(--foreground)]",
              variant === "featured" ? "text-5xl" : "text-[2rem] sm:text-[2.35rem]",
            )}
          >
            {value}
          </p>
        </div>
        {subtitle ? (
          <p className="mt-4 text-sm leading-6 text-[color:var(--muted-foreground)]">{subtitle}</p>
        ) : (
          <p className="mt-4 text-sm leading-6 text-[color:var(--muted-foreground)]">
            {positive ? "Improving versus previous period." : "Needs attention versus previous period."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
