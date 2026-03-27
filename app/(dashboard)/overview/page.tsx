"use client";

import Link from "next/link";
import { ArrowRight, Radar, ShieldAlert, Sparkles, TrendingUp, Wallet } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
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
  formatChartCurrencyAxis,
} from "@/components/dashboard/chart-helpers";
import { ClientChart } from "@/components/dashboard/client-chart";
import { InsightCard } from "@/components/dashboard/insight-card";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

function percentageDelta(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default function OverviewPage() {
  const {
    chartGranularity,
    channelMix,
    channelPerformance,
    comparisonMetrics,
    dateWindow,
    filteredOrders,
    insightDigest,
    insights,
    metrics,
    productPerformance,
    trendSeries,
  } = useDashboard();

  const topProducts = productPerformance.slice(0, 5);
  const lowMarginExposure = productPerformance
    .filter((product) => product.lowMarginHighRevenue)
    .reduce((sum, product) => sum + product.netRevenue, 0);
  const newCustomers = new Set(
    filteredOrders
      .filter((order) => !order.isReturningCustomer)
      .map((order) => order.customerId),
  ).size;
  const estimatedCac = newCustomers ? metrics.spend / newCustomers : 0;
  const bestChannel = channelPerformance[0];
  const worstChannel = [...channelPerformance].sort((left, right) => left.mer - right.mer)[0];
  const revenueLeaks = insights.slice(0, 3);
  const channelColors = ["#d4a373", "#e5bf96", "#b68d63", "#737373", "#d57f73"];
  const recommendationCards = [
    {
      title: "Revenue at risk",
      value: formatCurrency(lowMarginExposure + metrics.grossRevenue * metrics.refundRate),
      note: "Sales volume exposed to margin softness and elevated refund drag.",
      icon: ShieldAlert,
    },
    {
      title: "Top growth channel",
      value: bestChannel ? bestChannel.channel : "Meta",
      note: bestChannel
        ? `${bestChannel.roas.toFixed(2)}x ROAS and ${formatCurrency(bestChannel.contributionProfit)} contribution profit.`
        : "Channel momentum unavailable.",
      icon: TrendingUp,
    },
    {
      title: "Estimated CAC",
      value: estimatedCac ? formatCurrency(estimatedCac) : "n/a",
      note: `${newCustomers.toLocaleString("en-GB")} new customers acquired inside the active filter window.`,
      icon: Wallet,
    },
  ];

  return (
    <PageShell>
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="premium-grid overflow-hidden border-none bg-[linear-gradient(135deg,#171312,#211916_55%,#2a1f1a)] text-white shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
          <CardContent className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-white/10 text-white">Aurelium Goods</Badge>
                <Badge className="bg-white/10 text-white">Shopify revenue intelligence</Badge>
                <Badge className="bg-[color:rgba(212,163,115,0.16)] text-[#f1d1ae]">Account healthy</Badge>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Run-rate</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">£80k to £120k / month</p>
              </div>
            </div>
            <div className="mt-8 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Revenue Intelligence
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
                Profit-first commerce clarity for ambitious operators.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
                Revenue Intelligence turns channel, product, and customer activity into one
                executive operating view, so teams can spot leaks before they hit the P&L.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Net revenue</p>
                <p className="mt-3 text-3xl font-semibold">{formatCurrency(metrics.netRevenue)}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Contribution profit</p>
                <p className="mt-3 text-3xl font-semibold">{formatCurrency(metrics.contributionProfit)}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Contribution margin</p>
                <p className="mt-3 text-3xl font-semibold">{formatPercent(metrics.contributionMargin)}</p>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Blended MER</p>
                <p className="mt-3 text-3xl font-semibold">{metrics.mer.toFixed(2)}x</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-full flex-col justify-between p-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                    AI-style summary
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text-strong)]">
                    {insightDigest.headline}
                  </h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[color:var(--text-soft)]">
                {insightDigest.summary}
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {insightDigest.changes.map((change) => (
                <div
                  key={change}
                    className="rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-3 text-sm text-[color:var(--text-strong)]"
                >
                  {change}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] border border-[color:rgba(214,162,74,0.28)] bg-[color:rgba(214,162,74,0.12)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--warning)]">
                Efficiency watch
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
                {worstChannel
                  ? `${worstChannel.channel} is the weakest efficiency contributor at ${worstChannel.mer.toFixed(2)}x MER.`
                  : "No weak channel signals are currently present."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          eyebrow="Revenue"
          title="Net revenue"
          value={formatCurrency(metrics.netRevenue)}
          delta={percentageDelta(metrics.netRevenue, comparisonMetrics.netRevenue)}
          subtitle="After refunds, shipping recovery, and discount impact."
          variant="featured"
        />
        <StatCard
          eyebrow="Profit"
          title="Gross profit"
          value={formatCurrency(metrics.grossProfit)}
          delta={percentageDelta(metrics.grossProfit, comparisonMetrics.grossProfit)}
          tone="success"
        />
        <StatCard
          eyebrow="Orders"
          title="Orders"
          value={metrics.orders.toLocaleString("en-GB")}
          delta={percentageDelta(metrics.orders, comparisonMetrics.orders)}
        />
        <StatCard
          eyebrow="AOV"
          title="Average order value"
          value={formatCurrency(metrics.averageOrderValue)}
          delta={percentageDelta(metrics.averageOrderValue, comparisonMetrics.averageOrderValue)}
        />
        <StatCard
          eyebrow="Refunds"
          title="Refund rate"
          value={formatPercent(metrics.refundRate)}
          delta={percentageDelta(metrics.refundRate, comparisonMetrics.refundRate)}
          tone="warning"
        />
        <StatCard
          eyebrow="Efficiency"
          title="Blended MER"
          value={`${metrics.mer.toFixed(2)}x`}
          delta={percentageDelta(metrics.mer, comparisonMetrics.mer)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <ChartCard
          title="Revenue trend"
          description="Net revenue across the active filter scope."
          action={<Badge variant="muted">{chartGranularity}</Badge>}
        >
          <div className="h-[320px]">
            <ClientChart>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendSeries} margin={chartMargins}>
                  <defs>
                    <linearGradient id="overviewRevenueFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={chartColors.revenue} stopOpacity={0.28} />
                      <stop offset="100%" stopColor={chartColors.revenue} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={28} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} width={66} tickMargin={10} tickFormatter={formatChartCurrencyAxis} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={chartColors.revenue}
                    strokeWidth={2.5}
                    fill="url(#overviewRevenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ClientChart>
          </div>
        </ChartCard>

        <ChartCard
          title="Profit trend"
          description={`Contribution profit from ${dateWindow.startDate} to ${dateWindow.endDate}.`}
        >
          <div className="h-[320px]">
            <ClientChart>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendSeries} margin={chartMargins}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={28} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} width={66} tickMargin={10} tickFormatter={formatChartCurrencyAxis} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke={chartColors.profit}
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ClientChart>
          </div>
        </ChartCard>

        <ChartCard title="Channel mix" description="Net revenue share by acquisition source.">
          <div className="h-[320px]">
            <ClientChart>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelMix}
                    dataKey="revenue"
                    nameKey="channel"
                    innerRadius={78}
                    outerRadius={108}
                    paddingAngle={3}
                  >
                    {channelMix.map((entry, index) => (
                      <Cell key={entry.channel} fill={channelColors[index % channelColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </ClientChart>
          </div>
          <div className="mt-2 space-y-3">
            {channelMix.map((channel, index) => (
              <div
                key={channel.channel}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: channelColors[index % channelColors.length] }}
                  />
                  <span className="text-sm font-medium text-[color:var(--text-strong)]">
                    {channel.channel}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[color:var(--text-strong)]">
                    {formatCurrency(channel.revenue)}
                  </p>
                  <p className="text-xs text-[color:var(--text-soft)]">{formatPercent(channel.share)}</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {recommendationCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                      Recommendation
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
                      {card.title}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
                  {card.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">{card.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          title="Top products"
          description="Highest net revenue contributors under the active filters."
          action={
            <Button variant="ghost" asChild className="text-xs">
              <Link href="/products">
                View products
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div
                key={product.productId}
                className="grid grid-cols-[1.3fr_repeat(3,minmax(0,0.7fr))] items-center rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
              >
                <div>
                  <p className="font-medium text-[color:var(--text-strong)]">{product.name}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Revenue</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-strong)]">
                    {formatCurrency(product.netRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Margin</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-strong)]">
                    {formatPercent(product.marginRate)}
                  </p>
                </div>
                <div className="justify-self-end">
                  <Badge variant={product.lowMarginHighRevenue ? "warning" : "success"}>
                    {product.lowMarginHighRevenue ? "Margin pressure" : "Healthy"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="grid gap-6">
          <ChartCard
            title="Revenue leaks detected"
            description="Rule-based commercial issues that deserve attention."
          >
            <div className="space-y-3">
              {revenueLeaks.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-4"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-[color:var(--accent-strong)]" />
                    <p className="font-medium text-[color:var(--text-strong)]">{insight.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
                    {insight.summary}
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Priority actions" description="Clear next moves from the current commercial picture.">
            <div className="space-y-3">
              {insightDigest.priorityActions.map((action, index) => (
                <div
                  key={action}
                  className="flex items-start gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                    {index === 0 ? <Radar className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                  </div>
                  <p className="text-sm leading-6 text-[color:var(--text-strong)]">{action}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {insights.slice(0, 3).map((insight) => (
          <InsightCard key={insight.id} insight={insight} compact />
        ))}
      </section>
    </PageShell>
  );
}
