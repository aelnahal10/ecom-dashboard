"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowUpDown, Search, TriangleAlert, Trophy } from "lucide-react";
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
  formatChartCurrencyAxis,
} from "@/components/dashboard/chart-helpers";
import { ClientChart } from "@/components/dashboard/client-chart";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageShell } from "@/components/dashboard/page-shell";
import { ProductDetailDialog } from "@/components/dashboard/product-detail-dialog";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
import type { ProductPerformance } from "@/types/dashboard";

type SortKey = "name" | "revenue" | "unitsSold" | "grossProfit" | "marginRate" | "refundRate";

function sortProducts(rows: ProductPerformance[], sortKey: SortKey, descending: boolean) {
  const sorted = [...rows].sort((left, right) => {
    const leftValue = left[sortKey];
    const rightValue = right[sortKey];

    if (typeof leftValue === "string" && typeof rightValue === "string") {
      return leftValue.localeCompare(rightValue);
    }

    return Number(leftValue) - Number(rightValue);
  });

  return descending ? sorted.reverse() : sorted;
}

export default function ProductsPage() {
  const { categoryBreakdown, productPerformance } = useDashboard();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [descending, setDescending] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductPerformance | null>(null);
  const deferredSearch = useDeferredValue(search);

  const filteredProducts = useMemo(() => {
    const normalized = deferredSearch.trim().toLowerCase();
    const scoped = normalized
      ? productPerformance.filter(
          (product) =>
            product.name.toLowerCase().includes(normalized) ||
            product.category.toLowerCase().includes(normalized),
        )
      : productPerformance;

    return sortProducts(scoped, sortKey, descending);
  }, [deferredSearch, descending, productPerformance, sortKey]);

  const winners = productPerformance
    .filter((product) => product.recentTrend > 0)
    .sort((left, right) => right.recentTrend - left.recentTrend)
    .slice(0, 3);
  const underperformers = [...productPerformance]
    .sort((left, right) => left.marginRate - right.marginRate)
    .slice(0, 3);
  const highRiskCount = productPerformance.filter((product) => product.lowMarginHighRevenue).length;
  const highestRevenueProduct = productPerformance[0];
  const lowestMarginProduct = underperformers[0];

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setDescending((current) => !current);
      return;
    }

    setSortKey(key);
    setDescending(true);
  };

  return (
    <PageShell>
      <section className="grid gap-4 md:grid-cols-3">
        <ChartCard title="Top revenue product" description="Current leading SKU by filtered net revenue.">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Leader</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              {highestRevenueProduct?.name ?? "No product"}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {highestRevenueProduct
                ? `${formatCurrency(highestRevenueProduct.netRevenue)} net revenue across ${formatNumber(highestRevenueProduct.orders)} orders.`
                : "No active data in scope."}
            </p>
          </div>
        </ChartCard>
        <ChartCard title="Lowest margin product" description="The weakest contribution margin in scope.">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Watch list</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              {lowestMarginProduct?.name ?? "No product"}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {lowestMarginProduct
                ? `${formatPercent(lowestMarginProduct.marginRate)} contribution margin with ${formatCurrency(lowestMarginProduct.netRevenue)} net revenue.`
                : "No active data in scope."}
            </p>
          </div>
        </ChartCard>
        <ChartCard title="Margin pressure count" description="Products with high revenue but weak economics.">
          <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Flagged SKUs</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatNumber(highRiskCount)}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Revenue-heavy products currently earning below your preferred margin threshold.
            </p>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard
          title="Product performance"
          description="Search, sort, and inspect the product catalogue under the active dashboard filters."
          action={
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-soft)]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or categories"
                className="pl-11"
              />
            </div>
          }
        >
          {filteredProducts.length ? (
            <div className="overflow-x-auto rounded-[28px] border border-[color:var(--border)]">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[1.5fr_repeat(5,minmax(0,0.7fr))] bg-[color:var(--surface-subtle)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  {[
                    ["name", "Product"],
                    ["revenue", "Revenue"],
                    ["unitsSold", "Units"],
                    ["grossProfit", "Gross profit"],
                    ["marginRate", "Margin"],
                    ["refundRate", "Refunds"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleSort(key as SortKey)}
                      className="flex items-center gap-2 text-left"
                    >
                      {label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ))}
                </div>
                <div className="divide-y divide-[color:var(--border)]">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.productId}
                      onClick={() => setSelectedProduct(product)}
                      className="grid w-full grid-cols-[1.5fr_repeat(5,minmax(0,0.7fr))] items-center px-4 py-4 text-left transition hover:bg-[color:var(--surface-subtle)]"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-[color:var(--text-strong)]">{product.name}</p>
                          {product.lowMarginHighRevenue ? (
                            <Badge variant="warning">High revenue, low margin</Badge>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-[color:var(--text-soft)]">{product.category}</p>
                      </div>
                      <p className="font-medium text-[color:var(--text-strong)]">
                        {formatCurrency(product.netRevenue)}
                      </p>
                      <p className="text-[color:var(--text-strong)]">{formatNumber(product.unitsSold)}</p>
                      <p className="text-[color:var(--text-strong)]">
                        {formatCurrency(product.grossProfit)}
                      </p>
                      <p className="text-[color:var(--text-strong)]">{formatPercent(product.marginRate)}</p>
                      <p className="text-[color:var(--text-strong)]">{formatPercent(product.refundRate)}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No products match this view"
              description="Try relaxing the search term or broadening the dashboard filters."
            />
          )}
        </ChartCard>

        <div className="grid gap-6">
          <ChartCard title="Category breakdown" description="Net revenue by category.">
            <div className="h-[280px]">
              <ClientChart>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown} margin={chartMargins}>
                    <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                    <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={formatChartCurrencyAxis} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" fill={chartColors.revenue} radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ClientChart>
            </div>
          </ChartCard>

          <ChartCard title="Top winners" description="Strongest recent commercial momentum.">
            <div className="space-y-3">
              {winners.map((product) => (
                <div key={product.productId} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:rgba(46,160,67,0.16)] text-[color:var(--success)]">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[color:var(--text-strong)]">{product.name}</p>
                        <p className="text-sm text-[color:var(--text-soft)]">{product.category}</p>
                      </div>
                    </div>
                    <Badge variant="success">{product.recentTrend.toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Lowest margin products" description="SKUs eroding profitability fastest.">
            <div className="space-y-3">
              {underperformers.map((product) => (
                <div key={product.productId} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:rgba(214,162,74,0.16)] text-[color:var(--warning)]">
                      <TriangleAlert className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-[color:var(--text-strong)]">{product.name}</p>
                        <Badge variant="warning">{formatPercent(product.marginRate)}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-[color:var(--text-soft)]">
                        {formatCurrency(product.netRevenue)} net revenue with margin below target.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </section>

      <ProductDetailDialog
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
        product={selectedProduct}
      />
    </PageShell>
  );
}
