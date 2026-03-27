"use client";

import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Order } from "@/types/dashboard";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order.orderNumber}</DialogTitle>
          <DialogDescription>
            {order.customerName} · {format(new Date(order.createdAt), "dd MMM yyyy")} · {order.channel}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Net revenue</p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(order.netRevenue)}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Contribution profit</p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(order.contributionProfit)}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Refund rate</p>
            <p className="mt-3 text-3xl font-semibold">
              {formatPercent(order.grossRevenue ? order.refundAmount / order.grossRevenue : 0)}
            </p>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Items</p>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={`${order.id}-${item.productId}`}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-subtle)] px-4 py-3"
              >
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">
                    {item.category} · Qty {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{formatCurrency(item.grossRevenue)}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">Discount {formatCurrency(item.discountAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
