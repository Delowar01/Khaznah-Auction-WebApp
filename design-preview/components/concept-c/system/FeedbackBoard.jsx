"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Skeleton } from "@/components/shared/ui/Skeleton";
import { COPY } from "../copy";
import { CardSkeleton } from "../cards/LotCard";
import { SortMenu } from "../browse/Controls";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { GradeGuideModal } from "../ui/GradeGuideModal";
import { StateLabel } from "./SystemSection";

function Panel({ label, className = "", children }) {
  return (
    <div className={`rounded-md border border-line bg-surface p-6 ${className}`}>
      <StateLabel>{label}</StateLabel>
      {children}
    </div>
  );
}

/** Toasts, modal, dropdown, loading skeletons and the empty state. */
export function FeedbackBoard() {
  const { t, ui, money } = useLang();
  const { toast } = useStore();
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState("recommended");
  const toasts = [
    { tone: "success", label: COPY.toastSuccess, title: ui("bidPlaced"), description: money(3200) },
    { tone: "warning", label: COPY.toastWarning, title: ui("youAreOutbid"), description: ui("outbidToast", { amount: money(3250) }) },
    { tone: "info", label: COPY.toastInfo, title: ui("timeExtended"), description: ui("antiSnipe") },
    { tone: "neutral", label: COPY.toastNeutral, title: ui("maxBidCleared") },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Panel label={t(COPY.toastDemo)}>
        <div className="grid grid-cols-2 gap-2">
          {toasts.map((item) => (
            <Button key={item.tone} variant="outline" size="sm" onClick={() => toast({ tone: item.tone, title: item.title, description: item.description })}>
              {t(item.label)}
            </Button>
          ))}
        </div>
      </Panel>
      <Panel label={t(COPY.modalDemo)}>
        <Button variant="night" icon={BookOpen} onClick={() => setModal(true)}>
          {t(COPY.openModal)}
        </Button>
        <GradeGuideModal open={modal} onClose={() => setModal(false)} current="B" />
      </Panel>
      <Panel label={t(COPY.dropdownDemo)}>
        <SortMenu browse={{ state: { sort }, setSort }} />
      </Panel>
      <Panel label={t(COPY.stSkeleton)} className="lg:col-span-2">
        <div aria-busy="true" className="grid gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,1.2fr)]">
          <CardSkeleton />
          <CardSkeleton />
          <div aria-hidden="true" className="space-y-3 self-center">
            <Skeleton className="h-8 w-3/4 rounded-xs" />
            <Skeleton className="h-4 w-full rounded-xs" />
            <Skeleton className="h-4 w-5/6 rounded-xs" />
            <Skeleton className="h-4 w-2/3 rounded-xs" />
            <Skeleton className="mt-6 h-12 w-40 rounded-control" />
          </div>
        </div>
        <p className="sr-only">{ui("loadingLots")}</p>
      </Panel>
      <Panel label={t(COPY.stEmpty)} className="p-0!">
        <EmptyState titleAs="h3" title={ui("emptyTitle")} text={ui("emptyText")} className="py-8">
          <Button variant="outline" size="sm">
            {ui("clearFilters")}
          </Button>
        </EmptyState>
      </Panel>
    </div>
  );
}
