"use client";

import { CalendarClock, CircleCheck, Clock, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useElapsed } from "@/lib/clock";
import { Badge } from "../ui/Badge";
import { ClockDigits } from "../ui/Countdown";
import { cx } from "../ui/cx";
import { lotProgress } from "../utils/lots";
import { COPY } from "../copy";

/** Status chip for an auction phase. */
export function PhaseBadge({ phase, size = "md" }) {
  const { ui, t } = useLang();
  const map = {
    live: { tone: "success", icon: Clock, label: t(COPY.phaseLive) },
    urgent: { tone: "warning", icon: Timer, label: ui("endingSoon") },
    critical: { tone: "live", dot: true, label: ui("closingNow") },
    upcoming: { tone: "primary", icon: CalendarClock, label: ui("upcoming") },
    ended: { tone: "neutral", icon: CircleCheck, label: ui("ended") },
    sold: { tone: "ink", icon: CircleCheck, label: ui("sold") },
  };
  const item = map[phase] || map.live;
  return (
    <Badge tone={item.tone} size={size} icon={item.icon} dot={item.dot}>
      {item.label}
    </Badge>
  );
}

/** Countdown block: label, segmented digits and a progress bar through the auction. */
export function AuctionClock({ product, auction }) {
  const { ui } = useLang();
  const elapsed = useElapsed();
  const { phase } = auction;
  const upcoming = phase === "upcoming";
  const closed = phase === "ended" || phase === "sold";
  const seconds = upcoming ? auction.startsIn : auction.remaining;
  const tone = phase === "critical" ? "critical" : phase === "urgent" ? "urgent" : "default";
  const progress = closed ? 1 : upcoming ? 0 : lotProgress(product, elapsed);

  if (closed) return null;
  const labelTone = phase === "critical" ? "text-danger" : phase === "urgent" ? "text-warning" : "text-fg-2";
  return (
    <div className="rounded-xl kb-clock p-3.5 ring-1 ring-line">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className={cx("flex items-center gap-1.5 kb-eyebrow", labelTone)}>
          <span aria-hidden="true" className={cx("size-1.5 rounded-full bg-current", phase === "critical" && "kb-pulse")} />
          {upcoming ? ui("startsIn") : ui("endsIn")}
        </p>
        {auction.extended ? <Badge tone="warning">{ui("timeExtended")}</Badge> : null}
      </div>
      <ClockDigits seconds={seconds} tone={tone} size="lg" />
      {!upcoming ? (
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-surface-2" role="presentation">
          <div
            className={cx("h-full rounded-full transition-[width] duration-1000 ease-linear", phase === "critical" ? "bg-live" : phase === "urgent" ? "bg-warning" : "bg-accent")}
            style={{ width: `${Math.max(2, progress * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
