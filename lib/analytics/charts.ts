import {
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { getPresetWindowStart } from "@/lib/analytics/filters";
import type {
  ChartGranularity,
  DashboardFilters,
  OrderLineItem,
  TrendPoint,
} from "@/types/dashboard";

export function getDateWindow(filters: DashboardFilters, maxDate: string) {
  const start = getPresetWindowStart(filters, maxDate);
  const end = parseISO(maxDate);
  const dayCount =
    filters.dateRange === "30d" ? 30 : filters.dateRange === "90d" ? 90 : 180;

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
    dayCount,
  };
}

export function getComparisonWindow(filters: DashboardFilters, maxDate: string) {
  const current = getDateWindow(filters, maxDate);
  const end = parseISO(current.startDate);
  const start = new Date(end);
  start.setDate(start.getDate() - current.dayCount);

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
    dayCount: current.dayCount,
  };
}

export function getChartGranularity(dayCount: number): ChartGranularity {
  if (dayCount <= 30) return "day";
  if (dayCount <= 90) return "week";
  return "month";
}

function getBucketStart(date: Date, granularity: ChartGranularity) {
  if (granularity === "week") {
    return startOfWeek(date, { weekStartsOn: 1 });
  }

  if (granularity === "month") {
    return startOfMonth(date);
  }

  return date;
}

function getBucketLabel(date: Date, granularity: ChartGranularity) {
  if (granularity === "week") {
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(date, "dd MMM")} - ${format(end, "dd MMM")}`;
  }

  if (granularity === "month") {
    return format(date, "MMM yyyy");
  }

  return format(date, "dd MMM");
}

export function buildTrendSeriesForWindow(
  lineItems: OrderLineItem[],
  filters: DashboardFilters,
  maxDate: string,
) {
  const window = getDateWindow(filters, maxDate);
  const granularity = getChartGranularity(window.dayCount);
  const grouped = new Map<string, TrendPoint>();
  const orderCounts = new Map<string, Set<string>>();

  lineItems.forEach((lineItem) => {
    const createdAt = parseISO(lineItem.createdAt);
    const bucketStart = getBucketStart(createdAt, granularity);
    const bucketKey = format(bucketStart, "yyyy-MM-dd");
    const existing = grouped.get(bucketKey) ?? {
      date: bucketKey,
      label: getBucketLabel(bucketStart, granularity),
      bucketLabel: format(bucketStart, "yyyy-MM-dd"),
      revenue: 0,
      profit: 0,
      orders: 0,
      spend: 0,
    };

    existing.revenue += lineItem.netRevenue;
    existing.profit += lineItem.contributionProfit;
    existing.spend += lineItem.adSpend;
    grouped.set(bucketKey, existing);

    const countBucket = orderCounts.get(bucketKey) ?? new Set<string>();
    countBucket.add(lineItem.orderId);
    orderCounts.set(bucketKey, countBucket);
  });

  orderCounts.forEach((ids, bucketKey) => {
    const point = grouped.get(bucketKey);
    if (point) point.orders = ids.size;
  });

  return {
    granularity,
    points: Array.from(grouped.values()).sort((left, right) =>
      left.date.localeCompare(right.date),
    ),
    window,
  };
}

export function buildChannelTrendSeriesForWindow(
  lineItems: OrderLineItem[],
  filters: DashboardFilters,
  maxDate: string,
) {
  const window = getDateWindow(filters, maxDate);
  const granularity = getChartGranularity(window.dayCount);
  const grouped = new Map<string, Record<string, string | number>>();

  lineItems.forEach((lineItem) => {
    const createdAt = parseISO(lineItem.createdAt);
    const bucketStart = getBucketStart(createdAt, granularity);
    const bucketKey = format(bucketStart, "yyyy-MM-dd");
    const existing = grouped.get(bucketKey) ?? {
      date: bucketKey,
      label: getBucketLabel(bucketStart, granularity),
    };

    existing[lineItem.channel] = Number(existing[lineItem.channel] ?? 0) + lineItem.netRevenue;
    grouped.set(bucketKey, existing);
  });

  return {
    granularity,
    points: Array.from(grouped.values()).sort((left, right) =>
      String(left.date).localeCompare(String(right.date)),
    ),
    window,
  };
}
