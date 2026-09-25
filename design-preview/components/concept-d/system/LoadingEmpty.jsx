"use client";

import { SearchX } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CardSkeleton, RowSkeleton } from "../cards/CardSkeleton";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { COPY } from "../copy";
import { Panel, Specimen } from "./SystemSection";

/** Skeleton loading for grid and list, and the empty results state. */
export function LoadingEmpty() {
  const { t, ui } = useLang();
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Panel>
        <Specimen label={t(COPY.skeletonLoading)}>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              <CardSkeleton />
              <CardSkeleton />
              <div className="max-sm:hidden">
                <CardSkeleton />
              </div>
              <div className="hidden xl:block">
                <CardSkeleton />
              </div>
            </div>
            <RowSkeleton />
          </div>
        </Specimen>
      </Panel>
      <Panel className="flex flex-col">
        <Specimen label={t(COPY.emptyState)} className="flex-1">
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface-2/50 py-8">
            <EmptyState icon={SearchX} title={ui("emptyTitle")} text={ui("emptyText")} compact>
              <Button variant="outline" size="sm">
                {ui("clearFilters")}
              </Button>
            </EmptyState>
          </div>
        </Specimen>
      </Panel>
    </div>
  );
}
