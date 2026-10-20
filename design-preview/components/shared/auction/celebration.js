"use client";

// The winner moment on the Auction Detail and Live Auction pages: when an
// auction the page is showing closes with a winner, a short celebration
// plays once (3.5 s). Behaviour only — Option 3 draws it
// (concept-c/visual-discovery/WinnerCelebration.jsx).
//
// Nothing here decides who won or changes the auction. It reads the result
// the page already shows:
//  • a timed lot: the simulated auction's own phase turning "ended" and the
//    bidder's own state "won" (lib/useAuction.js), and the winning row the
//    closed bid card already names (useWinner — "Bidder 7Q3", or you);
//  • the live room: the hammer (lib/useLiveEvent.js through useLiveRoom),
//    a lot sold to you.
// It plays only for a closing the page saw happen. Lots already closed when
// the page opened, Buy Now purchases and lots without a winner never
// celebrate, and re-renders, repeated updates or focus changes never replay
// it. In the live room the existing Sold card already tells every viewer
// (the live result carries no public winner name), so the moment there is
// the winner's alone.
import { useEffect, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DEMO_USER } from "@/data/site";
import { useWinner } from "./hooks";

/** How long the moment is on the page; the message holds until 2.8 s, then fades (the design's own timeline). */
export const CELEBRATION_MS = 3500;

const OPEN_PHASES = ["live", "urgent", "critical"];

const C = {
  wonEyebrow: { en: "Auction won", ar: "تم الفوز بالمزاد" },
  wonTitle: { en: "Congratulations, {name}!", ar: "مبروك، {name}!" },
  wonLine: { en: "You're the winner!", ar: "أنت الفائز بالمزاد!" },
  completedEyebrow: { en: "Auction completed", ar: "انتهى المزاد" },
  completedTitle: { en: "Congratulations to {name}", ar: "مبروك لـ {name}" },
  completedOnly: { en: "Auction Completed", ar: "انتهى المزاد" },
};

/**
 * The name the header already greets the customer with ("Hello, Faisal"):
 * the first name only, and only ever shown to the customer themselves.
 */
function useDisplayName() {
  const { t } = useLang();
  return t(DEMO_USER.name).split(" ")[0];
}

/** Display-ready message for a moment: eyebrow, title (the name apart, for <bdi>), line, lot and price. */
function useMessage(moment) {
  const { t, ui } = useLang();
  if (!moment) return null;
  const won = moment.kind === "won";
  const named = Boolean(moment.name);
  const template = won ? t(C.wonTitle) : named ? t(C.completedTitle) : t(C.completedOnly);
  const [before, after = ""] = template.split("{name}");
  const title = { before, name: template.includes("{name}") ? moment.name : null, after };
  const line = won ? t(C.wonLine) : null;
  return {
    key: moment.key,
    kind: moment.kind,
    eyebrow: won ? t(C.wonEyebrow) : named ? t(C.completedEyebrow) : null,
    title,
    line,
    lot: moment.lot,
    amountLabel: ui("winningBid"),
    amount: moment.amount,
    // The bid card's status and the live hammer already announce the result; this adds the greeting.
    spoken: [`${title.before}${title.name ?? ""}${title.after}`, line].filter(Boolean).join(" "),
  };
}

/** Plays a moment once: on the page for CELEBRATION_MS, then gone for good. */
function usePlayback(moment) {
  const [ended, setEnded] = useState(null);
  const playing = Boolean(moment) && moment.key !== ended;
  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setTimeout(() => setEnded(moment.key), CELEBRATION_MS);
    return () => window.clearTimeout(timer);
  }, [playing, moment]);
  const message = useMessage(moment);
  return { show: playing ? message : null, spoken: message?.spoken ?? "" };
}

/**
 * Timed lots (Auction Detail). Plays when the page saw the lot open and then
 * saw it close with a winner: the personal moment when the bidder's own
 * state is "won", otherwise "Auction completed" with the public winning
 * bidder the closed bid card shows.
 */
export function useAuctionCelebration(detail) {
  const { t } = useLang();
  const winner = useWinner(detail);
  const name = useDisplayName();
  const { product, auction, bought } = detail;
  const open = OPEN_PHASES.includes(auction.phase);
  // The phase the page last saw; a lot closes once, so it celebrates at most once.
  const [seen, setSeen] = useState({ open, moment: null });
  if (seen.open !== open) {
    const closed = seen.open && !open && !bought && auction.phase === "ended" && winner && !seen.moment;
    const won = auction.bidderState === "won";
    setSeen({
      open,
      moment: closed
        ? {
            key: `auction:${product.slug}`,
            kind: won ? "won" : "completed",
            name: won ? name : winner.isOwn ? null : winner.name,
            lot: t(product.title),
            amount: auction.currentBid,
          }
        : seen.moment,
    });
  }
  return usePlayback(seen.moment);
}

/** Live Auction: plays when the hammer falls on a lot sold to you (once per hammer). */
export function useLiveCelebration(room) {
  const name = useDisplayName();
  const { hammer, live } = room;
  const at = live.lastHammer?.at;
  const key = hammer?.kind === "won" && at ? `live:${at}` : null;
  const [seen, setSeen] = useState({ key: null, moment: null });
  if (key && key !== seen.key) {
    setSeen({ key, moment: { key, kind: "won", name, lot: hammer.title, amount: hammer.amount } });
  }
  return usePlayback(seen.moment);
}
