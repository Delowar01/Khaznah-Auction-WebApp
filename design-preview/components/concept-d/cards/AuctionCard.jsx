"use client";

import { Check, Eye, Gavel } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { detailPath } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";
import { LotImage } from "../ui/LotImage";
import { OverlayChip, DeltaChip, LotTag } from "../ui/Chips";
import { GradeChip } from "../ui/GradeChip";
import { CountdownRing } from "../ui/CountdownRing";
import { TimeBar } from "../ui/TimeBar";
import { Sparkline } from "../ui/Sparkline";
import { HeatMeter } from "../ui/Meters";
import { WatchButton } from "../ui/Actions";
import { compactTime } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { CardShell, CardTitle } from "./CardShell";
import { auctionChip, useAuctionView } from "./useLotView";

const RING_TEXT = { ink: "text-fg", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

/** Auction listing card: status, ring, time bar, live price, sparkline, activity. */
export function AuctionCard({ product, override, priority = false, sizes, emphasis }) {
  const { link } = useConcept();
  const { t, ui, lang, pl } = useLang();
  const c = useCopy();
  const v = useAuctionView(product, override);
  const closed = v.phase === "sold" || v.phase === "ended";
  const upcoming = v.phase === "upcoming";
  const seconds = upcoming ? v.startsIn : v.remaining;
  const timeText = compactTime(seconds, lang);

  return (
    <CardShell>
      <div className="d-card-media relative aspect-[5/4]">
        <LotImage
          image={product.images[0]}
          alt={t(product.title)}
          priority={priority}
          sizes={sizes || "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"}
          fill
          className={closed ? "grayscale-[0.5]" : ""}
        />
        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          {v.isNew && v.phase === "live" ? <OverlayChip status="new" label={ui("justListed")} /> : <OverlayChip status={auctionChip(v.phase)} />}
          <WatchButton product={product} className="relative z-[2] size-9" />
        </div>
        <div className="absolute -bottom-7 end-3 z-[2] rounded-full bg-surface p-1 shadow-card">
          <CountdownRing fraction={v.fraction} size={52} stroke={3.5} tone={v.tone}>
            {v.phase === "sold" ? (
              <Check aria-hidden="true" className="size-5 text-success" />
            ) : v.phase === "ended" ? (
              <span className="d-num text-[10px] text-fg-3">00:00</span>
            ) : (
              <span className={`d-num text-[10.5px] font-medium leading-none ${RING_TEXT[v.tone]}`}>{timeText}</span>
            )}
          </CountdownRing>
          <span className="sr-only">{upcoming ? c("startsInAria", { time: timeText }) : closed ? ui(v.phase === "sold" ? "sold" : "ended") : c("timeLeftAria", { time: timeText })}</span>
        </div>
      </div>
      <TimeBar fraction={v.fraction} tone={v.tone} thickness="h-[2px]" className="rounded-none" />

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex min-h-6 flex-wrap items-center gap-1.5 pe-14">
          {emphasis === "heat" ? (
            <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-warning/12 px-1.5">
              <HeatMeter level={v.heat} showLabel={false} />
              <span className="d-num text-[11px] font-medium text-warning">{pl("bids", v.bidCount)}</span>
            </span>
          ) : (
            <LotTag lot={product.lot} />
          )}
          <GradeChip grade={product.grade} size="sm" />
        </div>
        <CardTitle href={link(detailPath(product))} className="mt-2.5">
          {t(product.title)}
        </CardTitle>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0 flex-1">
            <p className="d-label truncate text-fg-3">{upcoming ? ui("openingBid") : v.phase === "sold" ? ui("soldFor") : ui("currentBid")}</p>
            <p key={v.flash} className={`d-num mt-1 inline-block px-0.5 text-lg font-medium sm:text-xl ${v.own ? "text-auction" : "text-fg"} ${v.flash ? "d-flash" : ""}`}>
              <Money value={v.currentBid} />
            </p>
          </div>
          <Sparkline values={v.spark} tone={v.own ? "gold" : v.tone === "danger" ? "danger" : "ink"} className="mb-1.5 hidden sm:block" />
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-xs text-fg-3">
          <span className="d-num inline-flex items-center gap-1" title={ui("bidHistory")}>
            <Gavel aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{ui("bidHistory")}: </span>
            {formatNumber(v.bidCount)}
          </span>
          <span className="d-num inline-flex items-center gap-1">
            <Eye aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{c("watchingLabel")}: </span>
            {formatNumber(v.watchers)}
          </span>
          {!closed && !upcoming ? (
            <span className="hidden sm:inline-flex">
              <HeatMeter level={v.heat} showLabel={false} />
            </span>
          ) : null}
          {v.step > 0 && !closed ? (
            <span className="ms-auto hidden sm:inline-flex">
              <DeltaChip amount={v.step} className="h-5" />
            </span>
          ) : null}
        </div>
      </div>
    </CardShell>
  );
}
