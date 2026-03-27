"use client";

import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export const chartColors = {
  revenue: "var(--chart-1)",
  profit: "var(--chart-2)",
  spend: "#6b6b6b",
  rose: "var(--chart-5)",
  sky: "var(--chart-3)",
  emerald: "var(--chart-4)",
  amber: "#d6a24a",
};

export const chartMargins = { top: 8, right: 8, left: -12, bottom: 4 };

export function formatChartCurrencyAxis(value: number) {
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `£${Math.round(value / 1000)}k`;
  return `£${Math.round(value)}`;
}

export function formatChartNumberAxis(value: number) {
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return `${Math.round(value)}`;
}

type ChartTooltipProps = {
  active?: boolean;
  payload?: Array<{
    dataKey?: string | number;
    name?: string;
    value?: number | string;
  }>;
  label?: string;
};

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[200px] rounded-[24px] border border-[color:var(--border-strong)] bg-[color:var(--surface-elevated)] px-4 py-3 shadow-[var(--shadow-xl)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-6 text-sm">
            <span className="text-[color:var(--muted-foreground)]">{entry.name}</span>
            <span className="font-semibold text-[color:var(--foreground)]">
              {typeof entry.value === "number"
                ? entry.name?.toLowerCase().includes("margin") || entry.name?.toLowerCase().includes("share")
                  ? formatPercent(entry.value)
                  : entry.name?.toLowerCase().includes("orders")
                    ? formatNumber(entry.value)
                    : formatCurrency(entry.value)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
