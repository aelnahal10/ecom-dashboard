import {
  compareAsc,
  compareDesc,
  eachDayOfInterval,
  format,
  isBefore,
  parseISO,
  startOfMonth,
  subDays,
} from "date-fns";

import { mockDashboardData } from "@/lib/data/mock-data";
import type {
  AggregatedMetrics,
  Channel,
  ChannelPerformance,
  CohortRow,
  CustomerSegment,
  CustomerSummary,
  GeographicRow,
  Order,
  OrderLineItem,
  OrderTableRow,
  ProductPerformance,
  Region,
  SegmentCard,
  TrendPoint,
} from "@/types/dashboard";

function sumBy<T>(rows: T[], accessor: (row: T) => number) {
  return rows.reduce((sum, row) => sum + accessor(row), 0);
}

function uniqueCount(values: string[]) {
  return new Set(values).size;
}

function groupBy<T, K extends string>(rows: T[], getKey: (row: T) => K) {
  const grouped = new Map<K, T[]>();

  rows.forEach((row) => {
    const key = getKey(row);
    const collection = grouped.get(key) ?? [];
    collection.push(row);
    grouped.set(key, collection);
  });

  return grouped;
}

export function expandOrderLineItems(orders: Order[]) {
  return orders.flatMap((order) => {
    const baseRevenue = order.items.reduce((sum, item) => sum + item.grossRevenue, 0) || 1;

    return order.items.map<OrderLineItem>((item, index) => {
      const share = item.grossRevenue / baseRevenue;
      const shippingRevenue = order.shippingRevenue * share;
      const shippingCost = order.shippingCost * share;
      const refundAmount = order.refundAmount * share;
      const adSpend = order.adSpend * share;
      const cogs = item.unitCogs * item.quantity;
      const netRevenue = item.grossRevenue - item.discountAmount + shippingRevenue - refundAmount;
      const grossProfit = netRevenue - cogs - shippingCost;
      const contributionProfit = grossProfit - adSpend;

      return {
        id: `${order.id}_${index + 1}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        channel: order.channel,
        region: order.region,
        status: order.status,
        customerId: order.customerId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        isReturningCustomer: order.isReturningCustomer,
        productId: item.productId,
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        grossRevenue: item.grossRevenue,
        discountAmount: item.discountAmount,
        shippingRevenue,
        shippingCost,
        refundAmount,
        adSpend,
        cogs,
        netRevenue,
        grossProfit,
        contributionProfit,
      };
    });
  });
}

export function aggregateMetrics(lineItems: OrderLineItem[]): AggregatedMetrics {
  const orderIds = Array.from(new Set(lineItems.map((lineItem) => lineItem.orderId)));
  const grossRevenue = sumBy(lineItems, (lineItem) => lineItem.grossRevenue);
  const netRevenue = sumBy(lineItems, (lineItem) => lineItem.netRevenue);
  const grossProfit = sumBy(lineItems, (lineItem) => lineItem.grossProfit);
  const contributionProfit = sumBy(lineItems, (lineItem) => lineItem.contributionProfit);
  const spend = sumBy(lineItems, (lineItem) => lineItem.adSpend);

  return {
    grossRevenue,
    netRevenue,
    grossProfit,
    contributionProfit,
    contributionMargin: netRevenue ? contributionProfit / netRevenue : 0,
    orders: orderIds.length,
    unitsSold: sumBy(lineItems, (lineItem) => lineItem.quantity),
    averageOrderValue: orderIds.length ? netRevenue / orderIds.length : 0,
    refundRate: grossRevenue ? sumBy(lineItems, (lineItem) => lineItem.refundAmount) / grossRevenue : 0,
    returningCustomerRate: orderIds.length
      ? uniqueCount(lineItems.filter((lineItem) => lineItem.isReturningCustomer).map((lineItem) => lineItem.orderId)) /
        orderIds.length
      : 0,
    mer: spend ? netRevenue / spend : 0,
    spend,
  };
}

export function buildTrendSeries(
  lineItems: OrderLineItem[],
  startDate: string,
  endDate: string,
): TrendPoint[] {
  const groups = new Map<string, TrendPoint>();

  eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) }).forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    groups.set(key, {
      date: key,
      label: format(day, "dd MMM"),
      revenue: 0,
      profit: 0,
      orders: 0,
      spend: 0,
    });
  });

  lineItems.forEach((lineItem) => {
    const point = groups.get(lineItem.createdAt);
    if (!point) return;

    point.revenue += lineItem.netRevenue;
    point.profit += lineItem.contributionProfit;
    point.spend += lineItem.adSpend;
  });

  const orderCounts = groupBy(lineItems, (lineItem) => lineItem.createdAt);
  orderCounts.forEach((rows, date) => {
    const point = groups.get(date);
    if (point) point.orders = uniqueCount(rows.map((row) => row.orderId));
  });

  return Array.from(groups.values()).sort((left, right) =>
    compareAsc(parseISO(left.date), parseISO(right.date)),
  );
}

export function buildChannelPerformance(
  lineItems: OrderLineItem[],
  comparisonLineItems: OrderLineItem[],
): ChannelPerformance[] {
  const grouped = groupBy(lineItems, (row) => row.channel);
  const comparisonGrouped = groupBy(comparisonLineItems, (row) => row.channel);
  const totalRevenue = sumBy(lineItems, (row) => row.netRevenue);

  return Array.from(grouped.entries())
    .map(([channel, rows]) => {
      const metrics = aggregateMetrics(rows);
      const previousProfit = sumBy(comparisonGrouped.get(channel as Channel) ?? [], (row) => row.contributionProfit);

      return {
        channel: channel as Channel,
        ...metrics,
        shareOfRevenue: totalRevenue ? metrics.netRevenue / totalRevenue : 0,
        roas: metrics.spend ? metrics.netRevenue / metrics.spend : 0,
        trendDelta: previousProfit
          ? ((metrics.contributionProfit - previousProfit) / Math.abs(previousProfit)) * 100
          : 0,
      };
    })
    .sort((left, right) => right.contributionProfit - left.contributionProfit);
}

export function buildProductPerformance(
  lineItems: OrderLineItem[],
  comparisonLineItems: OrderLineItem[],
): ProductPerformance[] {
  const grouped = groupBy(lineItems, (row) => row.productId);
  const comparisonGrouped = groupBy(comparisonLineItems, (row) => row.productId);

  return Array.from(grouped.entries())
    .map(([productId, rows]) => {
      const netRevenue = sumBy(rows, (row) => row.netRevenue);
      const comparisonRevenue = sumBy(comparisonGrouped.get(productId) ?? [], (row) => row.netRevenue);
      const sample = rows[0];

      return {
        productId,
        name: sample.productName,
        category: sample.category,
        revenue: sumBy(rows, (row) => row.grossRevenue),
        netRevenue,
        unitsSold: sumBy(rows, (row) => row.quantity),
        orders: uniqueCount(rows.map((row) => row.orderId)),
        grossProfit: sumBy(rows, (row) => row.grossProfit),
        contributionProfit: sumBy(rows, (row) => row.contributionProfit),
        marginRate: netRevenue ? sumBy(rows, (row) => row.contributionProfit) / netRevenue : 0,
        refundRate: sumBy(rows, (row) => row.grossRevenue)
          ? sumBy(rows, (row) => row.refundAmount) / sumBy(rows, (row) => row.grossRevenue)
          : 0,
        averageDiscountRate: sumBy(rows, (row) => row.grossRevenue)
          ? sumBy(rows, (row) => row.discountAmount) / sumBy(rows, (row) => row.grossRevenue)
          : 0,
        recentTrend: comparisonRevenue ? ((netRevenue - comparisonRevenue) / comparisonRevenue) * 100 : 0,
        lowMarginHighRevenue: false,
      };
    })
    .sort((left, right) => right.netRevenue - left.netRevenue)
    .map((row, index, collection) => ({
      ...row,
      lowMarginHighRevenue:
        row.marginRate < 0.18 &&
        row.netRevenue >= (collection[Math.min(3, collection.length - 1)]?.netRevenue ?? 0),
    }));
}

export function buildCategoryBreakdown(lineItems: OrderLineItem[]) {
  const grouped = groupBy(lineItems, (row) => row.category);

  return Array.from(grouped.entries())
    .map(([category, rows]) => ({
      category,
      revenue: sumBy(rows, (row) => row.netRevenue),
      orders: uniqueCount(rows.map((row) => row.orderId)),
      margin: aggregateMetrics(rows).contributionMargin,
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

export function buildChannelMix(lineItems: OrderLineItem[]) {
  const grouped = groupBy(lineItems, (row) => row.channel);
  const totalRevenue = sumBy(lineItems, (row) => row.netRevenue);

  return Array.from(grouped.entries())
    .map(([channel, rows]) => ({
      channel,
      revenue: sumBy(rows, (row) => row.netRevenue),
      share: totalRevenue ? sumBy(rows, (row) => row.netRevenue) / totalRevenue : 0,
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

function segmentCustomer(summary: CustomerSummary, maxDate: string): CustomerSegment {
  const lastOrderDate = parseISO(summary.lastOrderDate);
  const staleThreshold = subDays(parseISO(maxDate), 45);

  if (summary.lifetimeRevenue >= 620 || summary.lifetimeOrders >= 5) return "VIP";
  if (isBefore(lastOrderDate, staleThreshold)) return "At Risk";
  if (summary.lifetimeOrders >= 3) return "Loyal";
  return "Emerging";
}

export function buildCustomerSummaries(
  filteredOrders: Order[],
  allOrders: Order[],
  maxDate: string,
): CustomerSummary[] {
  const activeCustomerIds = new Set(filteredOrders.map((order) => order.customerId));
  const groupedAll = groupBy(allOrders, (order) => order.customerId);
  const groupedActive = groupBy(filteredOrders, (order) => order.customerId);

  return Array.from(activeCustomerIds)
    .map((customerId) => {
      const lifetimeOrders = groupedAll.get(customerId) ?? [];
      const activeOrders = groupedActive.get(customerId) ?? [];
      const sortedLifetime = [...lifetimeOrders].sort((left, right) =>
        compareDesc(parseISO(left.createdAt), parseISO(right.createdAt)),
      );
      const latest = sortedLifetime[0];
      const summary: CustomerSummary = {
        customerId,
        name: latest.customerName,
        email: latest.customerEmail,
        region: latest.region,
        firstOrderDate: sortedLifetime[sortedLifetime.length - 1].createdAt,
        lastOrderDate: latest.createdAt,
        lifetimeRevenue: sumBy(lifetimeOrders, (order) => order.netRevenue),
        lifetimeOrders: lifetimeOrders.length,
        activeRevenue: sumBy(activeOrders, (order) => order.netRevenue),
        activeOrders: activeOrders.length,
        segment: "Emerging",
      };

      summary.segment = segmentCustomer(summary, maxDate);
      return summary;
    })
    .sort((left, right) => right.activeRevenue - left.activeRevenue);
}

export function buildSegmentCards(customers: CustomerSummary[]): SegmentCard[] {
  const grouped = groupBy(customers, (customer) => customer.segment);

  return Array.from(grouped.entries())
    .map(([segment, rows]) => ({
      segment: segment as CustomerSegment,
      customers: rows.length,
      revenue: sumBy(rows, (row) => row.activeRevenue),
      averageLtv: rows.length ? sumBy(rows, (row) => row.lifetimeRevenue) / rows.length : 0,
    }))
    .sort((left, right) => right.revenue - left.revenue);
}

export function buildCohorts(customers: CustomerSummary[]): CohortRow[] {
  const grouped = new Map<string, { rows: CustomerSummary[]; date: Date }>();

  customers.forEach((customer) => {
    const cohortDate = startOfMonth(parseISO(customer.firstOrderDate));
    const key = format(cohortDate, "MMM yyyy");
    const existing = grouped.get(key);

    if (existing) {
      existing.rows.push(customer);
      return;
    }

    grouped.set(key, { rows: [customer], date: cohortDate });
  });

  return Array.from(grouped.entries())
    .sort((left, right) => compareDesc(left[1].date, right[1].date))
    .map(([cohort, value]) => ({
      cohort,
      customers: value.rows.length,
      revenue: sumBy(value.rows, (row) => row.activeRevenue),
      repeatRate: value.rows.length
        ? value.rows.filter((row) => row.lifetimeOrders >= 2).length / value.rows.length
        : 0,
    }))
    .slice(0, 6);
}

export function buildGeographicRows(
  lineItems: OrderLineItem[],
  comparisonLineItems: OrderLineItem[],
): GeographicRow[] {
  const grouped = groupBy(lineItems, (row) => row.region);
  const comparisonGrouped = groupBy(comparisonLineItems, (row) => row.region);

  return Array.from(grouped.entries())
    .map(([region, rows]) => {
      const revenue = sumBy(rows, (row) => row.netRevenue);
      const comparisonRevenue = sumBy(comparisonGrouped.get(region as Region) ?? [], (row) => row.netRevenue);

      return {
        region: region as Region,
        revenue,
        orders: uniqueCount(rows.map((row) => row.orderId)),
        growth: comparisonRevenue ? ((revenue - comparisonRevenue) / comparisonRevenue) * 100 : 0,
      };
    })
    .sort((left, right) => right.revenue - left.revenue);
}

export function buildOrderTableRows(filteredOrders: Order[]): OrderTableRow[] {
  return [...filteredOrders]
    .sort((left, right) => compareDesc(parseISO(left.createdAt), parseISO(right.createdAt)))
    .map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      customerName: order.customerName,
      region: order.region,
      channel: order.channel,
      status: order.status,
      items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      grossRevenue: order.grossRevenue,
      discountTotal: order.discountTotal,
      refundAmount: order.refundAmount,
      netRevenue: order.netRevenue,
    }));
}

export function buildComparisonSlices(lineItems: OrderLineItem[], maxDate: string) {
  const max = parseISO(maxDate);
  const currentStart = subDays(max, 29);
  const priorStart = subDays(max, 59);
  const priorEnd = subDays(max, 29);

  return {
    current: lineItems.filter((row) => !isBefore(parseISO(row.createdAt), currentStart)),
    prior: lineItems.filter((row) => {
      const createdAt = parseISO(row.createdAt);
      return !isBefore(createdAt, priorStart) && isBefore(createdAt, priorEnd);
    }),
  };
}

export const allLineItems = expandOrderLineItems(mockDashboardData.orders);
