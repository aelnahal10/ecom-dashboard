import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-subtle)] text-[color:var(--accent-strong)]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[color:var(--text-strong)]">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--text-soft)]">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
