import { Skeleton } from "@/components/shared/ui/Skeleton";

export function SkeletonCard({ ratio = "aspect-[4/5]" }) {
  return (
    <div aria-hidden="true">
      <Skeleton className={`${ratio} w-full rounded-card`} />
      <Skeleton className="mt-4 h-3 w-24 rounded-xs" />
      <Skeleton className="mt-3 h-5 w-4/5 rounded-xs" />
      <Skeleton className="mt-2 h-5 w-3/5 rounded-xs" />
      <Skeleton className="mt-5 h-7 w-28 rounded-xs" />
    </div>
  );
}
