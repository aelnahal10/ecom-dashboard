"use client";

import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  useTransition,
} from "react";
import { isBefore, parseISO, subDays } from "date-fns";

import {
  buildChannelTrendSeriesForWindow,
  buildTrendSeriesForWindow,
  getComparisonWindow,
  getDateWindow,
} from "@/lib/analytics/charts";
import { filterLineItems, filterLineItemsIgnoringDate, filterOrders } from "@/lib/analytics/filters";
import { generateInsights } from "@/lib/analytics/insights";
import {
  aggregateMetrics,
  allLineItems,
  buildCategoryBreakdown,
  buildChannelMix,
  buildChannelPerformance,
  buildCohorts,
  buildCustomerSummaries,
  buildGeographicRows,
  buildOrderTableRows,
  buildProductPerformance,
  buildSegmentCards,
} from "@/lib/analytics/metrics";
import { mockDashboardData } from "@/lib/data/mock-data";
import type {
  ChartGranularity,
  Channel,
  DashboardFilters,
  DateRangePreset,
  ProductCategory,
  Region,
} from "@/types/dashboard";

type DashboardContextValue = {
  filters: DashboardFilters;
  setFilter: <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => void;
  resetFilters: () => void;
  isPending: boolean;
  maxDate: string;
  chartGranularity: ChartGranularity;
  dateWindow: ReturnType<typeof getDateWindow>;
  metrics: ReturnType<typeof aggregateMetrics>;
  comparisonMetrics: ReturnType<typeof aggregateMetrics>;
  filteredOrders: typeof mockDashboardData.orders;
  filteredLineItems: typeof allLineItems;
  trendSeries: ReturnType<typeof buildTrendSeriesForWindow>["points"];
  channelTrendSeries: ReturnType<typeof buildChannelTrendSeriesForWindow>["points"];
  channelMix: ReturnType<typeof buildChannelMix>;
  categoryBreakdown: ReturnType<typeof buildCategoryBreakdown>;
  channelPerformance: ReturnType<typeof buildChannelPerformance>;
  productPerformance: ReturnType<typeof buildProductPerformance>;
  customerSummaries: ReturnType<typeof buildCustomerSummaries>;
  segmentCards: ReturnType<typeof buildSegmentCards>;
  cohortRows: ReturnType<typeof buildCohorts>;
  geographicRows: ReturnType<typeof buildGeographicRows>;
  orderRows: ReturnType<typeof buildOrderTableRows>;
  insights: ReturnType<typeof generateInsights>["insights"];
  insightDigest: ReturnType<typeof generateInsights>["digest"];
  channels: Array<Channel | "All">;
  categories: Array<ProductCategory | "All">;
  regions: Array<Region | "All">;
  dateRanges: Array<{ value: DateRangePreset; label: string }>;
};

