"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useLive } from "../market/MarketProvider";
import { LotImage } from "../ui/LotImage";
import { TimeBar } from "../ui/TimeBar";
import { OverlayChip } from "../ui/Chips";
import { useCopy } from "../lib/useCopy";
import { PHASE_TONE, phaseLabel } from "../live/livePhase";

/** The lot currently on the block in the live sale, as a listing card. */
export function LiveLotCard() {
  const live = useLive();
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  const lot = live.current;
  if (!lot) return null;
  return (
    <article className="d-card d-panel relative flex w-full flex-col overflow-hidden">
      <div className="d-card-media relative aspect-[5/4]">
        <LotImage image={lot.image} alt={t(lot.title)} fill sizes="(min-width: 1024px) 22vw, 46vw" />
        <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between">
          <OverlayChip status="live" label={ui("liveAuction")} />
          <span className="d-ov-chip d-num rounded-full px-2 py-1 text-[11px]" dir="ltr">
            {String(live.currentIndex + 1).padStart(2, "0")}/{live.items.length}
          </span>
        </div>
      </div>
      <TimeBar fraction={live.intermission > 0 ? 0 : live.remaining / live.duration} tone={PHASE_TONE[live.phase]} thickness="h-[3px]" className="rounded-none" />
      <div className="flex flex-1 flex-col p-4">
        <p className="d-label text-live">{phaseLabel(live.phase, ui, c)}</p>
        <h3 className="mt-1.5 line-clamp-2 text-[15px] font-medium text-fg">
          <Link href={link("/live-auction")} className="after:absolute after:inset-0">
            {t(lot.title)}
          </Link>
        </h3>
        <div className="mt-auto pt-4">
          <p className="d-label text-fg-3">{ui("currentBid")}</p>
          <Money value={lot.currentBid} className="d-num mt-1 text-xl font-medium text-fg" />
        </div>
      </div>
    </article>
  );
}
