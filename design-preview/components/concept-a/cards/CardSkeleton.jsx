"use client";

import { Skeleton } from "@/components/shared/ui/Skeleton";

/** Placeholder matching the grid card while results load. */
export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface">
      <Skeleton className="aspect-square" />
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <Skeleton className="h-3 w-2/5 rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
        <Skeleton className="mt-2 h-5 w-1/2 rounded" />
        <div className="mt-auto flex items-center justify-between border-t border-line pt-2.5">
          <Skeleton className="h-6 w-2/5 rounded-full" />
          <Skeleton className="h-7 w-1/3 rounded-control" />
        </div>
      </div>
    </div>
  );
}

/** Placeholder matching the list-view row. */
export function RowSkeleton() {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 rounded-card border border-line bg-surface p-3 sm:grid-cols-[128px_1fr_auto] sm:gap-4">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="flex flex-col gap-2.5 py-1">
        <Skeleton className="h-3 w-1/4 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-2/5 rounded" />
      </div>
      <div className="hidden w-52 flex-col items-end gap-2.5 py-1 sm:flex">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-9 w-28 rounded-control" />
      </div>
    </div>
  );
}
