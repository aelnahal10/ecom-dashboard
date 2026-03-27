"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Filter, Sparkles } from "lucide-react";

import { InsightCard } from "@/components/dashboard/insight-card";
import { PageShell } from "@/components/dashboard/page-shell";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InsightCategory, InsightSeverity } from "@/types/dashboard";

const severities: Array<InsightSeverity | "all"> = ["all", "high", "medium", "low"];
const categories: Array<InsightCategory | "all"> = [
  "all",
  "margin",
  "channel",
  "customer",
  "operations",
  "refunds",
];

export default function InsightsPage() {
  const { insightDigest, insights } = useDashboard();
  const [severity, setSeverity] = useState<InsightSeverity | "all">("all");
  const [category, setCategory] = useState<InsightCategory | "all">("all");

  const filteredInsights = useMemo(
    () =>
      insights.filter(
        (insight) =>
          (severity === "all" || insight.severity === severity) &&
          (category === "all" || insight.category === category),
      ),
    [category, insights, severity],
  );

  return (
    <PageShell>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,#171312,#211916_55%,#2a1f1a)] text-white shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
          <CardContent className="p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Automated intelligence</p>
                <h1 className="mt-1 text-4xl font-semibold tracking-[-0.05em]">
                  {insightDigest.headline}
                </h1>
              </div>
            </div>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/68">{insightDigest.summary}</p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {insightDigest.changes.map((change) => (
                <div key={change} className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/75">
                  {change}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                  Priority actions
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text-strong)]">
                  Recommended next moves
                </h2>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {insightDigest.priorityActions.map((action) => (
                <div key={action} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4 text-sm leading-6 text-[color:var(--text-strong)]">
                  {action}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4 rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-[color:var(--text-strong)]">Refine the intelligence layer</p>
            <p className="text-sm text-[color:var(--text-soft)]">Filter by severity or business domain.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {severities.map((item) => (
              <Button
                key={item}
                variant={severity === item ? "default" : "secondary"}
                size="sm"
                onClick={() => setSeverity(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                key={item}
                variant={category === item ? "default" : "secondary"}
                size="sm"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {filteredInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>

      <section className="rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Coverage</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text-strong)]">
              Insight distribution
            </h3>
          </div>
          <Badge variant="muted">{filteredInsights.length} signals</Badge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(["high", "medium", "low"] as const).map((level) => {
            const count = filteredInsights.filter((insight) => insight.severity === level).length;

            return (
              <div key={level} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{level}</p>
                <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
