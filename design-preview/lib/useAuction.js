"use client";

// Simulated timed-auction engine for the prototype.
//
// Behaviour follows the production contract (marketplace bidding views):
//  • first bid ≥ starting bid, later bids ≥ current bid + increment
//  • proxy / maximum bid answers a rival bid one increment higher, up to the ceiling
//  • anti-sniping: a bid in the final 5 minutes extends the end by 5 minutes
//  • bidder state: neutral · highest · outbid · won · lost
// Competing bidders are simulated so the page feels live. No network calls.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useElapsed } from "@/lib/clock";
import { sampleBidHistory } from "@/lib/catalog";
import { AUCTION_POLICY, DEMO_USER } from "@/data/site";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useLang } from "@/components/shared/providers/LangProvider";

const RIVALS = ["7Q3", "4821", "K27", "5530", "82F", "A09", "9D1"];

export function useAuction(product, { simulateRivals = true } = {}) {
  const now = useElapsed();
  const { toast } = useStore();
  const { ui, money } = useLang();

  const [bid, setBid] = useState(() => ({
    current: product.currentBid,
    count: product.bidCount,
    bidders: product.bidderCount,
    watchers: product.watchers,
  }));
  const [history, setHistory] = useState(() => sampleBidHistory(product));
  const [extension, setExtension] = useState(0);
  const [myMax, setMyMax] = useState(null);
  const [state, setState] = useState("neutral"); // neutral | highest | outbid
  const [flash, setFlash] = useState(0); // increments whenever the price moves (for UI flashes)
  const stateRef = useRef({ bid, myMax, state });
  useEffect(() => {
    stateRef.current = { bid, myMax, state };
  }, [bid, myMax, state]);

  const isScheduled = product.status === "scheduled";
  const isSold = product.status === "sold";
  const endsIn = (isScheduled ? product.endsIn : product.endsIn) + extension;
  const remaining = isSold ? 0 : Math.max(0, endsIn - now);
  const startsIn = isScheduled ? Math.max(0, product.startsIn - now) : 0;
  const ended = isSold || (!isScheduled && remaining <= 0);

  const minNext = bid.count > 0 ? bid.current + product.increment : product.startingBid;
  const quickBids = [minNext, minNext + product.increment, minNext + product.increment * 4];

  const phase = isSold
    ? "sold"
    : isScheduled
      ? "upcoming"
      : ended
        ? "ended"
        : remaining <= 600
          ? "critical"
          : remaining <= 3600
            ? "urgent"
            : "live";

  const bidderState = ended
    ? state === "highest"
      ? "won"
      : state === "outbid"
        ? "lost"
        : "neutral"
    : state;

  const pushHistory = useCallback((entry) => {
    setHistory((rows) => [entry, ...rows.map((row) => ({ ...row, isWinning: false }))].slice(0, 12));
  }, []);

  const applyAntiSnipe = useCallback(() => {
    const left = endsIn - now;
    if (left > 0 && left <= AUCTION_POLICY.antiSnipeWindowSeconds) {
      setExtension((x) => x + AUCTION_POLICY.antiSnipeExtendSeconds);
      toast({ tone: "info", title: ui("timeExtended"), description: ui("antiSnipe") });
    }
  }, [endsIn, now, toast, ui]);

  const placeBid = useCallback(
    (amount) => {
      const value = Math.round(Number(amount) * 100) / 100;
      if (!value) return { ok: false, error: ui("bidRequired") };
      if (value < minNext) return { ok: false, error: ui("bidTooLow", { amount: money(minNext) }) };
      setBid((b) => ({ ...b, current: value, count: b.count + 1, bidders: state === "neutral" ? b.bidders + 1 : b.bidders }));
      pushHistory({
        id: `me-${Date.now()}`,
        amount: value,
        secondsAgo: 0,
        at: Date.now(),
        bidder: "you",
        label: { en: "You", ar: "أنت" },
        type: "normal",
        isWinning: true,
        isOwn: true,
      });
      setState("highest");
      setFlash((f) => f + 1);
      applyAntiSnipe();
      toast({ tone: "success", title: ui("bidPlaced"), description: money(value) });
      return { ok: true };
    },
    [minNext, money, pushHistory, state, applyAntiSnipe, toast, ui],
  );

  const setMaxBid = useCallback(
    (amount) => {
      const value = Math.round(Number(amount));
      if (!value || value < minNext) return { ok: false, error: ui("bidTooLow", { amount: money(minNext) }) };
      setMyMax(value);
      // If nobody leads for us yet, the proxy places the opening bid immediately.
      if (stateRef.current.state !== "highest") placeBid(minNext);
      toast({ tone: "success", title: ui("maxBidSaved", { amount: money(value) }) });
      return { ok: true };
    },
    [minNext, money, placeBid, toast, ui],
  );

  const clearMaxBid = useCallback(() => {
    setMyMax(null);
    toast({ tone: "neutral", title: ui("maxBidCleared") });
  }, [toast, ui]);

  // Simulated rival bidders.
  useEffect(() => {
    if (!simulateRivals || isScheduled || isSold || ended) return undefined;
    const { state: me } = stateRef.current;
    // Rivals respond faster right after you take the lead, so the outbid flow is visible.
    const delay = me === "highest" ? 9000 + Math.random() * 7000 : 20000 + Math.random() * 22000;
    const timer = window.setTimeout(() => {
      const { bid: b, myMax: max, state: meNow } = stateRef.current;
      const rivalAmount = b.current + product.increment * (Math.random() > 0.7 ? 2 : 1);
      const rival = RIVALS[Math.floor(Math.random() * RIVALS.length)];
      const rivalEntry = {
        id: `r-${Date.now()}`,
        amount: rivalAmount,
        secondsAgo: 0,
        at: Date.now(),
        bidder: rival,
        label: { en: `Bidder ${rival}`, ar: `مزايد ${rival}` },
        type: "normal",
        isWinning: true,
        isOwn: false,
      };
      if (meNow === "highest" && max && max >= rivalAmount + product.increment) {
        // Proxy responds on the customer's behalf.
        const answer = rivalAmount + product.increment;
        setBid((x) => ({ ...x, current: answer, count: x.count + 2 }));
        setHistory((rows) =>
          [
            { ...rivalEntry, id: `me-auto-${Date.now()}`, amount: answer, bidder: "you", label: { en: "You", ar: "أنت" }, type: "proxy_auto", isOwn: true },
            { ...rivalEntry, isWinning: false },
            ...rows.map((row) => ({ ...row, isWinning: false })),
          ].slice(0, 12),
        );
        setFlash((f) => f + 1);
        toast({ tone: "info", title: ui("proxyResponded"), description: money(answer) });
        return;
      }
      setBid((x) => ({ ...x, current: rivalAmount, count: x.count + 1, watchers: x.watchers + (Math.random() > 0.6 ? 1 : 0) }));
      pushHistory(rivalEntry);
      setFlash((f) => f + 1);
      if (meNow === "highest") {
        setState("outbid");
        toast({ tone: "warning", title: ui("youAreOutbid"), description: ui("outbidToast", { amount: money(rivalAmount) }) });
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [simulateRivals, isScheduled, isSold, ended, product.increment, pushHistory, toast, ui, money, flash, state]);

  const deposit = useMemo(() => {
    const required = AUCTION_POLICY.depositAmount;
    return { required, walletBalance: DEMO_USER.walletBalance, covered: DEMO_USER.walletBalance >= required };
  }, []);

  return {
    phase,
    ended,
    remaining,
    startsIn,
    currentBid: bid.current,
    bidCount: bid.count,
    bidderCount: bid.bidders,
    watchers: bid.watchers,
    minNext,
    quickBids,
    increment: product.increment,
    history,
    bidderState,
    myMax,
    extended: extension > 0,
    flash,
    deposit,
    buyNowAvailable: product.saleType === "both" && !ended && bid.current < product.buyNowPrice,
    placeBid,
    setMaxBid,
    clearMaxBid,
  };
}

/** Seconds since a history row was placed (sample rows age with the page clock). */
export function bidAge(row, elapsed) {
  if (row.at) return Math.max(0, (Date.now() - row.at) / 1000);
  return (row.secondsAgo || 0) + (elapsed || 0);
}
