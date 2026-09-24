"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

/** One lot's marker: filled = sold, outline = upcoming, pulsing = live. */
export function LotMarker({ status, size = 12 }) {
  if (status === "live") return <Diamond variant="live" size={size + 2} />;
  if (status === "sold") return <Diamond size={size} className="text-accent" />;
  if (status === "reserve_not_met") return <Diamond variant="outline" size={size} className="text-fg-3 opacity-70" />;
  return <Diamond variant="outline" size={size} className="text-fg-2" />;
}

export function LotStatusText({ item, className = "" }) {
  const { ui } = useLang();
  if (item.status === "live") return <span className={cx("font-semibold text-live", className)}>{ui("liveNow")}</span>;
  if (item.status === "sold") return <Money value={item.finalBid} className={cx("c-num font-semibold text-fg", className)} />;
  if (item.status === "reserve_not_met") return <span className={cx("text-fg-3", className)}>{ui("passed")}</span>;
  return <Money value={item.startingBid} className={cx("c-num text-fg-2", className)} />;
}

/** The sale's lot sequence as a horizontal timeline of diamonds. */
export function LotStrip({ items, label, className = "" }) {
  const { t, ui } = useLang();
  return (
    <div role="region" aria-label={label} tabIndex={0} className={cx("c-scroller -mx-4 px-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0", className)}>
      <ol className="relative flex w-full min-w-[46rem] justify-between">
        <span aria-hidden="true" className="absolute inset-x-[5%] top-[0.6875rem] h-px bg-line-strong" />
        {items.map((item) => (
          <li key={item.order} className="relative flex flex-1 flex-col items-center text-center" aria-current={item.status === "live" ? "step" : undefined}>
            <span className="relative z-10 grid size-[1.375rem] place-items-center bg-bg">
              <LotMarker status={item.status} />
            </span>
            <span className="c-num mt-3 text-xs text-fg-3">{String(item.order).padStart(2, "0")}</span>
            <span className="sr-only">
              {ui("lotNumber")} {item.order}: {t(item.title)}
            </span>
            <LotStatusText item={item} className="mt-1 text-xs" />
          </li>
        ))}
      </ol>
    </div>
  );
}
