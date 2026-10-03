"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, Gavel, Wifi } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { LIVE_COPY as C } from "@/components/shared/live/copy";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { LiveBadge } from "../ui/Badge";
import { SellerAvatar } from "../ui/SellerAvatar";
import { cx } from "../ui/cx";

const HAMMER_ICON = {
  sold: "bg-success/15 text-success",
  won: "bg-success/15 text-success",
  passed: "bg-surface-2 text-fg-2",
};

/** Over the stage between lots: the result, then the next lot and its countdown. */
function HammerCard({ hammer }) {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-10 grid place-items-center bg-[var(--kb-indigo-950)]/70 p-3 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ y: 8, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-[min(100%,340px)] rounded-xl bg-surface p-3 text-center shadow-overlay ring-1 ring-line sm:p-5"
      >
        <span className={cx("mx-auto hidden size-11 place-items-center rounded-full sm:grid", HAMMER_ICON[hammer.kind])}>
          <Gavel aria-hidden="true" className="size-5" />
        </span>
        <p className="kb-h3 text-fg sm:mt-2.5">{hammer.label}</p>
        <p className="mt-0.5 line-clamp-1 kb-sm text-fg-2 sm:line-clamp-2">{hammer.title}</p>
        {hammer.amount != null ? <Money value={hammer.amount} className="mt-1 kb-price text-fg" symbolClassName="text-[0.75em]" /> : null}
        <div className="mt-2 border-t border-line pt-2 sm:mt-3 sm:pt-3">
          <p className="kb-xs font-bold text-primary">{hammer.nextLabel}</p>
          {hammer.next ? <p className="mt-0.5 line-clamp-1 kb-xs text-fg-2">{t(C.nextLotNamed, { title: hammer.next.title })}</p> : null}
          <div className="mx-auto mt-2 h-1 w-24 overflow-hidden rounded-full bg-surface-2" role="presentation">
            <div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${hammer.left * 100}%` }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * The stage: the presenter's still from the warehouse floor (no player —
 * the preview has no video), LIVE, viewers, the connection, the presenter
 * lower-third with the host, the lot on the block and the hammer card.
 */
export function LiveStage({ room }) {
  const { t, ui } = useLang();
  const { event, lotInfo, hammer } = room;
  return (
    <section aria-labelledby="kb-stage-title" className="relative aspect-video overflow-hidden rounded-xl bg-[var(--kb-indigo-950)] text-white">
      <h2 id="kb-stage-title" className="sr-only">
        {t(C.stage)}
      </h2>
      <Img image={LIVE_EVENT.stream} alt="" sizes="(min-width: 1280px) 920px, (min-width: 1024px) 60vw, 100vw" priority className="absolute inset-0 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#0f1538]/85 via-transparent to-[#0f1538]/45" />

      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
        <div className="flex min-w-0 items-center gap-2">
          <LiveBadge size="md">{ui("live")}</LiveBadge>
          <span className="inline-flex h-6 min-w-0 items-center gap-1.5 rounded-md bg-black/55 px-2 kb-xs font-semibold backdrop-blur">
            <Eye aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate tabular">{event.viewers}</span>
          </span>
        </div>
        <span className="hidden h-6 shrink-0 items-center gap-1.5 rounded-md bg-black/55 px-2 kb-xs font-semibold backdrop-blur sm:inline-flex">
          <Wifi aria-hidden="true" className="size-3.5" />
          {ui("connected")}
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
        <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-black/50 p-1.5 pe-3 backdrop-blur sm:p-2 sm:pe-3.5">
          <SellerAvatar seller={event.host} size="md" className="max-sm:size-8 max-sm:text-xs" />
          <div className="min-w-0">
            <p className="truncate kb-sm font-bold">{event.presenter}</p>
            <p className="truncate kb-xs text-white/80">
              {ui("hostedBy")} {event.hostName}
            </p>
          </div>
        </div>
        {lotInfo ? <span className="hidden shrink-0 rounded-md bg-black/55 px-2 py-1 kb-xs font-bold backdrop-blur sm:inline">{lotInfo.of}</span> : null}
      </div>

      <AnimatePresence>{hammer ? <HammerCard key="hammer" hammer={hammer} /> : null}</AnimatePresence>
    </section>
  );
}
