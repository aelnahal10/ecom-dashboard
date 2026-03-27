"use client";

import { useSyncExternalStore } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function ClientChart({
  children,
  className = "h-full w-full",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return <Skeleton className={className} />;
  }

  return <>{children}</>;
}
