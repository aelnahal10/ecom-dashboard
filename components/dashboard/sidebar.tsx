"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BrainCircuit,
  Boxes,
  CircleGauge,
  PackageSearch,
  Settings2,
  ShoppingBag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/overview", label: "Overview", icon: CircleGauge },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/channels", label: "Channels", icon: BarChart3 },
  { href: "/customers", label: "Customers", icon: ShoppingBag },
  { href: "/insights", label: "Insights", icon: BrainCircuit },
  { href: "/orders", label: "Orders", icon: PackageSearch },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[304px] shrink-0 flex-col border-r border-white/6 bg-[linear-gradient(180deg,#0b0b0b,#131313)] px-5 py-6 text-white lg:flex">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              Aurelium Goods
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              Revenue Intelligence
            </h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-[linear-gradient(135deg,#b9895f,#d4a373)] text-[#1a120d] shadow-lg">
            RI
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/60">
          Profit-first commerce analytics for brands scaling with intent.
        </p>
        <div className="mt-5 flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Account</p>
            <p className="mt-1 text-sm font-medium text-white/90">Mid-market Shopify</p>
          </div>
          <Badge className="bg-[color:rgba(212,163,115,0.16)] text-[color:#f1d1ae]">Live Demo</Badge>
        </div>
      </div>

      <nav className="mt-8 space-y-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-[22px] px-4 py-3.5 text-sm font-medium text-white/60 transition",
                active
                  ? "bg-[color:var(--surface-elevated)] text-[color:var(--foreground)] shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                  : "hover:bg-white/6 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition",
                  active ? "text-[color:var(--primary)]" : "text-white/45 group-hover:text-white",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
          Snapshot
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">£104k</p>
        <p className="mt-2 text-sm text-white/55">Estimated March revenue run-rate</p>
      </div>
    </aside>
  );
}
