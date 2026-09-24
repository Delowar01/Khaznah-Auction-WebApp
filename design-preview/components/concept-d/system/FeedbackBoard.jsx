"use client";

import { useState } from "react";
import { ArrowDown, Gavel, Menu, PanelBottomOpen, SquareStack, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useBrowse } from "@/lib/useBrowse";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { EmptyState } from "../ui/EmptyState";
import { BoardSkeleton } from "../cards/LotBoard";
import { SortListbox } from "../browse/BrowseToolbar";
import { FilterDrawer } from "../browse/FilterDrawer";
import { useChrome } from "../layout/ChromeContext";
import { useCopy } from "../lib/useCopy";
import { Specimen } from "./SystemSection";

/** Skeleton, empty state, toasts, modal, dropdown, drawers, paging, menu. */
export function FeedbackBoard() {
  const { ui, money } = useLang();
  const { toast } = useStore();
  const { openMenu } = useChrome();
  const c = useCopy();
  const browse = useBrowse({ pageSize: 6, syncUrl: false });
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const toasts = [
    { tone: "success", key: "toastSuccess", title: c("demoToastTitle"), description: money(3200) },
    { tone: "warning", key: "toastWarning", title: ui("youAreOutbid"), description: ui("outbidToast", { amount: money(3250) }) },
    { tone: "info", key: "toastInfo", title: ui("timeExtended"), description: ui("antiSnipe") },
    { tone: "neutral", key: "toastNeutral", title: ui("maxBidCleared") },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="d-panel space-y-7 p-5">
        <Specimen label={c("sysSkeleton")}>
          <div className="w-full">
            <BoardSkeleton rows={3} />
          </div>
        </Specimen>
        <Specimen label={c("sysToasts")}>
          {toasts.map((item) => (
            <Button key={item.key} variant="secondary" size="sm" onClick={() => toast({ tone: item.tone, title: item.title, description: item.description })}>
              {c(item.key)}
            </Button>
          ))}
        </Specimen>
        <Specimen label={c("sysOverlays")}>
          <Button variant="primary" size="md" icon={SquareStack} onClick={() => setModal(true)}>
            {c("openModal")}
          </Button>
          <SortListbox browse={browse} />
          <Button variant="secondary" size="md" icon={PanelBottomOpen} onClick={() => setDrawer(true)}>
            {c("openDrawer")}
          </Button>
          <Button variant="secondary" size="md" icon={Menu} onClick={openMenu}>
            {c("openMenu")}
          </Button>
        </Specimen>
        <Specimen label={c("sysPaging")}>
          <Pagination page={browse.page} pageCount={browse.pageCount} onChange={browse.setPage} />
          <Button variant="secondary" size="md" icon={ArrowDown} loading={browse.loading} disabled={!browse.hasMore} onClick={browse.loadMore}>
            {c("loadMoreCount", { n: 6 })}
          </Button>
          <span className="d-num text-xs text-fg-3">{ui("showingOf", { shown: browse.shownItems.length, total: browse.total })}</span>
        </Specimen>
      </div>
      <EmptyState title={ui("emptyTitle")} text={ui("emptyText")} headingLevel={3}>
        <Button variant="primary" size="md" onClick={() => toast({ tone: "neutral", title: ui("clearFilters") })}>
          {ui("clearFilters")}
        </Button>
      </EmptyState>

      <Modal open={modal} onClose={() => setModal(false)} title={c("modalDemoTitle")} variant="sheet" panelClassName="rounded-t-2xl border border-line-strong bg-elevated shadow-overlay md:rounded-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-xl bg-accent/14 text-auction">
              <Gavel aria-hidden="true" className="size-5" />
            </span>
            <button type="button" onClick={() => setModal(false)} aria-label={ui("close")} className="grid size-10 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-fg">
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <p className="mt-4 text-lg font-semibold text-fg" aria-hidden="true">
            {c("modalDemoTitle")}
          </p>
          <p className="mt-2 text-sm text-fg-2">{ui("bindingBid")}</p>
          <p className="mt-2 text-sm text-fg-2">{ui("antiSnipe")}</p>
          <Button variant="gold" size="lg" className="mt-6 w-full" onClick={() => setModal(false)}>
            {ui("close")}
          </Button>
        </div>
      </Modal>
      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} browse={browse} />
    </div>
  );
}
