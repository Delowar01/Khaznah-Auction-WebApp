"use client";

import { CalendarClock, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useHydrated } from "@/components/shared/ui/hooks";
import { durationParts, UNIT_LABELS } from "@/lib/format";
import { CountdownRing } from "../ui/CountdownRing";
import { StatusChip } from "../ui/Chips";
import { toneOf } from "../lib/data";
import { useCopy } from "../lib/useCopy";
import { auctionChip } from "../cards/useLotView";

// Captured once in the browser; end/start times are shown client-side only.
const LOADED_AT = typeof window === "undefined" ? 0 : Date.now();
const TONE_TEXT = { ink: "text-fg", warning: "text-warning", danger: "text-live", upcoming: "d-ink", muted: "text-fg-3" };

function useWallTime(secondsFromLoad, elapsed, lang) {
  const hydrated = useHydrated();
  if (!hydrated) return "";
  const at = new Date(LOADED_AT + (secondsFromLoad + elapsed) * 1000);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Riyadh",
  }).format(at);
}

/** Large ring + segmented d/h/m/s digits + absolute end (or start) time. */
export function TerminalClock({ phase, seconds, fraction, elapsed, upcoming = false }) {
  const { lang, ui } = useLang();
  const c = useCopy();
  const tone = toneOf(phase);
  const parts = durationParts(seconds);
  const labels = UNIT_LABELS[lang] || UNIT_LABELS.en;
  const units = [
    ...(parts.days ? [{ key: "days", v: parts.days }] : []),
    { key: "hours", v: parts.hours },
    { key: "minutes", v: parts.minutes },
    { key: "seconds", v: parts.seconds },
  ];
  const wall = useWallTime(seconds, elapsed, lang);

  return (
    <div className="flex items-center gap-4">
      <CountdownRing fraction={fraction} size={92} stroke={5} tone={tone} head>
        <Timer aria-hidden="true" className={`size-5 ${TONE_TEXT[tone]}`} />
      </CountdownRing>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="d-label text-fg-3">{upcoming ? ui("startsIn") : ui("endsIn")}</p>
          <StatusChip status={auctionChip(phase)} />
        </div>
        <p className="sr-only">{units.map((u) => `${u.v} ${labels[u.key]}`).join(" ")}</p>
        <div className="mt-1.5 flex items-baseline gap-2" dir="ltr" aria-hidden="true">
          {units.map((unit) => (
            <span key={unit.key} className="flex flex-col items-center">
              <span className={`d-num text-[28px] font-medium leading-none ${TONE_TEXT[tone]}`}>{String(unit.v).padStart(2, "0")}</span>
              <span className="mt-1 text-[10px] text-fg-3">{labels[unit.key]}</span>
            </span>
          ))}
        </div>
        <p className="mt-2 flex min-h-4 items-center gap-1.5 text-xs text-fg-3">
          <CalendarClock aria-hidden="true" className="size-3.5" />
          {wall ? (upcoming ? c("startsAt", { date: wall }) : c("endsAt", { date: wall })) : null}
        </p>
      </div>
    </div>
  );
}
