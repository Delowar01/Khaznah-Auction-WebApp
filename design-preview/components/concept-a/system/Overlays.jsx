"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useBrowse } from "@/lib/useBrowse";
import { getProduct } from "@/lib/catalog";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { SortMenu } from "../browse/Toolbar";
import { FilterSheet } from "../browse/FilterSheet";
import { MobileMenu } from "../layout/MobileMenu";
import { GradeGuideModal } from "../detail/GradeGuideModal";
import { ConfirmBuyNowModal } from "../auction/ConfirmModals";
import { Caption } from "./Section";
import { COPY } from "../copy";

export function Overlays() {
  const { t, ui, money } = useLang();
  const { toast } = useStore();
  const browse = useBrowse({ pageSize: 6, syncUrl: false });
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const close = () => setOpen(null);
  const fridge = getProduct("fridge-690");

  const loadMore = () => {
    setLoadingMore(true);
    window.setTimeout(() => setLoadingMore(false), 1100);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <Caption>{t(COPY.openDialog)}</Caption>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => setOpen("buy")}>
              {ui("buyNowFor", { amount: money(fridge.buyNowPrice) })}
            </Button>
            <Button variant="quiet" size="sm" onClick={() => setOpen("guide")}>
              {t(COPY.openGuide)}
            </Button>
          </div>
        </div>
        <div>
          <Caption>{t(COPY.dropdown)}</Caption>
          <SortMenu browse={browse} />
        </div>
        <div>
          <Caption>{ui("filters")}</Caption>
          <Button variant="quiet" size="sm" onClick={() => setOpen("filters")}>
            {t(COPY.openDrawer)}
          </Button>
        </div>
        <div>
          <Caption>{ui("menu")}</Caption>
          <Button variant="quiet" size="sm" onClick={() => setOpen("menu")}>
            {t(COPY.openMenu)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <Caption>{t(COPY.numbered)}</Caption>
          <Pagination page={page} pageCount={4} onChange={setPage} />
        </div>
        <div>
          <Caption>{t(COPY.progressive)}</Caption>
          <div className="flex flex-col items-start gap-3">
            <p className="text-[13px] text-fg-2 tabular">{ui("showingOf", { shown: 12, total: 30 })}</p>
            <div className="h-px w-48 bg-line">
              <div className="h-px w-2/5 bg-fg" />
            </div>
            <Button variant="outline" size="sm" onClick={loadMore} loading={loadingMore} disabled={loadingMore}>
              {ui("loadMore")}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmBuyNowModal
        open={open === "buy"}
        onClose={close}
        product={fridge}
        onConfirm={() => toast({ tone: "success", title: t(COPY.boughtTitle), description: t(COPY.boughtText) })}
      />
      <GradeGuideModal open={open === "guide"} onClose={close} highlight="A" />
      <FilterSheet open={open === "filters"} onClose={close} browse={browse} />
      <MobileMenu open={open === "menu"} onClose={close} onSearch={close} />
    </div>
  );
}
