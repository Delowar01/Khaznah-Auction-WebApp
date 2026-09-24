"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useRemaining } from "@/lib/clock";
import { auctionPhase, detailPath, getCategory } from "@/lib/catalog";
import { Money } from "@/components/shared/ui/Money";
import { CardImage } from "./CardImage";
import { StatusLabel } from "../ui/Status";
import { CountdownText } from "../ui/Countdown";
import { WatchButton } from "../ui/Actions";

/** Catalogue-entry card for timed auctions (live, ending soon, upcoming, sold). */
export function AuctionCard({ product, priority = false, ratio, className = "", forceWatched }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const upcoming = product.status === "scheduled";
  const remaining = useRemaining(upcoming ? product.startsIn : product.endsIn);
  const phase = auctionPhase(product, remaining);
  const href = link(detailPath(product));
  const category = getCategory(product.category);
  const statusKey = phase === "critical" ? "critical" : phase === "urgent" ? "urgent" : phase;
  const done = phase === "sold" || phase === "ended";

  return (
    <article className={`group relative ${className}`}>
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <CardImage image={product.images[0]} alt="" priority={priority} ratio={ratio}>
          <div className="absolute start-3 top-3 rounded-full bg-surface/92 px-3 py-1.5 backdrop-blur">
            <StatusLabel status={statusKey} />
          </div>
          {done ? <div className="absolute inset-0 bg-bg/35" aria-hidden="true" /> : null}
        </CardImage>
      </Link>
      <WatchButton slug={product.slug} className="absolute end-3 top-3" forcePressed={forceWatched} />
      <div className="pt-4">
        <p className="a-eyebrow !text-fg-3">
          {ui("lotNumber")} {product.lot.replace("KZ-", "")} · {t(category?.name)}
        </p>
        <h3 className="a-serif mt-2 min-h-[2.36em] text-[21px] leading-[1.18] text-fg rtl:min-h-[2.9em] rtl:leading-[1.45]">
          <Link href={href} className="a-underline-hover line-clamp-2 outline-none focus-visible:underline">
            {t(product.title)}
          </Link>
        </h3>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-fg-3 rtl:text-xs rtl:normal-case rtl:tracking-normal">
              {phase === "sold" ? ui("soldFor") : upcoming ? ui("startingBid") : ui("currentBid")}
            </p>
            <p className="a-serif mt-1 text-[26px] leading-none text-fg">
              <Money value={product.currentBid} symbolClassName="text-[0.8em]" />
            </p>
          </div>
          <div className="text-end text-[13px] leading-tight">
            <p className="text-fg-3">{upcoming ? ui("startsIn") : done ? pl("bids", product.bidCount) : pl("bids", product.bidCount)}</p>
            <p className="mt-1 font-semibold text-fg">
              {done ? ui(phase === "sold" ? "sold" : "ended") : <CountdownText seconds={remaining} />}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
