"use client";

import { Check, Clock3, Flame, Sparkles, XCircle } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";

const CHIP = "d-label inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5";

// Soft chips for panels and rows.
const SOFT = {
  live: "bg-live/12 text-live",
  urgent: "bg-warning/14 text-warning",
  critical: "bg-live/14 text-live",
  upcoming: "bg-primary/14 d-ink",
  ended: "bg-surface-2 text-fg-2 ring-1 ring-inset ring-line",
  sold: "bg-surface-2 text-fg-2 ring-1 ring-inset ring-line",
  new: "bg-success/12 text-success",
  unavailable: "bg-surface-2 text-fg-2 ring-1 ring-inset ring-line",
  buyNow: "ring-1 ring-inset ring-line-strong text-fg-2",
  hot: "bg-warning/14 text-warning",
  won: "bg-accent/16 text-auction",
};

// Dots for overlay chips on photography (one palette in both themes).
const DOT = {
  urgent: "bg-[var(--d-ov-warn)]",
  critical: "bg-[var(--d-ov-live)] d-blink",
  upcoming: "bg-[var(--d-ov-ink)]",
  new: "bg-[var(--d-ov-ok)]",
  buyNow: "bg-[var(--d-ov-ink)]",
};

function labelFor(status, ui) {
  return {
    live: ui("live"),
    urgent: ui("endingSoon"),
    critical: ui("closingNow"),
    upcoming: ui("upcoming"),
    ended: ui("ended"),
    sold: ui("sold"),
    new: ui("newListing"),
    unavailable: ui("outOfStock"),
    buyNow: ui("buyNow"),
    hot: ui("hot"),
    won: ui("youWon"),
  }[status];
}

function Glyph({ status }) {
  if (status === "live") return <span aria-hidden="true" className="kz-live-dot" />;
  if (status === "sold" || status === "won") return <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />;
  if (status === "ended") return <Clock3 aria-hidden="true" className="size-3.5" />;
  if (status === "unavailable") return <XCircle aria-hidden="true" className="size-3.5" />;
  if (status === "hot") return <Flame aria-hidden="true" className="size-3.5" />;
  if (status === "new") return <Sparkles aria-hidden="true" className="size-3.5" />;
  return <span aria-hidden="true" className={`size-1.5 rounded-full ${status === "critical" ? "bg-live d-blink" : "bg-current"}`} />;
}

/** Status chip — live · urgent · critical · upcoming · ended · sold · new · unavailable · buyNow · hot · won. */
export function StatusChip({ status, label, className = "" }) {
  const { ui } = useLang();
  if (!status) return null;
  return (
    <span className={`${CHIP} ${SOFT[status] || SOFT.ended} ${className}`}>
      <Glyph status={status} />
      {label || labelFor(status, ui)}
    </span>
  );
}

/** Chip for use on top of photography. */
export function OverlayChip({ status, label, className = "" }) {
  const { ui } = useLang();
  if (!status) return null;
  const glyph =
    status === "live" ? (
      <span aria-hidden="true" className="kz-live-dot" />
    ) : status === "sold" ? (
      <Check aria-hidden="true" className="size-3.5 text-[var(--d-ov-ok)]" strokeWidth={2.5} />
    ) : status === "unavailable" || status === "ended" ? (
      <XCircle aria-hidden="true" className="size-3.5 opacity-80" />
    ) : (
      <span aria-hidden="true" className={`size-1.5 rounded-full ${DOT[status] || "bg-white/70"}`} />
    );
  return (
    <span className={`d-ov-chip ${CHIP} ${className}`}>
      {glyph}
      {label || labelFor(status, ui)}
    </span>
  );
}

/** "+⃁ 25" movement chip. */
export function DeltaChip({ amount, percent, tone = "up", className = "" }) {
  const toneCls = tone === "down" ? "bg-success/12 text-success" : tone === "gold" ? "bg-accent/15 text-auction" : "bg-success/12 text-success";
  return (
    <span className={`d-num inline-flex h-6 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-xs font-medium ${toneCls} ${className}`} dir="ltr">
      {percent != null ? (
        <span>{tone === "down" ? "−" : "+"}{percent}%</span>
      ) : (
        <>
          <span aria-hidden="true">+</span>
          <Money value={amount} />
        </>
      )}
    </span>
  );
}

/** Mono pill for lot numbers and counters. */
export function LotTag({ lot, className = "" }) {
  return (
    <span className={`d-num inline-flex h-6 shrink-0 items-center rounded-md px-1.5 text-[11px] font-medium tracking-wide text-fg-3 ring-1 ring-inset ring-line ${className}`} dir="ltr">
      {lot}
    </span>
  );
}
