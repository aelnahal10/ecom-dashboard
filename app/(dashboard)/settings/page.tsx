"use client";

import {
  BadgeCheck,
  LayoutPanelTop,
  Palette,
  Presentation,
  SlidersHorizontal,
} from "lucide-react";

import { PageShell } from "@/components/dashboard/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <PageShell>
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Workspace profile</CardTitle>
                <CardDescription>
                  Simple commercial context for the demo workspace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Frontend-only</Badge>
                <Badge variant="muted">Static mock data</Badge>
                <Badge variant="muted">No live integrations</Badge>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text-strong)]">
                Aurelium Goods
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                Premium travel and home essentials brand used to demonstrate revenue,
                profitability, channel efficiency, and customer performance.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Revenue band", "£80k to £120k / month"],
                ["Primary lens", "Profit-first analytics"],
                ["Market focus", "UK, EU, North America"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                    {label}
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-[color:var(--text-strong)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <LayoutPanelTop className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Dashboard defaults</CardTitle>
                <CardDescription>
                  Safe, presentation-focused defaults that keep the demo easy to operate.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              ["Default range", "Last 90 days"],
              ["Primary KPI", "Net revenue"],
              ["Comparison mode", "Previous period"],
              ["Chart density", "Adaptive aggregation"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  {label}
                </p>
                <p className="mt-3 text-lg font-semibold text-[color:var(--text-strong)]">
                  {value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Presentation preferences</CardTitle>
                <CardDescription>
                  Lightweight display options that do not depend on external systems.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Highlight margin pressure by default",
              "Show executive commentary cards",
              "Use compact tables on smaller screens",
              "Keep profitability metrics visible across pages",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
              >
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">{item}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">
                    Frontend-only preference for the demo experience.
                  </p>
                </div>
                <Switch defaultChecked={index !== 2} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <Presentation className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Demo scope</CardTitle>
                <CardDescription>
                  Clear boundaries so the product pitch stays believable and easy to maintain.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                Included
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-strong)]">
                Shared filters, profitability views, product and channel drilldowns, customer
                segmentation, and rule-based automated insights.
              </p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                Removed from scope
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-strong)]">
                No live integrations, no scheduled emails, no notification workflows, and no
                external reporting dependencies.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Brand presentation</CardTitle>
              <CardDescription>
                Visual choices used to keep the demo polished without implying more product
                complexity than is actually implemented.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            ["Theme", "Executive charcoal with muted gold accents"],
            ["Narrative", "Serious, commercial, profit-first"],
            ["Visual posture", "Premium SaaS demo, not internal ops tooling"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                {label}
              </p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-strong)]">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
