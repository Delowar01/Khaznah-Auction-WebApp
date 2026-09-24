"use client";

import { Activity, Eye, Gavel, Users } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { formatNumber } from "@/lib/format";
import { DeltaChip } from "../ui/Chips";
import { HeatMeter } from "../ui/Meters";
import { heatLevel } from "../lib/data";
import { useTween } from "../lib/hooks";
import { useCopy } from "../lib/useCopy";

/** Current bid (tweened, flashes on change), rise since opening, activity. */
export function PriceBlock({ product, auction, velocity, label }) {
  const { ui } = useLang();
  const c = useCopy();
  const price = useTween(auction.currentBid);
  const rise = auction.currentBid - product.startingBid;
  const pct = product.startingBid ? Math.round((rise / product.startingBid) * 100) : 0;
  const own = auction.bidderState === "highest" || auction.bidderState === "won";
  const stats = [
    { icon: Gavel, label: c("bidsBidders"), value: auction.bidCount },
    { icon: Users, label: c("biddersLabel"), value: auction.bidderCount },
    { icon: Eye, label: c("watchingLabel"), value: auction.watchers },
  ];
  const velocityText = velocity === 0 ? c("velocityNone") : velocity === 1 ? c("velocityOne") : c("velocity", { n: velocity });

  return (
    <div>
      <p className="d-label text-fg-3">{label || ui("currentBid")}</p>
      <p key={auction.flash} className={`d-num -ms-1 mt-1.5 inline-block rounded-md px-1 text-[42px] font-medium leading-none sm:text-[46px] ${own ? "text-auction" : "text-fg"} ${auction.flash ? "d-flash" : ""}`}>
        <Money value={price} />
      </p>
      {rise > 0 ? (
        <p className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-fg-3">
          <DeltaChip amount={rise} />
          <span className="d-num text-success" dir="ltr">
            +{pct}%
          </span>
          <span>{c("sinceOpening")}</span>
        </p>
      ) : null}
      <dl className="mt-4 grid grid-cols-3 divide-x divide-line rounded-xl border border-line rtl:divide-x-reverse">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0 px-3 py-2.5">
            <dt className="flex items-center gap-1.5 text-[11px] text-fg-3">
              <stat.icon aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{stat.label}</span>
            </dt>
            <dd className="d-num mt-1 text-base font-medium text-fg">{formatNumber(stat.value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2.5 flex items-center gap-2 text-xs text-fg-2">
        <Activity aria-hidden="true" className="size-3.5 d-ink" />
        <span className="flex-1">{velocityText}</span>
        <HeatMeter level={heatLevel(auction.bidCount, velocity)} />
      </p>
    </div>
  );
}
