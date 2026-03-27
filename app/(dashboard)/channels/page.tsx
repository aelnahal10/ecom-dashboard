"use client";

import { AlertTriangle, ArrowUpRight, Gauge, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import { PageShell } from "@/components/dashboard/page-shell";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function ChannelsPage() {
  const { channelPerformance, channelTrendSeries, chartGranularity } = useDashboard();
  const bestChannel = channelPerformance[0];
  const worstChannel = [...channelPerformance].sort((left, right) => left.mer - right.mer)[0];
  const highestSpendChannel = [...channelPerformance].sort((left, right) => right.spend - left.spend)[0];

  const comparisonBars = channelPerformance.map((channel) => ({
    channel: channel.channel,
    revenue: channel.netRevenue,
    spend: channel.spend,
    profit: channel.contributionProfit,
  }));

  const warnings = channelPerformance.filter(
    (channel) => channel.spend > 5000 && channel.trendDelta < -3,
  );

  return (
    <PageShell>
      <section className="grid gap-4 md:grid-cols-3">
        <ChartCard title="Best channel by profit" description="Top contribution profit source in the current view.">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Leader</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              {bestChannel?.channel ?? "n/a"}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {bestChannel
                ? `${formatCurrency(bestChannel.contributionProfit)} contribution profit at ${bestChannel.mer.toFixed(2)}x MER.`
                : "No active data in scope."}
            </p>
          </div>
        </ChartCard>
        <ChartCard title="Worst channel by efficiency" description="The weakest MER inside the current mix.">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Efficiency drag</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              {worstChannel?.channel ?? "n/a"}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {worstChannel
                ? `${worstChannel.mer.toFixed(2)}x MER with ${formatCurrency(worstChannel.spend)} spend deployed.`
                : "No active data in scope."}
            </p>
          </div>
        </ChartCard>
        <ChartCard title="Largest spend allocation" description="Where the most paid budget is currently concentrated.">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Budget concentration</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              {highestSpendChannel?.channel ?? "n/a"}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {highestSpendChannel
                ? `${formatCurrency(highestSpendChannel.spend)} spend against ${formatCurrency(highestSpendChannel.netRevenue)} net revenue.`
                : "No active data in scope."}
            </p>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        {channelPerformance.map((channel) => (
          <Card key={channel.channel} className="xl:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                    {channel.channel}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
                    {formatCurrency(channel.netRevenue)}
                  </p>
                </div>
                <Badge variant={channel.trendDelta >= 0 ? "success" : "warning"}>
                  {channel.trendDelta >= 0 ? "+" : ""}
                  {channel.trendDelta.toFixed(1)}%
                </Badge>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-[color:var(--text-soft)]">
                  <span>Contribution profit</span>
                  <span className="font-medium text-[color:var(--text-strong)]">
                    {formatCurrency(channel.contributionProfit)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[color:var(--text-soft)]">
                  <span>ROAS</span>
                  <span className="font-medium text-[color:var(--text-strong)]">
                    {channel.roas.toFixed(2)}x
                  </span>
                </div>
                <div className="flex items-center justify-between text-[color:var(--text-soft)]">
                  <span>Revenue share</span>
                  <span className="font-medium text-[color:var(--text-strong)]">
                    {formatPercent(channel.shareOfRevenue)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Spend vs revenue vs profit"
          description="Channel economics side by side inside the current filter context."
        >
          <div className="h-[360px]">
            <ClientChart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonBars} margin={chartMargins}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="channel" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={formatChartCurrencyAxis} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar dataKey="spend" fill={chartColors.spend} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="revenue" fill={chartColors.revenue} radius={[10, 10, 0, 0]} />
                  <Bar dataKey="profit" fill={chartColors.profit} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientChart>
          </div>
        </ChartCard>

        <ChartCard title="Efficiency leaderboard" description="Best channels by profit quality.">
          <div className="space-y-3">
            {channelPerformance.map((channel, index) => (
              <div
                key={channel.channel}
                className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--text-strong)]">
                      {index + 1}. {channel.channel}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--text-soft)]">
                      {formatCurrency(channel.contributionProfit)} contribution profit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[color:var(--text-strong)]">
                      {channel.mer.toFixed(2)}x
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                      MER
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Trend lines by channel" description={`Revenue by source using ${chartGranularity} aggregation.`}>
          <div className="h-[360px]">
            <ClientChart>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={channelTrendSeries} margin={chartMargins}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={28} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={formatChartCurrencyAxis} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="Meta" stroke={chartColors.revenue} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="Google" stroke={chartColors.sky} strokeWidth={2.3} dot={false} />
                  <Line type="monotone" dataKey="Email" stroke={chartColors.profit} strokeWidth={2.3} dot={false} />
                  <Line type="monotone" dataKey="Organic" stroke={chartColors.emerald} strokeWidth={2.3} dot={false} />
                  <Line type="monotone" dataKey="Direct" stroke={chartColors.rose} strokeWidth={2.3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ClientChart>
          </div>
        </ChartCard>

        <div className="grid gap-6">
          <ChartCard title="Warnings" description="Channels where spend is rising but efficiency is softening.">
            <div className="space-y-3">
              {warnings.length ? (
                warnings.map((channel) => (
                  <div
                    key={channel.channel}
                    className="rounded-[24px] border border-[color:rgba(214,162,74,0.28)] bg-[color:rgba(214,162,74,0.12)] px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:rgba(214,162,74,0.16)] text-[color:var(--warning)]">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[color:var(--foreground)]">{channel.channel} needs scrutiny</p>
                        <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                          Spend is high, but contribution profit moved {channel.trendDelta.toFixed(1)}%
                          versus the prior comparison window.
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4 text-sm text-[color:var(--text-soft)]">
                  No channel-level profitability warnings inside the current filter scope.
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard title="Channel readout" description="Quick operating notes for the current mix.">
            <div className="space-y-3">
              {channelPerformance.slice(0, 3).map((channel) => (
                <div
                  key={channel.channel}
                  className="flex items-start gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
                    {channel.trendDelta >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : channel.channel === "Meta" ? (
                      <Wallet className="h-4 w-4" />
                    ) : (
                      <Gauge className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[color:var(--text-strong)]">{channel.channel}</p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      {channel.roas.toFixed(2)}x ROAS with {formatPercent(channel.shareOfRevenue)} of revenue share.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </section>
    </PageShell>
  );
}
