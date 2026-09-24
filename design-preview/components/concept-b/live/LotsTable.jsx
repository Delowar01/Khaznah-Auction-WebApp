"use client";

import { ListOrdered } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Badge, LiveBadge } from "../ui/Badge";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

function Status({ item, isNext }) {
  const { ui } = useLang();
  if (item.status === "live") return <LiveBadge>{ui("liveNow")}</LiveBadge>;
  if (item.status === "sold") {
    return (
      <span className="inline-flex flex-wrap items-baseline justify-end gap-1 kb-xs font-semibold text-success">
        {ui("soldFor")} <Money value={item.finalBid} className="font-extrabold" />
      </span>
    );
  }
  if (item.status === "reserve_not_met") return <Badge tone="neutral">{ui("passed")}</Badge>;
  return <Badge tone={isNext ? "primary" : "outline"}>{isNext ? ui("upNext") : ui("upcoming")}</Badge>;
}

/** Every lot in the sale with its order, starting bid and result. */
export function LotsTable({ live, className = "" }) {
  const { t, ui, pl } = useLang();
  return (
    <section aria-labelledby="kb-lots" className={cx("overflow-hidden rounded-xl border border-line bg-surface", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id="kb-lots" className="flex items-center gap-2 kb-md font-bold text-fg">
          <ListOrdered aria-hidden="true" className="size-4 text-primary" />
          {ui("lotsInSale")}
        </h2>
        <span className="kb-xs text-fg-3">
          {pl("lots", live.items.length)} · {ui("completedLots")} {live.completed.length}
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead className="bg-surface-2/60 kb-2xs text-fg-3">
          <tr>
            <th scope="col" className="w-12 px-4 py-2 text-start font-bold">
              {t(COPY.lotNo)}
            </th>
            <th scope="col" className="px-2 py-2 text-start font-bold">
              {t(COPY.line)}
            </th>
            <th scope="col" className="hidden px-2 py-2 text-end font-bold sm:table-cell">
              {ui("startingBid")}
            </th>
            <th scope="col" className="px-4 py-2 text-end font-bold">
              {t(COPY.status)}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {live.items.map((item) => (
            <tr key={item.order} className={cx(item.status === "live" && "bg-live/5")}>
              <td className="px-4 py-2.5 kb-sm font-bold text-fg-3 tabular">{String(item.order).padStart(2, "0")}</td>
              <td className="px-2 py-2.5">
                <div className="flex items-center gap-3">
                  <Plate image={item.image} alt="" sizes="44px" pad="p-1" className="size-11 shrink-0 rounded-md border border-line" />
                  <span className={cx("line-clamp-2 kb-sm", item.status === "live" ? "font-bold text-fg" : "font-medium text-fg-2")}>{t(item.title)}</span>
                </div>
              </td>
              <td className="hidden px-2 py-2.5 text-end sm:table-cell">
                <Money value={item.startingBid} className="kb-sm text-fg-2" />
              </td>
              <td className="px-4 py-2.5 text-end">
                <Status item={item} isNext={live.nextItem?.order === item.order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
