"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { LIVE_EVENT } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { formatNumber } from "@/lib/format";
import { useLive } from "../market/MarketProvider";
import { LotImage } from "../ui/LotImage";
import { TimeBar } from "../ui/TimeBar";
import { SellerAvatar } from "../ui/SellerAvatar";
import { useCopy } from "../lib/useCopy";
import { useChangeCount } from "../lib/hooks";

const PHASE_TONE = { live: "ink", going_once: "warning", going_twice: "danger", closing: "danger", intermission: "muted" };

/** Wide live-event card: stream poster, viewers, and the lot on the block. */
export function StreamCard() {
  const live = useLive();
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  const href = link("/live-auction");
  const bidFlash = useChangeCount(lot?.currentBid);

  return (
    <article aria-labelledby="stream-title" className="d-scope-dark group relative isolate flex min-h-[440px] overflow-hidden rounded-card border border-line bg-bg shadow-raised lg:min-h-[460px]">
      <Img image={LIVE_EVENT.stream} alt={c("streamAlt")} sizes="(min-width: 1024px) 66vw, 100vw" className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/35 to-black/30" />

      <div className="flex w-full flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="d-label inline-flex h-7 items-center gap-1.5 rounded-md bg-[var(--d-live-fill)] px-2.5 text-[var(--d-ov-fg)]">
            <span aria-hidden="true" className="kz-live-dot [--live:var(--d-ov-fg)]" />
            {ui("live")}
          </span>
          <span className="d-ov-chip d-num inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs">
            <Eye aria-hidden="true" className="size-3.5" />
            {formatNumber(live.viewers)}
            <span className="sr-only">{ui("viewers")}</span>
          </span>
          <span className="d-ov-chip ms-auto hidden h-7 items-center gap-2 rounded-md pe-2.5 ps-1 text-xs sm:inline-flex">
            <SellerAvatar seller={host} size="sm" className="size-5 rounded text-[8px]" />
            {t(host.name)}
          </span>
        </div>

        <div className="mt-auto grid gap-4 pt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:items-end xl:grid-cols-[minmax(0,1fr)_minmax(0,330px)]">
          <div className="min-w-0">
            <p className="text-sm text-[var(--d-ov-fg)]/80">{t(LIVE_EVENT.presenter)}</p>
            <h3 id="stream-title" className="d-tight mt-1 text-2xl font-semibold text-[var(--d-ov-fg)] text-balance sm:text-3xl">
              {t(LIVE_EVENT.title)}
            </h3>
            <Link
              href={href}
              className="d-btn-primary mt-5 inline-flex h-11 items-center gap-2 rounded-control bg-primary px-4 text-sm font-medium text-on-primary transition-colors after:absolute after:inset-0 hover:bg-primary-hover"
            >
              {ui("enterLiveRoom")}
              <DirIcon icon={ArrowRight} className="size-4" />
            </Link>
          </div>

          {lot ? (
            <div className="rounded-xl border border-white/10 bg-black/55 p-3.5 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <p className="d-label flex items-center gap-1.5 text-[var(--d-ov-live)]">
                  <span aria-hidden="true" className="kz-live-dot" />
                  {live.intermission > 0 ? c("hammerSold") : c("lotLive")}
                </p>
                <p className="d-num text-[11px] text-[var(--d-ov-fg)]/70">{c("lotProgress", { n: live.currentIndex + 1, total: live.items.length })}</p>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <LotImage image={lot.image} alt="" sizes="56px" className="size-12 shrink-0 rounded-lg" inset="p-1" />
                <p className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--d-ov-fg)]">{t(lot.title)}</p>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-xs text-[var(--d-ov-fg)]/70">{ui("currentBid")}</span>
                <Money key={bidFlash} value={lot.currentBid} className={`d-num rounded px-1 text-lg font-medium text-[var(--d-ov-fg)] ${bidFlash ? "d-flash" : ""}`} />
              </div>
              <TimeBar fraction={live.intermission > 0 ? 0 : live.remaining / live.duration} tone={PHASE_TONE[live.phase]} className="mt-2.5" />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
