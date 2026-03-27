import { format, parseISO, subDays } from "date-fns";

import {
  aggregateMetrics,
  buildCategoryBreakdown,
  buildChannelPerformance,
  buildCustomerSummaries,
  buildProductPerformance,
} from "@/lib/analytics/metrics";
import type {
  DashboardFilters,
  Insight,
  InsightDigest,
  Order,
  OrderLineItem,
} from "@/types/dashboard";

function createInsight(id: string, input: Omit<Insight, "id">): Insight {
  return { id, ...input };
}

export function generateInsights(params: {
  filteredOrders: Order[];
  scopedOrders: Order[];
  filteredLineItems: OrderLineItem[];
  comparisonLineItems: OrderLineItem[];
  maxDate: string;
  filters: DashboardFilters;
}) {
  const {
    filteredOrders,
    scopedOrders,
    filteredLineItems,
    comparisonLineItems,
    maxDate,
  } = params;
  const currentMetrics = aggregateMetrics(filteredLineItems);
  const previousMetrics = aggregateMetrics(comparisonLineItems);
  const customerSummaries = buildCustomerSummaries(filteredOrders, scopedOrders, maxDate);
  const products = buildProductPerformance(filteredLineItems, comparisonLineItems);
  const channels = buildChannelPerformance(filteredLineItems, comparisonLineItems);
  const categories = buildCategoryBreakdown(filteredLineItems);
  const previousChannels = buildChannelPerformance(comparisonLineItems, []);
  const insights: Insight[] = [];

  const meta = channels.find((channel) => channel.channel === "Meta");
  const metaPrevious = previousChannels.find((channel) => channel.channel === "Meta");

  if (meta && metaPrevious) {
    const spendChange = metaPrevious.spend
      ? ((meta.spend - metaPrevious.spend) / metaPrevious.spend) * 100
      : 0;
    const profitChange = metaPrevious.contributionProfit
      ? ((meta.contributionProfit - metaPrevious.contributionProfit) /
          Math.abs(metaPrevious.contributionProfit)) *
        100
      : 0;

    if (spendChange > 10 && profitChange < -4) {
      insights.push(
        createInsight("meta-efficiency", {
          severity: "high",
          category: "channel",
          title: "Meta efficiency is slipping",
          summary: `Meta spend increased ${spendChange.toFixed(1)}% while contribution profit moved ${profitChange.toFixed(1)}% versus the prior period.`,
          recommendation:
            "Pull back broad prospecting spend and tighten creative rotation before scaling again.",
          impact:
            "Revenue is still flowing, but incremental profit is being diluted.",
        }),
      );
    }
  }

  const weakMarginProduct = products.find((product) => product.lowMarginHighRevenue);
  if (weakMarginProduct) {
    insights.push(
      createInsight("product-margin-pressure", {
        severity: "high",
        category: "margin",
        title: `${weakMarginProduct.name} is carrying low-margin revenue`,
        summary: `${weakMarginProduct.name} remains a top revenue driver, but contribution margin is only ${(weakMarginProduct.marginRate * 100).toFixed(1)}%.`,
        recommendation:
          "Review bundle logic, paid traffic mix, and discounting on this hero SKU.",
        impact:
          "High-volume demand is not converting into proportionate cash contribution.",
      }),
    );
  }

  const returningCustomerRateChange = previousMetrics.returningCustomerRate
    ? ((currentMetrics.returningCustomerRate - previousMetrics.returningCustomerRate) /
        previousMetrics.returningCustomerRate) *
      100
    : 0;

  if (returningCustomerRateChange < -5) {
    insights.push(
      createInsight("repeat-rate-drop", {
        severity: "medium",
        category: "customer",
        title: "Returning customer momentum eased",
        summary: `Returning customer rate shifted ${returningCustomerRateChange.toFixed(1)}% versus the previous period.`,
        recommendation:
          "Re-engage recent first-time customers with post-purchase flows and timed replenishment offers.",
        impact:
          "Retention softness usually shows up in blended efficiency before top-line slows.",
      }),
    );
  }

  const averageRefundRate = currentMetrics.refundRate;
  const refundOutlier = categories.find(
    (category) =>
      category.revenue > 5000 &&
      category.margin < currentMetrics.contributionMargin - 0.05,
  );

  if (refundOutlier && averageRefundRate > 0.04) {
    insights.push(
      createInsight("refund-category", {
        severity: "medium",
        category: "refunds",
        title: `${refundOutlier.category} is creating margin drag`,
        summary: `${refundOutlier.category} is converting revenue, but profitability is trailing the account average by more than five points.`,
        recommendation:
          "Inspect return reasons, product detail clarity, and packaging expectations for this category.",
        impact:
          "Refund-heavy categories can mask underperformance in headline revenue.",
      }),
    );
  }

  const processingShare = scopedOrders.length
    ? scopedOrders.filter((order) => order.status === "processing").length /
      scopedOrders.length
    : 0;

  if (processingShare > 0.08) {
    insights.push(
      createInsight("ops-backlog", {
        severity: "low",
        category: "operations",
        title: "Fulfilment queue is elevated",
        summary: `${(processingShare * 100).toFixed(1)}% of scoped orders are still processing in the latest window.`,
        recommendation:
          "Watch SLA pressure if the next paid push lands before backlog clears.",
        impact:
          "Operational lag increases support load and late-delivery refund risk.",
      }),
    );
  }

  const topCustomer = customerSummaries[0];
  if (topCustomer && topCustomer.segment === "VIP") {
    insights.push(
      createInsight("vip-segment", {
        severity: "low",
        category: "customer",
        title: "VIP customers remain the profit anchor",
        summary: `${topCustomer.name}'s cohort continues to hold the highest lifetime value and strongest repeat cadence.`,
        recommendation:
          "Protect this segment with early-access drops and higher-margin cross-sell journeys.",
        impact:
          "VIP revenue is your most dependable source of contribution profit.",
      }),
    );
  }

  const sorted = insights.sort((left, right) => {
    const weight = { high: 3, medium: 2, low: 1 };
    return weight[right.severity] - weight[left.severity];
  });

  const last30Start = subDays(parseISO(maxDate), 29);
  const digest: InsightDigest = {
    headline: "What changed in the last 30 days",
    summary: `Revenue Intelligence scanned ${filteredOrders.length} filtered orders through ${format(parseISO(maxDate), "dd MMM yyyy")} and surfaced the sharpest profitability shifts.`,
    changes: [
      `Net revenue ${currentMetrics.netRevenue >= previousMetrics.netRevenue ? "expanded" : "contracted"} versus the prior 30 days.`,
      `Contribution margin now sits at ${(currentMetrics.contributionMargin * 100).toFixed(1)}% across the active filter scope.`,
      `Recent activity window runs from ${format(last30Start, "dd MMM")} to ${format(parseISO(maxDate), "dd MMM")}.`,
    ],
    priorityActions: sorted.slice(0, 3).map((insight) => insight.recommendation),
  };

  return { insights: sorted, digest };
}
