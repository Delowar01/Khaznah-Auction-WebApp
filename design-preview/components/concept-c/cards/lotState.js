"use client";

import { useRemaining } from "@/lib/clock";
import { auctionPhase, isAuction } from "@/lib/catalog";

/**
 * Live clock state for a lot card: remaining seconds (or seconds until
 * opening for scheduled lots), phase and urgency colour.
 */
export function useLotClock(product) {
  const auction = isAuction(product);
  const scheduled = product.status === "scheduled";
  const remaining = useRemaining(auction ? (scheduled ? product.startsIn : product.endsIn) : null);
  if (!auction) return { auction: false, phase: null, remaining: null, urgency: "normal" };
  const phase = auctionPhase(product, scheduled ? null : remaining);
  const urgency = phase === "critical" ? "critical" : phase === "urgent" ? "urgent" : "normal";
  return { auction: true, phase, remaining, urgency, open: phase === "live" || phase === "urgent" || phase === "critical" };
}

/** Badge for an auction phase. */
export const PHASE_BADGE = {
  live: { tone: "neutral", key: "auction", dia: true },
  urgent: { tone: "warning", key: "endingSoon", dia: true },
  critical: { tone: "live", key: "closingNow", live: true },
  upcoming: { tone: "primary", key: "upcoming", dia: true },
  ended: { tone: "muted", key: "ended" },
  sold: { tone: "night", key: "sold" },
};

/** Stock state for a Buy Now lot. */
export function stockState(product) {
  if (product.stock <= 0) return "out";
  if (product.fullStockRequired) return "lot";
  if (product.stock <= 5) return "low";
  return "in";
}
