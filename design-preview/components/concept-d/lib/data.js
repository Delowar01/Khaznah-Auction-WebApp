// Data-language helpers for Concept D: auction windows, urgency tones,
// bid velocity and heat — all derived from the shared catalogue fields.
import { bidAge } from "@/lib/useAuction";
import { formatDuration } from "@/lib/format";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Rings and time bars share one 24-hour horizon, so every lot is comparable. */
export const TIME_HORIZON = 24 * 3600;

/**
 * Share of the final day still to run: full for lots with a day or more
 * left, draining linearly through the last 24 hours (0 → closed). Upcoming
 * lots show the wait until bidding opens on the same scale.
 */
export function timeFraction(product, { phase, remaining, startsIn } = {}) {
  if (phase === "sold" || phase === "ended") return 0;
  if (phase === "upcoming") return clamp((startsIn ?? 0) / TIME_HORIZON);
  return clamp((remaining ?? 0) / TIME_HORIZON);
}

/** Visual tone for a phase: drives ring, bar and chip colours. */
export function toneOf(phase) {
  if (phase === "critical") return "danger";
  if (phase === "urgent") return "warning";
  if (phase === "upcoming") return "upcoming";
  if (phase === "ended" || phase === "sold") return "muted";
  return "ink";
}

/** Compact time text for rings and tight cells: 18:24 · 2h 14m · 1d 3h. */
export function compactTime(seconds, lang) {
  if (seconds == null) return "";
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return formatDuration(seconds, lang, "short");
}

/** Bids placed in the last `windowSec` seconds (default ten minutes). */
export function bidVelocity(history, elapsed, windowSec = 600) {
  if (!history?.length) return 0;
  return history.filter((row) => bidAge(row, elapsed) <= windowSec).length;
}

/** Heat level 1–4 from total bids and recent velocity. */
export function heatLevel(bidCount = 0, velocity = 0) {
  const score = bidCount + velocity * 6;
  if (score >= 38) return 4;
  if (score >= 24) return 3;
  if (score >= 12) return 2;
  return 1;
}

/** Size of the latest price step (0 when there is only one bid). */
export function lastStep(history) {
  if (!history || history.length < 2) return 0;
  return Math.max(0, history[0].amount - history[1].amount);
}

/** Amounts oldest → newest for charts, with the live price as the last point. */
export function pricePoints(history, currentBid, startingBid) {
  const rows = (history || []).slice().reverse();
  const points = rows.map((row) => ({ amount: row.amount, own: !!row.isOwn, id: row.id, row }));
  if (!points.length && startingBid) points.push({ amount: startingBid, own: false, id: "start", row: null });
  if (points.length && currentBid && points[points.length - 1].amount !== currentBid) {
    points.push({ amount: currentBid, own: false, id: "now", row: null });
  }
  return points;
}

/** Stock level 0–1 for the meter, plus a tone. */
export function stockLevel(stock) {
  if (!stock) return { fraction: 0, tone: "muted" };
  if (stock <= 3) return { fraction: clamp(stock / 30, 0.08), tone: "danger" };
  if (stock <= 8) return { fraction: clamp(stock / 30, 0.15), tone: "warning" };
  return { fraction: clamp(stock / 30, 0.3), tone: "success" };
}
