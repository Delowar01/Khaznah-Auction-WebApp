"use client";

import { useElapsed } from "@/lib/clock";
import { isNewListing } from "@/lib/catalog";
import { useLot } from "../market/MarketProvider";
import { bidVelocity, heatLevel, lastStep, pricePoints, timeFraction, toneOf } from "../lib/data";

/**
 * Everything a card or board row needs to render an auction as data:
 * phase, time share, tone, live price, step, velocity and heat.
 * `override` lets the components board pin a lot to a given phase.
 */
export function useAuctionView(product, override = null) {
  const engine = useLot(product.slug);
  const elapsed = useElapsed();
  const a = engine || {
    phase: product.status === "sold" ? "sold" : product.status === "scheduled" ? "upcoming" : "live",
    remaining: product.endsIn,
    startsIn: product.startsIn || 0,
    currentBid: product.currentBid,
    bidCount: product.bidCount,
    bidderCount: product.bidderCount,
    watchers: product.watchers,
    history: [],
    flash: 0,
  };
  const phase = override?.phase || a.phase;
  const remaining = override?.remaining ?? (phase === "ended" ? 0 : a.remaining);
  const startsIn = a.startsIn;
  const fraction = override?.fraction ?? timeFraction(product, { phase, remaining, startsIn });
  const velocity = bidVelocity(a.history, elapsed);
  const own = a.history[0]?.isOwn && (a.bidderState === "highest" || a.bidderState === "won");
  return {
    engine: a,
    phase,
    remaining,
    startsIn,
    fraction,
    tone: toneOf(phase),
    currentBid: a.currentBid,
    bidCount: a.bidCount,
    watchers: a.watchers,
    flash: a.flash,
    history: a.history,
    step: lastStep(a.history),
    velocity,
    heat: heatLevel(a.bidCount, velocity),
    spark: pricePoints(a.history, a.currentBid, product.startingBid).map((p) => p.amount),
    isNew: isNewListing(product),
    own,
    bidderState: a.bidderState,
  };
}

/** Chip status for an auction phase. */
export function auctionChip(phase) {
  if (phase === "critical") return "critical";
  if (phase === "urgent") return "urgent";
  if (phase === "upcoming") return "upcoming";
  if (phase === "sold") return "sold";
  if (phase === "ended") return "ended";
  return "live";
}
