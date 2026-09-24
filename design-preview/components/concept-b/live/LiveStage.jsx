"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, Gavel, Wifi } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { LiveBadge } from "../ui/Badge";
import { SellerAvatar } from "../ui/SellerAvatar";
import { COPY } from "../copy";

function HammerCard({ live }) {
  const { t, ui } = useLang();
  const hammer = live.lastHammer;
  if (!hammer) return null;
  const title = hammer.sold ? (hammer.mine ? t(COPY.soldToYou) : ui("soldHammer")) : ui("passed");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="absolute inset-0 z-10 grid place-items-center bg-black/55 backdrop-blur-[2px]"
    >
      <div className="w-[min(88%,340px)] rounded-2xl bg-surface p-5 text-center shadow-overlay ring-1 ring-line">
        <span className={`mx-auto grid size-12 place-items-center rounded-full ${hammer.sold ? "bg-success/15 text-success" : "bg-surface-2 text-fg-2"}`}>
          <Gavel aria-hidden="true" className="size-6" />
        </span>
        <p className="mt-3 kb-h2 text-fg">{title}</p>
        <p className="mt-1 line-clamp-2 kb-sm text-fg-2">{t(hammer.title)}</p>
        {hammer.sold ? <Money value={hammer.amount} className="mt-2 kb-price-lg text-fg" symbolClassName="text-[0.7em]" /> : null}
        <p className="mt-3 rounded-full bg-surface-2 px-3 py-1 kb-xs font-semibold text-fg-2">{ui("nextLotIn", { n: live.intermission })}</p>
      </div>
    </motion.div>
  );
}

/** The stream: poster with LIVE, viewers, presenter lower-third and the hammer overlay. */
export function LiveStage({ live }) {
  const { t, ui, pl } = useLang();
  const host = getSeller(LIVE_EVENT.host);
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary">
      <Img
        image={LIVE_EVENT.stream}
        alt={t(LIVE_EVENT.title)}
        sizes="(min-width: 1024px) 65vw, 100vw"
        priority
        className="kb-drift absolute inset-0 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-black/35" />

      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
        <div className="flex items-center gap-2">
          <LiveBadge size="md">{ui("live")}</LiveBadge>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-black/55 px-2 kb-xs font-semibold text-white backdrop-blur">
            <Eye aria-hidden="true" className="size-3.5" />
            <span className="tabular">{pl("viewers", live.viewers)}</span>
          </span>
        </div>
        <span className="hidden h-6 items-center gap-1.5 rounded-md bg-black/55 px-2 kb-xs font-semibold text-white backdrop-blur sm:inline-flex">
          <Wifi aria-hidden="true" className="size-3.5" />
          {ui("connected")}
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 text-white sm:inset-x-4 sm:bottom-4">
        <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-black/45 p-2 pe-3 backdrop-blur">
          <SellerAvatar seller={host} size="md" />
          <div className="min-w-0">
            <p className="truncate kb-sm font-bold">{t(LIVE_EVENT.presenter)}</p>
            <p className="truncate kb-xs text-white/80">
              {ui("hostedBy")} {t(host.name)}
            </p>
          </div>
        </div>
        {live.current ? (
          <span className="hidden shrink-0 rounded-md bg-black/55 px-2 py-1 kb-xs font-bold backdrop-blur sm:inline">
            {ui("lotOf", { n: live.current.order, total: live.items.length })}
          </span>
        ) : null}
      </div>

      <AnimatePresence>{live.phase === "intermission" ? <HammerCard key="hammer" live={live} /> : null}</AnimatePresence>
    </div>
  );
}
