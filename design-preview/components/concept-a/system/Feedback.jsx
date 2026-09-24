"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Skeleton } from "@/components/shared/ui/Skeleton";
import { SkeletonCard } from "../cards/SkeletonCard";
import { EmptyState } from "../browse/Results";
import { Button } from "../ui/Button";
import { Caption } from "./Section";
import { COPY } from "../copy";

export function Feedback() {
  const { t, ui, money } = useLang();
  const { toast } = useStore();
  const demoBrowse = {
    setSearch: (q) => toast({ tone: "info", title: ui("search"), description: q }),
    clearAll: () => toast({ tone: "neutral", title: ui("clearFilters") }),
  };
  const toasts = [
    ["success", ui("bidPlaced"), money(3200)],
    ["warning", ui("youAreOutbid"), ui("outbidToast", { amount: money(3250) })],
    ["info", ui("timeExtended"), ui("antiSnipe")],
    ["neutral", ui("removedFromWatchlist"), undefined],
  ];
  return (
    <div className="space-y-12">
      <div>
        <Caption>{t(COPY.skeletons)}</Caption>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <div className="col-span-2 space-y-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4 border-b border-line pb-4">
                <Skeleton className="size-20 shrink-0 rounded-card" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-3 w-24 rounded-xs" />
                  <Skeleton className="h-5 w-4/5 rounded-xs" />
                  <Skeleton className="h-5 w-1/3 rounded-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Caption>{t(COPY.emptyStateLabel)}</Caption>
        <EmptyState browse={demoBrowse} headingAs="h3" />
      </div>
      <div>
        <Caption>{t(COPY.toasts)}</Caption>
        <div className="flex flex-wrap gap-3">
          {toasts.map(([tone, title, description]) => (
            <Button key={tone} variant="quiet" size="sm" onClick={() => toast({ tone, title, description })}>
              {title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
