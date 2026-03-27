import type * as React from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-[linear-gradient(110deg,rgba(15,23,42,0.04),rgba(255,255,255,0.7),rgba(15,23,42,0.04))] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
