import { AlertTriangle, BadgeAlert, Sparkles, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types/dashboard";

const severityMap = {
  high: {
    badge: "danger" as const,
    icon: BadgeAlert,
  },
  medium: {
    badge: "warning" as const,
    icon: AlertTriangle,
  },
  low: {
    badge: "muted" as const,
    icon: Sparkles,
  },
};

export function InsightCard({
  insight,
  compact = false,
}: {
  insight: Insight;
  compact?: boolean;
}) {
  const config = severityMap[insight.severity];
  const Icon = config.icon;

  return (
    <Card className={cn("h-full", compact && "rounded-[26px]")}>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                {insight.title}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                {insight.category}
              </p>
            </div>
          </div>
          <Badge variant={config.badge}>{insight.severity}</Badge>
        </div>
        <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">{insight.summary}</p>
        <div className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
            Impact
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{insight.impact}</p>
        </div>
        <div className="flex items-start gap-2 text-sm font-medium text-[color:var(--foreground)]">
          <TrendingDown className="mt-0.5 h-4 w-4 text-[color:var(--accent-strong)]" />
          {insight.recommendation}
        </div>
      </CardContent>
    </Card>
  );
}
