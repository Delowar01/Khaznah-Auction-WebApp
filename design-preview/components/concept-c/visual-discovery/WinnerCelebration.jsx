"use client";

// Option 3 — Visual Discovery: the winner moment (behaviour:
// shared/auction/celebration.js). 3.5 s over the page, then gone, leaving
// the closed lot as it was: 0–0.5 s a navy veil with a soft blur and a
// navy-and-gold glow; from 0.5 s the trophy medallion and gold flecks (a
// gavel, without flecks, when someone else won); from 1.2 s the message on
// a navy card with a gold hairline; 2.8–3.5 s the fade. The timeline is CSS
// (styles/r3-visual-discovery.css). Nothing on it is interactive: it never
// takes focus or blocks the page, and the greeting is announced once.
// Reduced motion: no flecks and no animation — the moment shows, still,
// for the same 3.5 s.
import { Gavel, Trophy } from "lucide-react";
import { Money } from "@/components/shared/ui/Money";
import { useReducedMotion } from "@/components/shared/ui/hooks";
import { cx } from "./ui";

const TONES = ["#e1a932", "#f3cd6e", "#d39b22", "#faf5eb"];

// Gold flecks thrown out from behind the medallion. Fixed positions, so
// nothing is random while rendering; distances in vmin keep the burst
// inside a phone screen and generous on a desktop.
const FLECKS = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (((i * 7) % 5) - 2) * 0.07;
  const reach = 20 + ((i * 11) % 7) * 3.4;
  return {
    "--x": `${(Math.cos(angle) * reach).toFixed(1)}vmin`,
    "--y": `${(Math.sin(angle) * reach * 0.8 - 4).toFixed(1)}vmin`,
    "--spin": `${(i % 2 ? 1 : -1) * (140 + ((i * 29) % 160))}deg`,
    "--size": `${5 + (i % 4) * 2}px`,
    // Every third fleck a dot, the rest small strips.
    "--h": i % 3 === 0 ? "1" : "1.7",
    "--round": i % 3 === 0 ? "999px" : "2px",
    "--tone": TONES[i % TONES.length],
    "--delay": `${0.5 + (i % 6) * 0.03}s`,
  };
});

/** Anchored at the medallion's centre, under the medallion and the card. */
function Flecks() {
  return (
    <span className="absolute left-1/2 top-[38px] md:top-[44px]">
      {FLECKS.map((style, i) => (
        <span key={i} className="vd-fleck" style={style} />
      ))}
    </span>
  );
}

/**
 * Renders nothing until the page's celebration plays. `celebration` comes
 * from useAuctionCelebration / useLiveCelebration.
 */
export function WinnerCelebration({ celebration }) {
  const reduce = useReducedMotion();
  const { show, spoken } = celebration;
  const won = show?.kind === "won";

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {spoken}
      </p>
      {show ? (
        <div
          key={show.key}
          aria-hidden="true"
          data-testid="winner-celebration"
          data-kind={show.kind}
          className="pointer-events-none fixed inset-0 z-[250] grid place-items-center overflow-hidden px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(16px,env(safe-area-inset-top))]"
        >
          <span className="vd-win-veil absolute inset-0 bg-[#06213f]/55 backdrop-blur-[6px]" />
          <span className={cx("vd-win-glow absolute inset-0 m-auto size-[130vmin] rounded-full", won ? "vd-win-glow-gold" : "vd-win-glow-soft")} />

          <div className="vd-win-stage relative grid w-[min(100%,440px)] justify-items-center">
            {won && !reduce ? <Flecks /> : null}
            <span className={cx("vd-win-medal relative z-10 grid size-[76px] place-items-center rounded-full md:size-[88px]", won ? "vd-win-medal-gold" : "vd-win-medal-quiet")}>
              {won ? <Trophy className="size-9 md:size-10" strokeWidth={1.9} /> : <Gavel className="size-8 md:size-9" strokeWidth={1.9} />}
            </span>

            <div className="vd-win-card relative -mt-[38px] w-full rounded-[28px] border border-[#e1a932]/45 bg-[var(--vd-navy)] px-6 pb-6 pt-[54px] text-center text-[var(--vd-ivory)] shadow-[0_30px_80px_-24px_rgb(0_0_0/0.65)] md:-mt-[44px] md:px-8 md:pb-7 md:pt-[62px]">
              {show.eyebrow ? <p className="vd-win-eyebrow text-[var(--vd-gold)]">{show.eyebrow}</p> : null}
              <p className={cx("vd-win-title text-white text-balance", show.eyebrow && "mt-2")}>
                {show.title.before}
                {show.title.name ? <bdi className="text-[var(--vd-gold)]">{show.title.name}</bdi> : null}
                {show.title.after}
              </p>
              {show.line ? <p className="mt-1.5 vd-lg font-semibold text-[var(--vd-ivory)]/90">{show.line}</p> : null}
              <span className="mx-auto mt-4 block h-px w-12 bg-[var(--vd-gold)]/60" />
              <p className="mt-4 line-clamp-2 vd-sm text-[var(--vd-ivory)]/75">{show.lot}</p>
              {show.amount != null ? (
                <p className="mt-1 flex flex-wrap items-baseline justify-center gap-x-2 vd-sm text-[var(--vd-ivory)]/75">
                  {show.amountLabel}
                  <Money value={show.amount} className="vd-price text-[var(--vd-gold)]" symbolClassName="text-[0.7em]" />
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
