"use client";

import { AnimatePresence, motion } from "motion/react";
import { Clock3, Eye, Gavel, Wifi } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { lotImage } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_SCENE } from "../data";
import { cx } from "../ui";

const pad = (n) => String(n).padStart(2, "0");

/** The lot clock in red on white (the only red besides LIVE); the wait between lots in ink. */
export function ClockChip({ room, className = "" }) {
  const { clock, hammer } = room;
  return (
    <span className={cx("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[6px] bg-white px-2.5 sc-md font-semibold tabular", hammer ? "text-[var(--sc-ink)]" : "text-[var(--sc-red)]", className)}>
      <Clock3 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
      <span className="sr-only">{hammer ? hammer.nextLabel : clock.spoken}</span>
      <span aria-hidden="true" dir="ltr">
        {hammer ? `0:${pad(hammer.nextIn)}` : `${pad(Math.floor(clock.seconds / 60))}:${pad(clock.seconds % 60)}`}
      </span>
    </span>
  );
}

/** Between lots: a white card on the darkened scene — the result, then the next lot. */
function HammerCard({ hammer }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 grid place-items-center bg-[#0a1016]/70 p-3"
    >
      <motion.div
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-[min(100%,340px)] overflow-hidden rounded-[12px] bg-white text-center text-[var(--sc-ink)] shadow-[0_24px_60px_-24px_rgb(0_0_0/0.6)]"
      >
        <div className="flex items-center justify-center gap-2 bg-[var(--sc-soft)] px-4 py-2 sc-md font-semibold text-[var(--sc-green)] max-[379px]:hidden">
          <Gavel aria-hidden="true" className="size-4" strokeWidth={2} />
          {t(C.betweenLots)}
        </div>
        <div className="px-5 py-3">
          <p className="sc-h3">{hammer.label}</p>
          <p className="mt-0.5 line-clamp-1 sc-sm text-[var(--sc-muted)]">{hammer.title}</p>
          {hammer.amount != null ? <Money value={hammer.amount} className="mt-1 sc-price !text-[24px] !leading-7" symbolClassName="text-[0.66em]" /> : null}
          <p className="mt-2 sc-md font-semibold text-[var(--sc-green)]">{hammer.nextLabel}</p>
          {hammer.next ? <p className="line-clamp-1 sc-sm text-[var(--sc-muted)] max-[379px]:hidden">{t(C.nextLotNamed, { title: hammer.next.title })}</p> : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The stage: the warehouse aisle the sale is called from, with the lot on
 * the block standing in it (the home page's live scene; no player — the
 * preview has no video). LIVE, the audience, the connection, the red lot
 * clock, the presenter with the host and the lot number sit on it.
 */
export function Stage({ room, className = "" }) {
  const { t, ui } = useLang();
  const { lot, event, lotInfo, hammer } = room;
  return (
    <section aria-labelledby="sc-stage-title" className={cx("relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#1d2630] text-white sm:aspect-video dt:aspect-auto dt:h-full dt:min-h-[460px]", className)}>
      <h2 id="sc-stage-title" className="sr-only">
        {t(C.stage)}
      </h2>
      <Img image={LIVE_SCENE.image} alt="" sizes="(min-width: 1200px) 660px, (min-width: 1024px) 64vw, 100vw" priority className="absolute inset-0 size-full object-cover" style={{ objectPosition: LIVE_SCENE.focus }} />
      <AnimatePresence initial={false}>
        {lot ? (
          <motion.div
            key={lot.order}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-x-[18%] bottom-[10%] top-[26%]"
          >
            <Img image={lotImage(lot)} cutout alt="" sizes="(min-width: 1200px) 420px, 60vw" className="size-full object-contain object-bottom drop-shadow-[0_18px_22px_rgb(0_0_0/0.45)]" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_16_22/0.7)_0%,rgb(10_16_22/0.12)_34%,rgb(10_16_22/0.08)_62%,rgb(10_16_22/0.8)_100%)]" />

      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex h-[30px] items-center rounded-[5px] bg-[var(--sc-red)] px-3 sc-md font-bold text-white ltr:uppercase">{ui("live")}</span>
          <span className="inline-flex h-[30px] items-center gap-1.5 rounded-[5px] bg-black/45 px-2.5 sc-sm font-semibold">
            <Eye aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.9} />
            <span className="tabular">{event.viewers}</span>
          </span>
          <span className="hidden h-[30px] items-center gap-1.5 rounded-[5px] bg-black/45 px-2.5 sc-sm font-semibold md:inline-flex">
            <Wifi aria-hidden="true" className="size-4" strokeWidth={1.9} />
            {ui("connected")}
          </span>
        </div>
        <ClockChip room={room} />
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
        <div className="min-w-0">
          <p className="truncate sc-lg font-semibold">{event.presenter}</p>
          <p className="truncate sc-sm text-white/85">
            {ui("hostedBy")} {event.hostName}
          </p>
        </div>
        {lotInfo ? <span className="shrink-0 rounded-[5px] bg-white px-2.5 py-1 sc-sm font-semibold text-[var(--sc-ink)] max-[379px]:hidden">{lotInfo.of}</span> : null}
      </div>

      <AnimatePresence>{hammer ? <HammerCard key="hammer" hammer={hammer} /> : null}</AnimatePresence>
    </section>
  );
}
