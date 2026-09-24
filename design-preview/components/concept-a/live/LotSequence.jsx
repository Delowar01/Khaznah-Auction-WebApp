"use client";

import { Check, Minus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";

/** Order of sale: completed (sold / not sold), the lot on the block, and what's next. */
export function LotSequence({ items, currentIndex }) {
  const { t, ui } = useLang();
  return (
    <ol className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const isCurrent = index === currentIndex && item.status === "live";
        const done = item.status === "sold" || item.status === "reserve_not_met";
        return (
          <li
            key={item.order}
            aria-current={isCurrent ? "step" : undefined}
            className={`grid grid-cols-[2rem_3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-3 ${isCurrent ? "bg-surface" : ""} ${done ? "text-fg-2" : ""}`}
          >
            <span dir="ltr" className={`a-serif text-center text-[20px] tabular ${isCurrent ? "text-live" : "text-fg-3"}`}>
              {String(item.order).padStart(2, "0")}
            </span>
            <span className={`relative block size-14 overflow-hidden rounded-card bg-plate ${done ? "opacity-70" : ""}`}>
              <Img image={item.image} alt="" sizes="56px" className="a-plate-img absolute inset-0 size-full object-contain p-1.5" />
            </span>
            <span className="min-w-0">
              <span className={`block truncate text-[14px] rtl:text-[15px] ${isCurrent ? "font-semibold text-fg" : "text-fg"}`}>{t(item.title)}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-fg-3">
                {isCurrent ? (
                  <>
                    <span className="kz-live-dot !size-1.5" aria-hidden="true" />
                    <span className="font-semibold text-live">{ui("liveNow")}</span>
                  </>
                ) : item.status === "sold" ? (
                  <>
                    <Check aria-hidden="true" className="size-3.5 text-success" />
                    {ui("sold")}
                  </>
                ) : item.status === "reserve_not_met" ? (
                  <>
                    <Minus aria-hidden="true" className="size-3.5" />
                    {ui("passed")}
                  </>
                ) : (
                  <>{ui("startingBid")}</>
                )}
              </span>
            </span>
            <span className="pe-1 text-end text-[14px] font-semibold text-fg">
              {item.status === "sold" ? <Money value={item.finalBid} /> : item.status === "reserve_not_met" ? <span className="text-fg-3">—</span> : isCurrent ? <Money value={item.currentBid} /> : <Money value={item.startingBid} className="font-normal text-fg-2" />}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
