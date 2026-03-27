"use client";

import { BarChart3, Package, RotateCcw, TrendingUp } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProductPerformance } from "@/types/dashboard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

export function ProductDetailDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductPerformance | null;
}) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {product.category} performance inside the active dashboard filter scope.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/60">
              <BarChart3 className="h-4 w-4" />
              Revenue
            </div>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(product.netRevenue)}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="h-4 w-4" />
              Contribution margin
            </div>
            <p className="mt-3 text-3xl font-semibold">{formatPercent(product.marginRate)}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/60">
              <Package className="h-4 w-4" />
              Units sold
            </div>
            <p className="mt-3 text-3xl font-semibold">{formatNumber(product.unitsSold)}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-white/60">
              <RotateCcw className="h-4 w-4" />
              Refund rate
            </div>
            <p className="mt-3 text-3xl font-semibold">{formatPercent(product.refundRate)}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Margin notes</p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]/80">
              This product is {product.lowMarginHighRevenue ? "flagged for margin pressure" : "healthy inside the current mix"}.
              It is carrying {formatCurrency(product.contributionProfit)} in contribution profit across{" "}
              {formatNumber(product.orders)} orders.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Commercial readout</p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]/80">
              Average discount rate is {formatPercent(product.averageDiscountRate)} with a recent trend of{" "}
              {product.recentTrend >= 0 ? "+" : ""}
              {product.recentTrend.toFixed(1)}% versus the previous comparison window.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
