"use client";

import { useId } from "react";
import { Check, Minus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { LotImage } from "../ui/LotImage";
import { useCopy } from "../lib/useCopy";

function QueueRow({ item, index }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const sold = item.status === "sold";
  const passed = item.status === "reserve_not_met";
  const live = item.status === "live";
  return (
    <li
      aria-current={live ? "true" : undefined}
      className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${live ? "bg-live/8 ring-1 ring-inset ring-live/35" : ""}`}
    >
      <span className="d-num w-5 shrink-0 text-center text-[11px] text-fg-3">{String(index + 1).padStart(2, "0")}</span>
      <LotImage image={item.image} alt="" sizes="48px" className="size-11 shrink-0 rounded-lg" inset="p-1" />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[13px] font-medium ${live ? "text-fg" : "text-fg-2"}`}>{t(item.title)}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px]">
          {live ? (
            <span className="flex items-center gap-1.5 whitespace-nowrap font-medium text-live">
              <span aria-hidden="true" className="kz-live-dot" />
              {c("lotLive")} · <Money value={item.currentBid} className="d-num" />
            </span>
          ) : sold ? (
            <span className="flex items-center gap-1 text-success">
              <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              {ui("soldFor")} <Money value={item.finalBid} className="d-num" />
            </span>
          ) : passed ? (
            <span className="flex items-center gap-1 text-fg-3">
              <Minus aria-hidden="true" className="size-3" />
              {ui("passed")}
            </span>
          ) : (
            <span className="text-fg-3">
              {c("opensAtBid", { amount: "" })}
              <Money value={item.startingBid} className="d-num text-fg-2" />
            </span>
          )}
        </p>
      </div>
    </li>
  );
}

/** Every lot in the sale: completed (sold / not sold), on the block, upcoming. */
export function LotQueue({ live, className = "" }) {
  const { ui } = useLang();
  const c = useCopy();
  const titleId = `queue-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <section aria-labelledby={titleId} className={`d-panel flex min-h-0 flex-col ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 id={titleId} className="text-sm font-semibold text-fg">
          {c("lotQueue")}
        </h2>
        <span className="d-num text-xs text-fg-3">
          {live.completed.length}/{live.items.length} {ui("completedLots")}
        </span>
      </div>
      <div role="region" aria-labelledby={titleId} tabIndex={0} className="d-scroll min-h-0 flex-1 overflow-y-auto p-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
        <ol className="space-y-1">
          {live.items.map((item, index) => (
            <QueueRow key={item.order} item={item} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
