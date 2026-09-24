"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "../copy";
import { PlateImage } from "../ui/Frame";
import { cx } from "../ui/cx";
import { LotMarker, LotStatusText } from "./LotStrip";

const LABEL = { sold: "soldFor", live: "currentBid", staged: "startingBid" };

/** The sale's lot sequence as a vertical timeline of diamonds (collapsible on small screens). */
export function LotTimeline({ live }) {
  const { t, ui } = useLang();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const { items } = live;

  return (
    <section aria-labelledby="sequence-title">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
        <h2 id="sequence-title" className="c-h3">
          {ui("lotsInSale")}
        </h2>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={listId} className="c-btn c-btn--ghost c-btn--sm lg:hidden">
          {t(open ? COPY.hideLots : COPY.showLots)}
          <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      <ol id={listId} className={cx("relative mt-2", open ? "block" : "hidden lg:block")}>
        <span aria-hidden="true" className="absolute bottom-8 start-[0.6875rem] top-8 w-px bg-line-strong" />
        {items.map((item) => {
          const current = item.status === "live";
          return (
            <li key={item.order} aria-current={current ? "step" : undefined} className={cx("relative grid grid-cols-[1.375rem_3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3 sm:gap-4", current && "-mx-3 rounded-md bg-surface px-3 ring-1 ring-live/30")}>
              <span className="relative z-10 grid size-[1.375rem] place-items-center bg-bg">
                <LotMarker status={item.status} />
              </span>
              <PlateImage image={item.image} alt="" sizes="56px" zoom={false} className="size-14 rounded-sm" />
              <div className="min-w-0">
                <p className="c-num text-xs text-fg-3">{String(item.order).padStart(2, "0")}</p>
                <p className={cx("line-clamp-1 text-[0.9375rem]", current ? "font-semibold text-fg" : "text-fg-2")}>{t(item.title)}</p>
              </div>
              <div className="text-end">
                {LABEL[item.status] ? <p className="text-xs text-fg-3">{ui(LABEL[item.status])}</p> : null}
                <LotStatusText item={item.status === "live" ? { ...item, status: "sold", finalBid: item.currentBid } : item} className="text-sm" />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
