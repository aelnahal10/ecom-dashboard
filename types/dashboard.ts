export type Channel = "Meta" | "Google" | "Email" | "Organic" | "Direct";

export type ProductCategory =
  | "Travel"
  | "Accessories"
  | "Hydration"
  | "Home";

export type Region =
  | "United Kingdom"
  | "North America"
  | "Europe"
  | "Middle East";

export type OrderStatus =
  | "fulfilled"
  | "processing"
  | "partially_refunded"
  | "refunded";

export type CustomerSegment = "VIP" | "Loyal" | "Emerging" | "At Risk";

export type InsightSeverity = "low" | "medium" | "high";

export type InsightCategory =
  | "margin"
  | "channel"
  | "customer"
  | "operations"
  | "refunds";

export type DateRangePreset = "30d" | "90d" | "180d";
export type ChartGranularity = "day" | "week" | "month";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  cogs: number;
  hero?: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  region: Region;
  firstOrderDate: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  unitCogs: number;
  grossRevenue: number;
  discountAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  channel: Channel;
  region: Region;
  status: OrderStatus;
  customerId: string;
  customerName: string;
  customerEmail: string;
  isReturningCustomer: boolean;
  items: OrderItem[];
  grossRevenue: number;
  discountTotal: number;
  shippingRevenue: number;
  shippingCost: number;
  refundAmount: number;
  adSpend: number;
  netRevenue: number;
  cogs: number;
  grossProfit: number;
  contributionProfit: number;
}

export interface OrderLineItem {
  id: string;
  orderId: string;
  orderNumber: string;
  createdAt: string;
  channel: Channel;
  region: Region;
  status: OrderStatus;
  customerId: string;
  customerName: string;
  customerEmail: string;
  isReturningCustomer: boolean;
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  grossRevenue: number;
  discountAmount: number;
  shippingRevenue: number;
  shippingCost: number;
  refundAmount: number;
  adSpend: number;
  cogs: number;
  netRevenue: number;
  grossProfit: number;
  contributionProfit: number;
}

export interface DashboardFilters {
  dateRange: DateRangePreset;
  channel: Channel | "All";
  category: ProductCategory | "All";
  region: Region | "All";
}

export interface AggregatedMetrics {
  grossRevenue: number;
  netRevenue: number;
  grossProfit: number;
  contributionProfit: number;
  contributionMargin: number;
  orders: number;
  unitsSold: number;
  averageOrderValue: number;
  refundRate: number;
  returningCustomerRate: number;
  mer: number;
  spend: number;
}

export interface MetricDelta {
  label: string;
  value: number;
  positiveIsGood?: boolean;
}

export interface TrendPoint {
  date: string;
  label: string;
  bucketLabel?: string;
  revenue: number;
  profit: number;
  orders: number;
  spend: number;
}

export interface ChannelPerformance extends AggregatedMetrics {
  channel: Channel;
  shareOfRevenue: number;
  roas: number;
  trendDelta: number;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  category: ProductCategory;
  revenue: number;
  netRevenue: number;
  unitsSold: number;
  orders: number;
  grossProfit: number;
  contributionProfit: number;
  marginRate: number;
  refundRate: number;
  averageDiscountRate: number;
  recentTrend: number;
  lowMarginHighRevenue: boolean;
}

export interface CustomerSummary {
  customerId: string;
  name: string;
  email: string;
  region: Region;
  firstOrderDate: string;
  lastOrderDate: string;
  lifetimeRevenue: number;
  lifetimeOrders: number;
  activeRevenue: number;
  activeOrders: number;
  segment: CustomerSegment;
}

export interface SegmentCard {
  segment: CustomerSegment;
  customers: number;
  revenue: number;
  averageLtv: number;
}

export interface CohortRow {
  cohort: string;
  customers: number;
  revenue: number;
  repeatRate: number;
}

export interface GeographicRow {
  region: Region;
  revenue: number;
  orders: number;
  growth: number;
}

export interface Insight {
  id: string;
  severity: InsightSeverity;
  category: InsightCategory;
  title: string;
  summary: string;
  recommendation: string;
  impact: string;
}

export interface InsightDigest {
  headline: string;
  summary: string;
  changes: string[];
  priorityActions: string[];
}

export interface OrderTableRow {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  region: Region;
  channel: Channel;
  status: OrderStatus;
  items: number;
  grossRevenue: number;
  discountTotal: number;
  refundAmount: number;
  netRevenue: number;
}
