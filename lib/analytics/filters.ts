import { parseISO, subDays } from "date-fns";

import type {
  DashboardFilters,
  Order,
  OrderLineItem,
} from "@/types/dashboard";

export function getPresetWindowStart(filters: DashboardFilters, maxDate: string) {
  const anchor = parseISO(maxDate);
  const offset =
    filters.dateRange === "30d" ? 29 : filters.dateRange === "90d" ? 89 : 179;

  return subDays(anchor, offset);
}

export function matchesSharedFilters<
  T extends { channel: string; region: string; category?: string; createdAt: string },
>(record: T, filters: DashboardFilters, maxDate: string) {
  const windowStart = getPresetWindowStart(filters, maxDate);
  const createdAt = parseISO(record.createdAt);

  return (
    createdAt >= windowStart &&
    (filters.channel === "All" || record.channel === filters.channel) &&
    (filters.region === "All" || record.region === filters.region) &&
    (filters.category === "All" ||
      !record.category ||
      record.category === filters.category)
  );
}

export function filterLineItems(
  lineItems: OrderLineItem[],
  filters: DashboardFilters,
  maxDate: string,
) {
  return lineItems.filter((lineItem) =>
    matchesSharedFilters(lineItem, filters, maxDate),
  );
}

export function filterOrders(
  orders: Order[],
  filters: DashboardFilters,
  maxDate: string,
) {
  const windowStart = getPresetWindowStart(filters, maxDate);

  return orders.filter((order) => {
    const createdAt = parseISO(order.createdAt);
    const matchesCategory =
      filters.category === "All" ||
      order.items.some((item) => item.category === filters.category);

    return (
      createdAt >= windowStart &&
      (filters.channel === "All" || order.channel === filters.channel) &&
      (filters.region === "All" || order.region === filters.region) &&
      matchesCategory
    );
  });
}

export function filterLineItemsIgnoringDate(
  lineItems: OrderLineItem[],
  filters: DashboardFilters,
) {
  return lineItems.filter(
    (lineItem) =>
      (filters.channel === "All" || lineItem.channel === filters.channel) &&
      (filters.region === "All" || lineItem.region === filters.region) &&
      (filters.category === "All" || lineItem.category === filters.category),
  );
}
