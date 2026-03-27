"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto flex w-full max-w-[1440px] flex-col gap-6 lg:gap-7", className)}
    >
      {children}
    </motion.div>
  );
}
