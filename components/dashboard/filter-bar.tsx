"use client";

import { format } from "date-fns";
import { RefreshCcw, SlidersHorizontal } from "lucide-react";

import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FilterBar() {
  const {
    channels,
    categories,
    dateRanges,
    filters,
    isPending,
    maxDate,
    regions,
    resetFilters,
    setFilter,
  } = useDashboard();

  return (
    <div className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--background)]/92 px-6 py-5 backdrop-blur-xl md:px-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Revenue intelligence</Badge>
            <Badge variant="muted">Aurelium Goods</Badge>
            <Badge variant="muted">Updated through {format(new Date(maxDate), "dd MMM yyyy")}</Badge>
            {isPending ? <Badge variant="warning">Updating view</Badge> : null}
          </div>
          <div className="max-w-2xl xl:text-right">
            <h2 className="text-[32px] font-semibold tracking-[-0.04em] text-[color:var(--text-strong)]">
              Protect revenue. Recover margin.
            </h2>
            <p className="mt-1 text-sm text-[color:var(--text-soft)]">
              A focused operating view for Aurelium Goods across channel, product, and customer performance.
            </p>
          </div>
        </div>

        <div className="surface-panel flex flex-wrap items-end gap-3 rounded-[28px] p-4">
          <div className="min-w-[180px] flex-1 sm:flex-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              Date range
            </p>
            <Select value={filters.dateRange} onValueChange={(value) => setFilter("dateRange", value as typeof filters.dateRange)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[180px] flex-1 sm:flex-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              Channel
            </p>
            <Select value={filters.channel} onValueChange={(value) => setFilter("channel", value as typeof filters.channel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[180px] flex-1 sm:flex-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              Category
            </p>
            <Select value={filters.category} onValueChange={(value) => setFilter("category", value as typeof filters.category)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[180px] flex-1 sm:flex-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              Region
            </p>
            <Select value={filters.region} onValueChange={(value) => setFilter("region", value as typeof filters.region)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex min-w-[160px] items-end gap-2">
            <Button variant="secondary" className="w-full" onClick={resetFilters}>
              <RefreshCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="ghost" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
