"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, Wifi } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_STREAM } from "../data";
import { cx } from "../ui";

/** Between lots: an ivory card over the darkened stage — the result, then the next lot. */
function HammerCard({ hammer }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-10 grid place-items-center bg-[#171b27]/70 p-3 sm:p-4"
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-[min(100%,360px)] rounded-[6px] bg-[#f8f7f3] px-5 py-3 text-center text-fg shadow-overlay sm:py-5"
      >
        <span aria-hidden="true" className="pr-dash mx-auto hidden !w-8 sm:block" />
        <p className="pr-h3 text-fg sm:mt-3">{hammer.label}</p>
        <p className="mt-0.5 line-clamp-1 pr-sm text-fg-2">{hammer.title}</p>
        {hammer.amount != null ? <Money value={hammer.amount} className="mt-1 pr-price-sm text-fg" symbolClassName="text-[0.78em]" /> : null}
        <p className="mt-2 pr-sm font-semibold text-[var(--pr-bronze)] sm:mt-3">{hammer.nextLabel}</p>
        {hammer.next ? <p className="line-clamp-1 pr-xs text-fg-2 max-[379px]:hidden">{t(C.nextLotNamed, { title: hammer.next.title })}</p> : null}
      </motion.div>
    </motion.div>
  );
}

/**
 * The cinematic stage: a still of the warehouse aisle the sale is called
 * from (no player — the preview has no video), a small red LIVE tag, the
 * audience, the connection, the presenter's lower third with the host and
 * the lot on the block. On desktop it meets the charcoal console edge to
 * edge, so the two read as one frame.
 */
export function Stage({ room, className = "" }) {
  const { t, ui } = useLang();
  const { event, lotInfo, hammer } = room;
  return (
    <section aria-labelledby="pm-stage-title" className={cx("relative aspect-video overflow-hidden rounded-[6px] bg-[#2a2926] text-white lg:aspect-auto lg:min-h-[440px]", className)}>
      <h2 id="pm-stage-title" className="sr-only">
        {t(C.stage)}
      </h2>
      <Img
        image={LIVE_STREAM.image}
        alt=""
        sizes="(min-width: 1200px) 940px, (min-width: 1024px) 64vw, 100vw"
        priority
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: LIVE_STREAM.focus }}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#171b27]/80 via-[#171b27]/10 to-[#171b27]/40" />

      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 dt:inset-x-6 dt:top-6">
        <p className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-[3px] bg-[var(--pr-live)] px-2.5 pr-label text-white ltr:uppercase ltr:tracking-[0.08em]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
            {ui("live")}
          </span>
          <span className="inline-flex h-7 items-center gap-1.5 rounded-[3px] bg-black/45 px-2.5 pr-xs font-medium">
            <Eye aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
            <span className="tabular">{event.viewers}</span>
          </span>
        </p>
        <span className="hidden h-7 shrink-0 items-center gap-1.5 rounded-[3px] bg-black/45 px-2.5 pr-xs font-medium sm:inline-flex">
          <Wifi aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
          {ui("connected")}
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 dt:inset-x-6 dt:bottom-6">
        <div className="min-w-0">
          <span aria-hidden="true" className="pr-dash !w-7 max-sm:hidden" />
          <p className="truncate pr-lg font-semibold sm:mt-2.5">{event.presenter}</p>
          <p className="truncate pr-xs text-white/80">
            {ui("hostedBy")} {event.hostName}
          </p>
        </div>
        {lotInfo ? <span className="shrink-0 rounded-[3px] bg-black/45 px-2.5 py-1 pr-xs font-medium max-[379px]:hidden">{lotInfo.of}</span> : null}
      </div>

      <AnimatePresence>{hammer ? <HammerCard key="hammer" hammer={hammer} /> : null}</AnimatePresence>
    </section>
  );
}
