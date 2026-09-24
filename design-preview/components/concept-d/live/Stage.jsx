"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Eye, Gavel, Mic } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { formatNumber } from "@/lib/format";
import { TimeBar } from "../ui/TimeBar";
import { SellerAvatar } from "../ui/SellerAvatar";
import { useChangeCount } from "../lib/hooks";
import { useCopy } from "../lib/useCopy";
import { PHASE_TONE, phaseLabel } from "./livePhase";

function HammerOverlay({ live }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const hammer = live.lastHammer;
  return (
    <AnimatePresence>
      {live.intermission > 0 && hammer ? (
        <motion.div
          key={hammer.at}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-20 grid place-items-center bg-black/65 backdrop-blur-sm"
          role="status"
        >
          <motion.div initial={{ scale: 0.92, y: 8 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="px-6 text-center">
            <span className={`mx-auto grid size-16 place-items-center rounded-full ${hammer.sold ? "bg-accent text-on-accent" : "bg-white/10 text-[var(--d-ov-fg)]"}`}>
              <Gavel aria-hidden="true" className="size-8" />
            </span>
            <p className="d-tight mt-4 text-4xl font-semibold text-[var(--d-ov-fg)] sm:text-5xl">{hammer.sold ? ui("soldHammer") : ui("passed")}</p>
            <p className="mt-2 text-sm text-[var(--d-ov-fg)]/80">{t(hammer.title)}</p>
            {hammer.sold ? <Money value={hammer.amount} className="d-num mt-3 text-3xl font-medium text-[var(--d-ov-fg)]" /> : <p className="mt-3 text-sm text-[var(--d-ov-fg)]/70">{c("notSoldText")}</p>}
            {hammer.mine ? <p className="mt-3 text-sm font-semibold text-accent">{c("youWonLot")}</p> : null}
            <p className="d-num mt-5 text-xs text-[var(--d-ov-fg)]/70">{ui("nextLotIn", { n: live.intermission })}</p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** 16:9 stream poster with LIVE, viewers, presenter, lower-third and hammer overlay. */
export function Stage({ live }) {
  const { link } = useConcept();
  const { t, ui } = useLang();
  const c = useCopy();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  const flash = useChangeCount(lot?.currentBid);

  return (
    <div className="d-scope-dark relative isolate aspect-video overflow-hidden rounded-card border border-line bg-bg shadow-raised max-lg:rounded-none max-lg:border-x-0">
      <Img image={LIVE_EVENT.stream} alt={c("streamAlt")} priority sizes="(min-width: 1280px) 50vw, 100vw" className="absolute inset-0 -z-10 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/10 to-black/35" />

      <div className="absolute inset-x-3 top-3 flex items-center gap-2 sm:inset-x-4 sm:top-4">
        <span className="d-label inline-flex h-7 items-center gap-1.5 rounded-md bg-[var(--d-live-fill)] px-2.5 text-[var(--d-ov-fg)]">
          <span aria-hidden="true" className="kz-live-dot [--live:var(--d-ov-fg)]" />
          {ui("live")}
        </span>
        <span className="d-ov-chip d-num inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs">
          <Eye aria-hidden="true" className="size-3.5" />
          {formatNumber(live.viewers)}
          <span className="sr-only">{ui("viewers")}</span>
        </span>
        <Link href={link(`/seller/${host.code}`)} className="d-ov-chip ms-auto hidden h-7 items-center gap-2 rounded-md pe-2.5 ps-1 text-xs hover:bg-black/85 sm:inline-flex">
          <SellerAvatar seller={host} size="sm" className="size-5 rounded text-[8px]" />
          {t(host.name)}
        </Link>
      </div>

      {lot ? (
        <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="hidden items-center gap-1.5 text-xs text-[var(--d-ov-fg)]/75 sm:flex">
                <Mic aria-hidden="true" className="size-3.5" />
                {t(LIVE_EVENT.presenter)}
              </p>
              <p className="d-label text-[var(--d-ov-live)] sm:mt-2">
                {phaseLabel(live.phase, ui, c)} · <span className="d-num">{c("lotProgress", { n: live.currentIndex + 1, total: live.items.length })}</span>
              </p>
              <p className="mt-1 line-clamp-1 text-lg font-semibold text-[var(--d-ov-fg)] sm:text-2xl">{t(lot.title)}</p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-[11px] text-[var(--d-ov-fg)]/70">{ui("currentBid")}</p>
              <Money key={flash} value={lot.currentBid} className={`d-num rounded px-1 text-2xl font-medium text-[var(--d-ov-fg)] sm:text-3xl ${flash ? "d-flash" : ""}`} />
            </div>
          </div>
          <TimeBar fraction={live.intermission > 0 ? 0 : live.remaining / live.duration} tone={PHASE_TONE[live.phase]} thickness="h-1.5" className="mt-3" />
        </div>
      ) : null}
      <HammerOverlay live={live} />
    </div>
  );
}
