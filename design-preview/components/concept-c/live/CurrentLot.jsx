"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { Echo } from "../ui/Bi";
import { Badge, GradeChip } from "../ui/Badges";
import { Diamond } from "../ui/Diamond";
import { ChamferFrame, PlateImage } from "../ui/Frame";
import { cx } from "../ui/cx";

const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

/** Per-lot clock: saffron progress bar, "going once / twice" in brick as time runs out. */
function LotClock({ live }) {
  const { ui } = useLang();
  const { remaining, duration, phase } = live;
  const ratio = Math.max(0, Math.min(1, remaining / duration));
  const going = phase === "going_once" ? ui("goingOnce") : phase === "going_twice" || phase === "closing" ? ui("goingTwice") : null;
  const hot = phase === "going_twice" || phase === "closing";
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p aria-live="polite" className={cx("text-lg font-bold transition-colors", hot ? "text-live" : phase === "going_once" ? "text-warning" : "text-fg-2")}>
          {going || ui("timeLeft")}
        </p>
        <span className={cx("c-num text-2xl font-semibold transition-colors", hot ? "text-live" : "text-fg")}>
          <span dir="ltr">00:{pad(remaining)}</span>
        </span>
      </div>
      <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-xs bg-accent/20">
        <div className={cx("h-full transition-[width,background-color] duration-1000 ease-linear", hot ? "bg-live" : "bg-accent")} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}

/** The lot on the block: image, bilingual title, grade, current bid (flashes on each bid) and its clock. */
export function CurrentLot({ live }) {
  const { t, ui, pl } = useLang();
  const { current, currentIndex, items, minNext, feed } = live;
  if (!current) return null;
  const saving = current.marketPrice ? marketSaving(current, current.currentBid) : 0;

  return (
    <section aria-labelledby="lot-title" className="overflow-hidden rounded-md border border-line bg-surface">
      <div className="grid gap-5 p-5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:p-6">
        <ChamferFrame size="sm" className="w-32 sm:w-auto">
          <PlateImage image={current.image} alt="" sizes="160px" zoom={false} className="aspect-square" />
        </ChamferFrame>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="live" live>
              {ui("currentLot")}
            </Badge>
            <span className="c-num text-sm text-fg-3">{ui("lotOf", { n: currentIndex + 1, total: items.length })}</span>
            {current.grade ? <GradeChip grade={current.grade} /> : null}
          </div>
          <h2 id="lot-title" className="c-h3 mt-3 text-[1.375rem] sm:text-2xl">
            {t(current.title)}
          </h2>
          <Echo content={current.title} className="mt-1" />
          {current.note ? <p className="c-prose mt-3 text-sm">{t(current.note)}</p> : null}
        </div>
      </div>
      <div className="grid gap-6 border-t border-line p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-end sm:p-6">
        <div>
          <p className="c-label">{ui("currentBid")}</p>
          <div key={feed[0]?.id || "start"} className="c-flash -mx-1 mt-1 inline-block px-1">
            <Money value={current.currentBid} className="c-num text-[2.75rem] font-semibold leading-none text-fg" />
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-fg-2">
            {pl("bids", current.bidCount)}
            <Diamond size={4} className="text-line-strong" />
            {ui("nextMinBid")} <Money value={minNext} className="c-num font-semibold text-fg" />
          </p>
          {saving ? <p className="mt-1 text-sm font-medium text-success">{ui("belowMarket", { pct: saving })}</p> : null}
        </div>
        <LotClock live={live} />
      </div>
    </section>
  );
}

/** Intermission: the hammer result and the next lot countdown. */
export function HammerCard({ live }) {
  const { t, ui } = useLang();
  const { lastHammer, intermission, nextItem } = live;
  if (!lastHammer) return null;
  return (
    <section aria-live="polite" className="c-night relative overflow-hidden rounded-md px-6 py-10 text-center sm:py-12">
      <span className="c-gridlines" style={{ "--grid": "3rem", "--grid-mask": "radial-gradient(closest-side, black, transparent)" }} />
      <div className="relative">
        <Diamond size={16} className={lastHammer.sold ? "text-accent" : "text-fg-3"} />
        <p className="c-display mt-5 text-[2.75rem]">{lastHammer.sold ? ui("soldHammer") : ui("passed")}</p>
        <p className="mx-auto mt-2 max-w-md text-fg-2">{t(lastHammer.title)}</p>
        {lastHammer.sold ? <Money value={lastHammer.amount} className="c-num mt-4 text-4xl font-semibold text-fg" /> : null}
        {lastHammer.mine ? (
          <p className="mt-4">
            <Badge tone="gold" dia>
              {ui("youWon")}
            </Badge>
          </p>
        ) : null}
        <p className="mt-8 text-sm font-semibold text-accent">{ui("nextLotIn", { n: intermission })}</p>
        {nextItem ? <p className="mt-1 text-sm text-fg-2">{t(nextItem.title)}</p> : null}
      </div>
    </section>
  );
}
