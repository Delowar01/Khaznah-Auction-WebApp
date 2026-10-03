"use client";

import { ArrowRight, Check, ListOrdered, Minus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useLotQueue } from "@/components/shared/live/hooks";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { LiveBadge } from "../ui/Badge";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";

// Status rule across the top of each cell; the status is always written too.
const RULE = { live: "bg-live", sold: "bg-success", passed: "bg-line-strong", next: "bg-primary", upcoming: "bg-line" };

function Status({ lot }) {
  if (lot.status === "live") return <LiveBadge>{lot.label}</LiveBadge>;
  if (lot.status === "sold") {
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-1 kb-xs font-semibold text-success">
        <Check aria-hidden="true" className="size-3.5 shrink-0 self-center" strokeWidth={2.5} />
        {lot.label} <Money value={lot.finalBid} className="font-extrabold" />
      </span>
    );
  }
  if (lot.status === "passed") {
    return (
      <span className="inline-flex items-center gap-1 kb-xs font-semibold text-fg-2">
        <Minus aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
        {lot.label}
      </span>
    );
  }
  if (lot.status === "next") {
    return (
      <span className="inline-flex items-center gap-1 kb-xs font-bold text-primary">
        <DirIcon icon={ArrowRight} className="size-3.5" />
        {lot.label}
      </span>
    );
  }
  return <span className="kb-xs font-medium text-fg-3">{lot.label}</span>;
}

/**
 * The running order: all ten lots in sequence with their result or status.
 * One compact column on phones, two from 640 px, five across (two rows) on
 * desktop. The lot on the block is marked as the current step.
 */
export function LotQueue({ room }) {
  const { ui, pl } = useLang();
  const lots = useLotQueue(room.live);
  return (
    <section aria-labelledby="kb-lots" className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-3">
        <h2 id="kb-lots" className="flex items-center gap-2 kb-md font-bold text-fg">
          <ListOrdered aria-hidden="true" className="size-4 text-primary" />
          {ui("lotsInSale")}
        </h2>
        <span className="kb-xs text-fg-3">
          {pl("lots", room.live.items.length)} · {room.event.progress}
        </span>
      </div>
      <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
        {lots.map((lot) => (
          <li key={lot.key} aria-current={lot.current ? "step" : undefined} className={cx("relative bg-surface", lot.status === "live" && "bg-live/[0.04]")}>
            <span aria-hidden="true" className={cx("absolute inset-x-0 top-0 h-[3px]", RULE[lot.status])} />
            <div className="grid grid-cols-[28px_44px_minmax(0,1fr)] items-center gap-2.5 px-3 pb-2.5 pt-3.5 lg:grid-cols-[44px_minmax(0,1fr)] lg:items-start">
              <span className="kb-sm font-extrabold text-fg-3 tabular lg:col-span-2" dir="ltr">
                {String(lot.order).padStart(2, "0")}
              </span>
              <Plate image={lot.image} alt="" sizes="44px" pad="p-1" className="size-11 rounded-md border border-line" />
              <div className="min-w-0">
                <p className={cx("line-clamp-2 kb-sm", lot.status === "live" ? "font-bold text-fg" : "font-medium text-fg-2")}>{lot.title}</p>
                <div className="mt-1">
                  <Status lot={lot} />
                </div>
                <p className="mt-0.5 hidden kb-2xs text-fg-3 lg:block">
                  {ui("startingBid")} <Money value={lot.startingBid} />
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
