"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useMediaQuery } from "@/components/shared/ui/hooks";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { useVisual } from "./state";
import { LiveDot } from "./ui";

/** Hides the player while the hero or the footer is on screen. */
function useClearOfHeroAndFooter() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("vm-hero");
    const footer = document.getElementById("vm-footer");
    const observers = [];
    if (hero) {
      const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { rootMargin: "0px 0px -35% 0px" });
      io.observe(hero);
      observers.push(io);
    }
    if (footer) {
      const io = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting));
      io.observe(footer);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);
  return !heroVisible && !footerVisible;
}

/**
 * Floating live mini-player (bottom-end corner) while an event is live.
 * It stays out of the way: it waits until the hero has scrolled away, hides
 * over the footer and while any overlay is open, and can be minimised.
 * Phones start with a 56px round "live" button (the lot photo in a live
 * ring) that opens into the price + Join pill only when tapped. Bidding
 * happens inside the room, so the player only shows the lot and links in.
 */
export function LiveMiniPlayer() {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const { layer } = useVisual();
  const live = useLiveEvent();
  const clear = useClearOfHeroAndFooter();
  const roomy = useMediaQuery("(min-width: 768px)", false);
  // desktop: "card" ⇄ "pill"; phones: "dot" ⇄ "pill"
  const [deskMode, setDeskMode] = useState("card");
  const [phoneMode, setPhoneMode] = useState("dot");
  const mode = roomy ? deskMode : phoneMode;
  const item = live.current;
  const show = clear && !layer && item;

  const join = (
    <Link href={link("/live-auction")} className="inline-flex h-9 shrink-0 items-center rounded-full bg-white px-4 vm-sm font-bold text-[#181614] transition-colors hover:bg-white/90">
      {t(COPY.join)}
      <span className="sr-only">: {t(COPY.joinLive)}</span>
    </Link>
  );

  return (
    <AnimatePresence>
      {show ? (
        <motion.aside
          key="player"
          aria-label={t(COPY.liveRegion)}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="fixed bottom-[max(14px,env(safe-area-inset-bottom))] end-3.5 z-[60] md:bottom-5 md:end-5"
        >
          {mode === "dot" ? (
            <button
              type="button"
              onClick={() => setPhoneMode("pill")}
              aria-label={`${t(COPY.showPlayer)} — ${t(item.title)}`}
              className="relative grid size-14 place-items-center rounded-full bg-live p-[3px] shadow-overlay"
            >
              <span className="grid size-full place-items-center overflow-hidden rounded-full border-2 border-white bg-white">
                <Img image={item.image} alt="" sizes="56px" className="size-full object-contain p-1" />
              </span>
              <span className="absolute -bottom-1.5 rounded-[6px] bg-[#b3281f] px-1.5 text-[10px] font-extrabold uppercase leading-4 tracking-wide text-white ring-2 ring-bg">
                {t(COPY.live)}
              </span>
            </button>
          ) : mode === "pill" ? (
            <div className="flex items-center gap-1 rounded-full bg-[#181614] p-1 ps-3 text-white shadow-overlay ring-1 ring-white/10">
              <LiveDot />
              <span className="ms-1 vm-xs font-extrabold uppercase tracking-wide">{t(COPY.live)}</span>
              <span aria-hidden="true" className="mx-1 h-4 w-px bg-white/20" />
              <Money value={item.currentBid} className="vm-sm font-bold" />
              <span className="ms-2">{join}</span>
              <button
                type="button"
                onClick={() => (roomy ? setDeskMode("card") : setPhoneMode("dot"))}
                aria-label={roomy ? t(COPY.showPlayer) : t(COPY.hidePlayer)}
                className="grid size-9 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
              >
                {roomy ? <ChevronUp aria-hidden="true" className="size-4" /> : <ChevronDown aria-hidden="true" className="size-4" />}
              </button>
            </div>
          ) : (
            <div className="flex w-[330px] items-stretch gap-3 rounded-[22px] bg-[#181614] p-2.5 text-white shadow-overlay ring-1 ring-white/10">
              <span className="relative size-[76px] shrink-0 overflow-hidden rounded-[16px] bg-white/10">
                <Img image={live.event.stream} alt="" sizes="76px" className="size-full object-cover opacity-80" />
                <span className="absolute bottom-1.5 end-1.5 size-9 overflow-hidden rounded-[10px] bg-white p-0.5 shadow-card">
                  <Img image={item.image} alt="" sizes="36px" className="size-full object-contain" />
                </span>
              </span>
              <div className="min-w-0 flex-1 py-0.5">
                <p className="flex items-center gap-1.5 vm-xs font-bold text-white/80">
                  <LiveDot />
                  <span className="uppercase tracking-wide text-white">{t(COPY.live)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{t(COPY.lotOf, { n: item.order, total: live.items.length })}</span>
                </p>
                <p className="mt-0.5 truncate vm-sm font-bold">{t(item.title)}</p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <Money value={item.currentBid} className="vm-price" />
                  <span className="vm-xs text-white/70">{pl("bids", item.bidCount)}</span>
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => setDeskMode("pill")}
                  aria-label={t(COPY.hidePlayer)}
                  className="-me-1 -mt-1 grid size-8 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <ChevronDown aria-hidden="true" className="size-4" />
                </button>
                {join}
              </div>
            </div>
          )}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
