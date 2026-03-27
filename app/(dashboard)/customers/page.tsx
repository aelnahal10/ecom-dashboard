"use client";

import { useMemo } from "react";
import { Globe2, HeartHandshake, Repeat2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/dashboard/chart-card";
import {
  chartColors,
  chartMargins,
  ChartTooltip,
  formatChartNumberAxis,
} from "@/components/dashboard/chart-helpers";
import { ClientChart } from "@/components/dashboard/client-chart";
import { PageShell } from "@/components/dashboard/page-shell";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";

export default function CustomersPage() {
  const { cohortRows, customerSummaries, filteredOrders, geographicRows, metrics, segmentCards } =
    useDashboard();

  const newCustomers = customerSummaries.filter((customer) => customer.lifetimeOrders === 1).length;
  const returningCustomers = customerSummaries.filter(
    (customer) => customer.lifetimeOrders > 1,
  ).length;
  const averageLtv = customerSummaries.length
    ? customerSummaries.reduce((sum, customer) => sum + customer.lifetimeRevenue, 0) /
      customerSummaries.length
    : 0;
  const highestValueSegment = segmentCards[0];
  const fastestRegion = geographicRows.slice().sort((left, right) => right.growth - left.growth)[0];
  const customerBars = useMemo(
    () => [
      { label: "New", customers: newCustomers },
      { label: "Returning", customers: returningCustomers },
    ],
    [newCustomers, returningCustomers],
  );

  return (
    <PageShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              New customers
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatNumber(newCustomers)}
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              First orders captured inside the filtered date range.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              Returning rate
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatPercent(metrics.returningCustomerRate)}
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              Share of orders from customers who had purchased before.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Active customers</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatNumber(customerSummaries.length)}
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              Distinct customers represented across {formatNumber(filteredOrders.length)} filtered orders.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Estimated LTV</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatCurrency(averageLtv)}
            </p>
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              Lifetime revenue per active customer across the scoped dataset.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="New vs returning" description="Customer balance inside the current view.">
          <div className="h-[320px]">
            <ClientChart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerBars} margin={chartMargins}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={formatChartNumberAxis} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="customers" fill={chartColors.revenue} radius={[14, 14, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientChart>
          </div>
        </ChartCard>

        <ChartCard title="Customer segments" description="Revenue concentration by segment.">
          <div className="space-y-3">
            {segmentCards.map((segment) => (
              <div
                key={segment.segment}
                className="grid grid-cols-[1.1fr_repeat(3,minmax(0,0.7fr))] items-center rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
              >
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">{segment.segment}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">{segment.customers} customers</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Revenue</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-strong)]">
                    {formatCurrency(segment.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Avg LTV</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-strong)]">
                    {formatCurrency(segment.averageLtv)}
                  </p>
                </div>
                <div className="justify-self-end">
                  <Badge variant={segment.segment === "VIP" ? "success" : "muted"}>{segment.segment}</Badge>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard title="Geographic breakdown" description="Revenue and growth by region.">
          <div className="space-y-3">
            {geographicRows.map((region) => (
              <div
                key={region.region}
                className="grid grid-cols-[1.1fr_repeat(3,minmax(0,0.7fr))] items-center rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
              >
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">{region.region}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">{region.orders} orders</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Revenue</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-strong)]">
                    {formatCurrency(region.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Growth</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-strong)]">
                    {region.growth >= 0 ? "+" : ""}
                    {region.growth.toFixed(1)}%
                  </p>
                </div>
                <div className="justify-self-end">
                  <Badge variant={region.growth >= 0 ? "success" : "warning"}>
                    {region.growth >= 0 ? "Growing" : "Cooling"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Customer insights" description="High-value behaviours inside the filtered audience.">
          <div className="space-y-3">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:rgba(46,160,67,0.16)] text-[color:var(--success)]">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">Highest value segment</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                    {highestValueSegment?.segment ?? "VIP"} customers are generating the strongest revenue density at{" "}
                    {formatCurrency(highestValueSegment?.averageLtv ?? 0)} average LTV.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:rgba(214,162,74,0.16)] text-[color:var(--warning)]">
                  <Repeat2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">Low repeat segment</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                    Emerging customers still dominate acquisition volume, which means retention systems can unlock the next efficiency gain.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">Fastest growth region</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                    {fastestRegion?.region ?? "North America"} is currently showing the fastest revenue acceleration at{" "}
                    {fastestRegion ? `${fastestRegion.growth.toFixed(1)}%` : "0.0%"} versus the prior period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </section>

      <ChartCard title="Top customer cohorts" description="Recent acquisition cohorts and their repeat quality.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cohortRows.map((cohort) => (
            <div key={cohort.cohort} className="rounded-[26px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-[color:var(--text-strong)]">{cohort.cohort}</p>
                <Badge variant="muted">{formatPercent(cohort.repeatRate)}</Badge>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
                {formatCurrency(cohort.revenue)}
              </p>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">
                {cohort.customers} customers with repeat quality at {formatPercent(cohort.repeatRate)}.
              </p>
            </div>
          ))}
        </div>
      </ChartCard>
    </PageShell>
  );
}
