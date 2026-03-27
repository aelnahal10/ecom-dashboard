"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/overview", label: "Overview" },
  { href: "/products", label: "Products" },
  { href: "/channels", label: "Channels" },
  { href: "/customers", label: "Customers" },
  { href: "/insights", label: "Insights" },
  { href: "/orders", label: "Orders" },
  { href: "/settings", label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto px-6 pb-3 lg:hidden md:px-8">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition",
            pathname === item.href
              ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-white"
              : "border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--muted-foreground)]",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