const defaultFilters: DashboardFilters = {
  dateRange: "90d",
  channel: "All",
  category: "All",
  region: "All",
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

function buildWindowLineItems(
  lineItems: typeof allLineItems,
  startDate: string,
  endDate: string,
) {
  return lineItems.filter((row) => {
    const createdAt = parseISO(row.createdAt);
    return (
      !isBefore(createdAt, parseISO(startDate)) &&
      isBefore(createdAt, parseISO(endDate))
    );
  });
}

function buildRecentWindowLineItems(lineItems: typeof allLineItems, maxDate: string) {
  const anchor = parseISO(maxDate);
  const recentStart = subDays(anchor, 29);
  const priorStart = subDays(anchor, 59);

  return {
    current: lineItems.filter((row) => !isBefore(parseISO(row.createdAt), recentStart)),
    prior: lineItems.filter((row) => {
      const createdAt = parseISO(row.createdAt);
      return !isBefore(createdAt, priorStart) && isBefore(createdAt, recentStart);
    }),
  };
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [isPending, startUiTransition] = useTransition();
  const maxDate = mockDashboardData.endDate;
  const dateWindow = useMemo(() => getDateWindow(filters, maxDate), [filters, maxDate]);
  const comparisonWindow = useMemo(
    () => getComparisonWindow(filters, maxDate),
    [filters, maxDate],
  );

  const filteredLineItems = useMemo(
    () => filterLineItems(allLineItems, filters, maxDate),
    [filters, maxDate],
  );
  const filteredOrders = useMemo(
    () => filterOrders(mockDashboardData.orders, filters, maxDate),
    [filters, maxDate],
  );

  const scopedLineItems = useMemo(
    () => filterLineItemsIgnoringDate(allLineItems, filters),
    [filters],
  );
  const scopedOrders = useMemo(
    () =>
      mockDashboardData.orders.filter(
        (order) =>
          (filters.channel === "All" || order.channel === filters.channel) &&
          (filters.region === "All" || order.region === filters.region) &&
          (filters.category === "All" ||
            order.items.some((item) => item.category === filters.category)),
      ),
    [filters],
  );

  const comparisonLineItems = useMemo(
    () =>
      buildWindowLineItems(
        scopedLineItems,
        comparisonWindow.startDate,
        comparisonWindow.endDate,
      ),
    [comparisonWindow.endDate, comparisonWindow.startDate, scopedLineItems],
  );
  const recentWindow = useMemo(
    () => buildRecentWindowLineItems(scopedLineItems, maxDate),
    [maxDate, scopedLineItems],
  );
  const recentCurrentLineItems = recentWindow.current;
  const recentPriorLineItems = recentWindow.prior;

  const metrics = useMemo(() => aggregateMetrics(filteredLineItems), [filteredLineItems]);
  const comparisonMetrics = useMemo(
    () => aggregateMetrics(comparisonLineItems),
    [comparisonLineItems],
  );
  const trendChart = useMemo(
    () => buildTrendSeriesForWindow(filteredLineItems, filters, maxDate),
    [filteredLineItems, filters, maxDate],
  );
  const channelTrendChart = useMemo(
    () => buildChannelTrendSeriesForWindow(filteredLineItems, filters, maxDate),
    [filteredLineItems, filters, maxDate],
  );
  const channelMix = useMemo(() => buildChannelMix(filteredLineItems), [filteredLineItems]);
  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(filteredLineItems),
    [filteredLineItems],
  );
  const channelPerformance = useMemo(
    () => buildChannelPerformance(filteredLineItems, comparisonLineItems),
    [comparisonLineItems, filteredLineItems],
  );
  const productPerformance = useMemo(
    () => buildProductPerformance(filteredLineItems, comparisonLineItems),
    [comparisonLineItems, filteredLineItems],
  );
  const customerSummaries = useMemo(
    () => buildCustomerSummaries(filteredOrders, scopedOrders, maxDate),
    [filteredOrders, maxDate, scopedOrders],
  );
  const segmentCards = useMemo(
    () => buildSegmentCards(customerSummaries),
    [customerSummaries],
  );
  const cohortRows = useMemo(() => buildCohorts(customerSummaries), [customerSummaries]);
  const geographicRows = useMemo(
    () => buildGeographicRows(filteredLineItems, comparisonLineItems),
    [comparisonLineItems, filteredLineItems],
  );
  const orderRows = useMemo(() => buildOrderTableRows(filteredOrders), [filteredOrders]);
  const { insights, digest } = useMemo(
    () =>
      generateInsights({
        filteredOrders,
        scopedOrders,
        filteredLineItems: recentCurrentLineItems,
        comparisonLineItems: recentPriorLineItems,
        maxDate,
        filters,
      }),
    [
      filteredOrders,
      filters,
      maxDate,
      recentCurrentLineItems,
      recentPriorLineItems,
      scopedOrders,
    ],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      filters,
      setFilter: (key, value) => {
        startUiTransition(() => {
          startTransition(() => {
            setFilters((current) => ({ ...current, [key]: value }));
          });
        });
      },
      resetFilters: () => {
        startUiTransition(() => {
          startTransition(() => {
            setFilters(defaultFilters);
          });
        });
      },
      isPending,
      maxDate,
      chartGranularity: trendChart.granularity,
      dateWindow,
      metrics,
      comparisonMetrics,
      filteredOrders,
      filteredLineItems,
      trendSeries: trendChart.points,
      channelTrendSeries: channelTrendChart.points,
      channelMix,
      categoryBreakdown,
      channelPerformance,
      productPerformance,
      customerSummaries,
      segmentCards,
      cohortRows,
      geographicRows,
      orderRows,
      insights,
      insightDigest: digest,
      channels: ["All", "Meta", "Google", "Email", "Organic", "Direct"],
      categories: ["All", "Travel", "Accessories", "Hydration", "Home"],
      regions: ["All", "United Kingdom", "North America", "Europe", "Middle East"],
      dateRanges: [
        { value: "30d", label: "Last 30 days" },
        { value: "90d", label: "Last 90 days" },
        { value: "180d", label: "Last 6 months" },
      ],
    }),
    [
      channelMix,
      channelTrendChart.points,
      channelPerformance,
      cohortRows,
      comparisonMetrics,
      customerSummaries,
      dateWindow,
      digest,
      filteredLineItems,
      filteredOrders,
      filters,
      geographicRows,
      insights,
      isPending,
      maxDate,
      metrics,
      orderRows,
      productPerformance,
      segmentCards,
      trendChart.granularity,
      trendChart.points,
      categoryBreakdown,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
}
