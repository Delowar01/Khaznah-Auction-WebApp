"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useReducedMotion } from "@/components/shared/ui/hooks";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

const AUTOPLAY_MS = 6000;
const CONTROL = "grid size-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/25";

/**
 * Promo carousel: autoplays every 6 s, pauses on hover, keyboard focus or
 * the pause button (and never autoplays with reduced motion). Arrows, dots
 * and swipe all work; slide order follows the reading direction.
 */
export function HeroCarousel({ slides, className = "" }) {
  const { t, isRTL } = useLang();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const touch = useRef(null);
  const count = slides.length;
  const halted = paused || hovered || focused || reduce;

  useEffect(() => {
    if (halted) return undefined;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [halted, index, count]);

  const go = (next) => setIndex(((next % count) + count) % count);
  const dir = isRTL ? -1 : 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t(COPY.heroLabel)}
      className={cx("relative isolate overflow-hidden rounded-xl bg-secondary lg:h-full", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div
        className="relative h-[500px] sm:h-[420px] lg:h-full lg:min-h-[436px]"
        onTouchStart={(event) => {
          touch.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touch.current == null) return;
          const dx = event.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) < 40) return;
          go(index + ((isRTL ? dx > 0 : dx < 0) ? 1 : -1));
        }}
      >
        {slides.map((slide, i) => {
          const active = i === index;
          const offset = i < index ? -1 : 1;
          return (
            <motion.div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={t(COPY.slideOf, { n: i + 1, total: count })}
              aria-hidden={!active}
              inert={!active}
              initial={false}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : `${offset * dir * 4}%` }}
              transition={{ type: "spring", stiffness: 240, damping: 34, opacity: { duration: 0.35 } }}
              className={cx("absolute inset-0", active ? "z-[1]" : "pointer-events-none z-0")}
            >
              {slide.node}
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between gap-3 p-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => go(i)}
              aria-label={t(COPY.goToSlide, { n: i + 1 })}
              aria-current={i === index ? "true" : undefined}
              className="group grid h-8 place-items-center px-0.5"
            >
              <span className={cx("relative block h-1.5 overflow-hidden rounded-full bg-white/35 transition-[width] duration-300", i === index ? "w-10" : "w-4 group-hover:bg-white/60")}>
                {i === index ? (
                  <span
                    key={`${index}-${halted}`}
                    data-paused={halted}
                    className={cx("absolute inset-0 rounded-full bg-white", halted ? "" : "kb-autoplay-bar")}
                    style={{ "--kb-autoplay": `${AUTOPLAY_MS}ms` }}
                  />
                ) : null}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className={CONTROL} onClick={() => setPaused((p) => !p)} aria-label={t(paused ? COPY.playSlides : COPY.pauseSlides)}>
            {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
          </button>
          <button type="button" className={CONTROL} onClick={() => go(index - 1)} aria-label={t(COPY.prevSlide)}>
            <DirIcon icon={ChevronLeft} className="size-4" />
          </button>
          <button type="button" className={CONTROL} onClick={() => go(index + 1)} aria-label={t(COPY.nextSlide)}>
            <DirIcon icon={ChevronRight} className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
