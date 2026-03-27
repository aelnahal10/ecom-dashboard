"use client";

import { CalendarClock, Mail, Palette, PlugZap, BellRing } from "lucide-react";

import { PageShell } from "@/components/dashboard/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
                <PlugZap className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Connected data sources</CardTitle>
                <CardDescription>Commerce and marketing integrations for the demo account.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Shopify", "Store orders, products, customers", "Healthy"],
              ["Meta Ads", "Spend, campaign, creative metadata", "Healthy"],
              ["Google Ads", "Spend and performance sync", "Healthy"],
              ["Klaviyo", "Email revenue and campaign attribution", "Pending refresh"],
            ].map(([title, description, status]) => (
              <div key={title} className="flex items-center justify-between rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">{title}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">{description}</p>
                </div>
                <Badge variant={status === "Healthy" ? "success" : "warning"}>{status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Presentation-level settings used in exports and board-ready views.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Primary brand</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text-strong)]">Aurelium Goods</p>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">Premium travel and home essentials</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {["Ink", "Sand", "Brass"].map((tone) => (
                <div key={tone} className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-4">
                  <p className="text-sm font-medium text-[color:var(--text-strong)]">{tone}</p>
                  <div className="mt-3 h-16 rounded-2xl bg-[linear-gradient(135deg,#171312,#d4a373)]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Alert preferences</CardTitle>
                <CardDescription>Mock notification controls for commercial health monitoring.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Margin drop alerts",
              "Refund spike alerts",
              "Channel efficiency warnings",
              "Daily executive digest",
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">{item}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">Email and in-product notification</p>
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
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Report scheduling</CardTitle>
                <CardDescription>Board-ready updates, cadence planning, and distribution lists.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Executive summary</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text-strong)]">Every Monday · 08:00</p>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">Includes overview KPIs, insights, and top margin risks.</p>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Channel briefing</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text-strong)]">Daily · 07:15</p>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">Slack and email summary for paid media operators.</p>
            </div>
            <Button className="w-full">
              <Mail className="h-4 w-4" />
              Configure recipients
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
