"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ChartCard } from "@/components/dashboard/chart-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OrderDetailDialog } from "@/components/dashboard/order-detail-dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Channel, OrderStatus, Region } from "@/types/dashboard";

const statuses: Array<OrderStatus | "all"> = [
  "all",
  "fulfilled",
  "processing",
  "partially_refunded",
  "refunded",
];

const statusVariants: Record<OrderStatus, "success" | "warning" | "danger" | "muted"> = {
  fulfilled: "success",
  processing: "muted",
  partially_refunded: "warning",
  refunded: "danger",
};

export default function OrdersPage() {
  const { channels, filteredOrders, orderRows, regions } = useDashboard();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [localChannel, setLocalChannel] = useState<Channel | "All">("All");
  const [localRegion, setLocalRegion] = useState<Region | "All">("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const visibleOrders = useMemo(() => {
    const normalized = deferredSearch.trim().toLowerCase();

    return orderRows.filter((order) => {
      const matchesSearch =
        !normalized ||
        order.orderNumber.toLowerCase().includes(normalized) ||
        order.customerName.toLowerCase().includes(normalized);
      const matchesStatus = status === "all" || order.status === status;
      const matchesChannel = localChannel === "All" || order.channel === localChannel;
      const matchesRegion = localRegion === "All" || order.region === localRegion;

      return matchesSearch && matchesStatus && matchesChannel && matchesRegion;
    });
  }, [deferredSearch, localChannel, localRegion, orderRows, status]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ?? null;
  const processingCount = visibleOrders.filter((order) => order.status === "processing").length;
  const refundCount = visibleOrders.filter((order) => order.refundAmount > 0).length;
  const visibleNetRevenue = visibleOrders.reduce((sum, order) => sum + order.netRevenue, 0);

  return (
    <PageShell>
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Orders in view</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatNumber(visibleOrders.length)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Net revenue</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatCurrency(visibleNetRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Refund markers</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatNumber(refundCount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Processing</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-strong)]">
              {formatNumber(processingCount)}
            </p>
          </CardContent>
        </Card>
      </section>

      <ChartCard
        title="Orders"
        description="Order-level detail with status badges, refund markers, and local drilldown filters."
        action={
          <div className="grid w-full max-w-[980px] gap-3 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-soft)]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by order number or customer"
                className="pl-11"
              />
            </div>
            <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={localChannel} onValueChange={(value) => setLocalChannel(value as typeof localChannel)}>
              <SelectTrigger>
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={localRegion} onValueChange={(value) => setLocalRegion(value as typeof localRegion)}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        {visibleOrders.length ? (
          <div className="overflow-x-auto rounded-[28px] border border-[color:var(--border)]">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-[0.9fr_0.9fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.8fr] bg-[color:var(--surface-subtle)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                <span>Order</span>
                <span>Customer</span>
                <span>Date</span>
                <span>Channel</span>
                <span>Region</span>
                <span>Status</span>
                <span>Discount</span>
                <span className="text-right">Net revenue</span>
              </div>
              <div className="divide-y divide-[color:var(--border)]">
                {visibleOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="grid w-full grid-cols-[0.9fr_0.9fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.8fr] items-center px-4 py-4 text-left transition hover:bg-[color:var(--surface-subtle)]"
                  >
                    <div>
                      <p className="font-medium text-[color:var(--text-strong)]">{order.orderNumber}</p>
                      <p className="text-sm text-[color:var(--text-soft)]">{order.items} items</p>
                    </div>
                    <p className="text-[color:var(--text-strong)]">{order.customerName}</p>
                    <p className="text-[color:var(--text-strong)]">{order.createdAt}</p>
                    <p className="text-[color:var(--text-strong)]">{order.channel}</p>
                    <p className="text-[color:var(--text-soft)]">{order.region}</p>
                    <div>
                      <Badge variant={statusVariants[order.status]}>{order.status.replaceAll("_", " ")}</Badge>
                    </div>
                    <div>
                      {order.refundAmount > 0 ? (
                        <Badge variant="warning">Refund marker</Badge>
                      ) : (
                        <span className="text-sm text-[color:var(--text-soft)]">
                          {formatCurrency(order.discountTotal)}
                        </span>
                      )}
                    </div>
                    <p className="text-right font-medium text-[color:var(--text-strong)]">
                      {formatCurrency(order.netRevenue)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No orders match this view"
            description="Adjust the search or the local channel, region, and status filters to broaden the list."
          />
        )}
      </ChartCard>

      <OrderDetailDialog
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null);
        }}
        order={selectedOrder}
      />
    </PageShell>
  );
}
