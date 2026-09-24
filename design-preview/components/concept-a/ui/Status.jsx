"use client";

import { useLang } from "@/components/shared/providers/LangProvider";

const STYLES = {
  live: "!text-live",
  urgent: "!text-live",
  critical: "!text-live",
  upcoming: "!text-primary",
  sold: "!text-fg-2",
  ended: "!text-fg-2",
  new: "!text-[var(--accent-text)]",
  buyNow: "!text-fg",
  unavailable: "!text-fg-3",
  watching: "!text-[var(--accent-text)]",
};

const KEYS = {
  live: "liveNow",
  urgent: "endingSoon",
  critical: "closingNow",
  upcoming: "upcoming",
  sold: "sold",
  ended: "ended",
  new: "newListing",
  buyNow: "buyNow",
  unavailable: "soldOut",
  watching: "watching",
};

/** Small status line: a dot (pulsing when live) and a small-caps label. */
export function StatusLabel({ status, className = "", label }) {
  const { ui } = useLang();
  const pulse = status === "live" || status === "critical";
  return (
    <span className={`a-eyebrow inline-flex items-center gap-2 ${STYLES[status] || "!text-fg-2"} ${className}`}>
      {pulse ? <span className="kz-live-dot !bg-current" aria-hidden="true" /> : <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {label || ui(KEYS[status] || status)}
    </span>
  );
}
