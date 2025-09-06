"use client";

import * as React from "react";
import { type ToolId, getToolComponent } from "@/lib/tools";
import { Skeleton } from "@/components/ui/skeleton";

interface ToolLoaderProps {
  toolId: ToolId;
}

const ToolLoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-1/3" />
    <Skeleton className="h-6 w-2/3" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

export function ToolLoader({ toolId }: ToolLoaderProps) {
  const ActiveToolComponent = React.useMemo(() => getToolComponent(toolId), [toolId]);

  return (
    <React.Suspense fallback={<ToolLoadingSkeleton />}>
      {ActiveToolComponent ? <ActiveToolComponent /> : <ToolLoadingSkeleton />}
    </React.Suspense>
  );
}
