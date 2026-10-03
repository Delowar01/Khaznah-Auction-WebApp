"use client";

import { useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock3, Eye, Gavel, Wifi } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { lotImage } from "@/components/shared/r3/work-media";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_STILL } from "../data";
import { GradePill, cx } from "../ui";

const pad = (n) => String(n).padStart(2, "0");

/** Coral pill with the lot clock (white while waiting between lots). */
export function ClockPill({ room, className = "" }) {
  const { clock, hammer } = room;
  return (
    <span className={cx("inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 vd-md font-bold text-white", hammer ? "bg-white/15" : "bg-[var(--vd-coral)]", className)}>
      <Clock3 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.4} />
      <span className="sr-only">{hammer ? hammer.nextLabel : clock.spoken}</span>
      <span aria-hidden="true" dir="ltr" className="tabular">
        {hammer ? `0:${pad(hammer.nextIn)}` : `${Math.floor(clock.seconds / 60)}:${pad(clock.seconds % 60)}`}
      </span>
    </span>
  );
}

/** Between lots: a white card over the navy-veiled stage — the result, then the next lot. */
function HammerCard({ hammer }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 grid place-items-center bg-[#06213f]/75 p-3"
    >
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-[min(100%,340px)] rounded-[24px] bg-white px-5 py-3 text-center text-[var(--vd-ink)] shadow-[0_24px_60px_-24px_rgb(0_0_0/0.6)] sm:py-5"
      >
        <span aria-hidden="true" className={cx("mx-auto hidden size-11 place-items-center rounded-full sm:grid", hammer.kind === "passed" ? "bg-[var(--vd-bluegray)] text-[var(--vd-muted)]" : "bg-[var(--vd-gold)] text-[var(--vd-ink)]")}>
          <Gavel className="size-5" strokeWidth={2.1} />
        </span>
        <p className="vd-h3 sm:mt-2">{hammer.label}</p>
        <p className="mt-0.5 line-clamp-1 vd-sm text-[var(--vd-muted)]">{hammer.title}</p>
        {hammer.amount != null ? <Money value={hammer.amount} className="mt-1 vd-price" symbolClassName="text-[0.7em]" /> : null}
        <p className="mt-2 vd-sm font-bold text-[var(--vd-indigo)]">{hammer.nextLabel}</p>
        {hammer.next ? <p className="line-clamp-1 vd-xs text-[var(--vd-muted)] max-[379px]:hidden">{t(C.nextLotNamed, { title: hammer.next.title })}</p> : null}
        <div className="mx-auto mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-[var(--vd-bluegray)]" role="presentation">
          <div className="h-full rounded-full bg-[var(--vd-indigo)] transition-[width] duration-1000 ease-linear" style={{ width: `${hammer.left * 100}%` }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The expressive lot card: the cut-out on a blue-grey plate, the lot
 * number, title, grade and the bid. It floats over the stage's corner from
 * 768 px and sits under the stage on phones.
 */
function LotCard({ room, className = "" }) {
  const { ui } = useLang();
  const titleId = useId();
  const { lot, lotInfo, hammer, upNext } = room;
  if (!lot) return null;
  return (
    <article aria-labelledby={titleId} className={cx("grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3 rounded-[18px] bg-white p-2.5 pe-4 text-[var(--vd-ink)] shadow-[0_18px_40px_-20px_rgb(6_33_63/0.55)] md:grid-cols-[104px_minmax(0,1fr)]", className)}>
      <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--vd-bluegray)]">
        <Img key={lot.order} image={lotImage(lot)} cutout alt="" sizes="104px" className="vd-multiply absolute inset-0 size-full object-contain p-2" />
      </div>
      <div className="min-w-0">
        <p className="vd-xs font-semibold text-[var(--vd-muted)]">
          {ui("currentLot")} · {lotInfo.of}
        </p>
        <h2 id={titleId} className="mt-0.5 line-clamp-2 vd-title !text-[15px] !leading-5">
          {lotInfo.title}
        </h2>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {lotInfo.grade ? <GradePill grade={lotInfo.grade} /> : null}
          {lotInfo.savingLabel && !hammer ? <span className="vd-xs font-bold text-[#7a4e0c]">{lotInfo.savingLabel}</span> : null}
        </div>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className="vd-xs text-[var(--vd-muted)]">{hammer ? hammer.label : lotInfo.priceLabel}</span>
          {hammer && hammer.amount == null ? null : <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded-[8px] px-1 vd-price !text-[22px]" symbolClassName="text-[0.7em]" />}
        </p>
        {upNext ? (
          <p className="mt-1 truncate vd-xs text-[var(--vd-muted)]">
            {ui("upNext")}: <span className="font-semibold text-[var(--vd-ink)]">{upNext}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}

/**
 * The stage: a large rounded still of the electronics floor the sale is
 * called from (no player — the preview has no video), the coral lot clock
 * with the call, LIVE, the audience, the connection and the presenter's
 * pill; the lot card overlaps it.
 */
export function Stage({ room }) {
  const { t, ui } = useLang();
  const { event, callLabel, hammer, notice } = room;
  return (
    <div className="min-w-0">
      <section aria-labelledby="vd-stage-title" className="relative aspect-video overflow-hidden rounded-[16px] bg-[#0e2a4d] md:rounded-[20px] lg:aspect-auto lg:h-full lg:min-h-[460px]">
        <h2 id="vd-stage-title" className="sr-only">
          {t(C.stage)}
        </h2>
        <Img image={LIVE_STILL.image} alt="" sizes="(min-width: 1200px) 960px, (min-width: 1024px) 62vw, 100vw" priority className="absolute inset-0 size-full object-cover" style={{ objectPosition: LIVE_STILL.focus }} />
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-[#06213f]/55 via-transparent to-[#06213f]/65" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 md:inset-x-5 md:top-5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <ClockPill room={room} className="max-sm:h-9 max-sm:px-3" />
            <span className={cx("inline-flex h-9 items-center rounded-full px-3 vd-sm font-bold max-sm:hidden md:h-10", hammer ? "bg-white/15 text-white" : "bg-white text-[var(--vd-ink)]")}>{callLabel}</span>
            <AnimatePresence initial={false}>
              {notice.extended ? (
                <motion.span key="late" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="inline-flex h-9 items-center rounded-full bg-[var(--vd-gold)] px-3 vd-sm font-bold text-[var(--vd-ink)] max-sm:hidden">
                  {notice.text}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--vd-live)] px-3 vd-label text-white ltr:uppercase">
              <span aria-hidden="true" className="size-2 rounded-full border-2 border-white" />
              {ui("live")}
            </span>
            <span className="hidden h-8 items-center gap-1.5 rounded-full bg-[#06213f]/70 px-3 vd-xs font-semibold text-white md:inline-flex">
              <Eye aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2} />
              <span className="tabular">{event.viewers}</span>
            </span>
            <span className="hidden h-8 items-center gap-1.5 rounded-full bg-[#06213f]/70 px-3 vd-xs font-semibold text-white md:inline-flex">
              <Wifi aria-hidden="true" className="size-3.5" strokeWidth={2} />
              {ui("connected")}
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 end-3 flex max-w-[60%] items-center gap-2 rounded-full bg-white/90 p-1 pe-4 text-[var(--vd-ink)] max-md:max-w-[calc(100%-24px)] md:bottom-5 md:end-5 md:max-w-[44%]">
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--vd-navy)] vd-xs font-extrabold text-white">
            {event.host.monogram}
          </span>
          <span className="min-w-0">
            <span className="block truncate vd-sm font-bold">{event.presenter}</span>
            <span className="block truncate vd-xs text-[var(--vd-muted)]">
              {ui("hostedBy")} {event.hostName}
            </span>
          </span>
        </div>

        <LotCard room={room} className="absolute bottom-5 start-5 z-10 hidden w-[min(340px,46%)] md:grid" />
        <AnimatePresence>{hammer ? <HammerCard key="hammer" hammer={hammer} /> : null}</AnimatePresence>
      </section>
      {/* Phones: the lot card sits under the stage. */}
      <LotCard room={room} className="mt-3 md:hidden" />
    </div>
  );
}
