"use client";

// Simulated presenter-led live auction.
//
// Mirrors the live-event item lifecycle in liveauctions/services.py:
// staged → countdown → live (deadline) → sold | reserve_not_met, then the
// next staged lot. Rival bids arrive every few seconds; when the deadline
// passes the lot is hammered down, a short intermission counts down and the
// next lot goes live. The sequence loops so the demo never runs dry.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LIVE_EVENT } from "@/data/live";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useLang } from "@/components/shared/providers/LangProvider";

const RIVALS = ["7Q3", "4821", "K27", "5530", "82F", "A09", "9D1", "3314", "M55"];
const INTERMISSION = 6;
const EXTEND_TO = 12; // presenter extends the clock when a bid lands late

function initialItems(event) {
  return event.items.map((item) => ({
    ...item,
    currentBid: item.status === "live" ? item.currentBid : item.finalBid ?? item.startingBid,
    bidCount: item.bidCount ?? 0,
  }));
}

function seedFeed(item) {
  const rows = [];
  let amount = item.currentBid;
  for (let i = 0; i < 6; i += 1) {
    const who = RIVALS[(i * 3 + 2) % RIVALS.length];
    rows.push({ id: `seed-${i}`, who, amount, own: false, secondsAgo: 4 + i * 7 });
    amount -= item.increment;
  }
  return rows;
}

export function useLiveEvent(event = LIVE_EVENT) {
  const { toast } = useStore();
  const { ui, money } = useLang();
  const [items, setItems] = useState(() => initialItems(event));
  const [currentIndex, setCurrentIndex] = useState(() => event.items.findIndex((i) => i.status === "live"));
  const [remaining, setRemaining] = useState(27);
  const [intermission, setIntermission] = useState(0);
  const [feed, setFeed] = useState(() => seedFeed(event.items.find((i) => i.status === "live")));
  const [viewers, setViewers] = useState(event.viewers);
  const [myState, setMyState] = useState("neutral"); // neutral | highest | outbid | won
  const [lastHammer, setLastHammer] = useState(null);
  const stateRef = useRef({});

  const current = items[currentIndex];
  useEffect(() => {
    stateRef.current = { items, currentIndex, remaining, intermission, myState };
  });

  const minNext = current ? (current.bidCount > 0 ? current.currentBid + current.increment : current.startingBid) : 0;

  const phase = intermission > 0 ? "intermission" : remaining > 10 ? "live" : remaining > 5 ? "going_once" : remaining > 0 ? "going_twice" : "closing";

  const recordBid = useCallback((index, amount, who, own) => {
    setItems((list) => list.map((item, i) => (i === index ? { ...item, currentBid: amount, bidCount: item.bidCount + 1 } : item)));
    setFeed((rows) => [{ id: `${Date.now()}-${Math.random()}`, who, amount, own, at: Date.now() }, ...rows].slice(0, 30));
    setRemaining((r) => Math.max(r, EXTEND_TO));
  }, []);

  const placeBid = useCallback(
    (amount = minNext) => {
      if (!current || intermission > 0) return { ok: false };
      if (amount < minNext) return { ok: false, error: ui("bidTooLow", { amount: money(minNext) }) };
      recordBid(currentIndex, amount, "you", true);
      setMyState("highest");
      toast({ tone: "success", title: ui("bidPlaced"), description: money(amount) });
      return { ok: true };
    },
    [current, currentIndex, intermission, minNext, money, recordBid, toast, ui],
  );

  // 1-second heartbeat for the lot clock and intermission.
  useEffect(() => {
    const timer = window.setInterval(() => {
      const s = stateRef.current;
      if (s.intermission > 0) {
        if (s.intermission === 1) {
          // Next lot goes live. When the sequence is exhausted the demo loops
          // back to lot 5 so the room never goes quiet.
          let list = s.items;
          let next = list.findIndex((item, i) => i > s.currentIndex && item.status === "staged");
          if (next === -1) {
            list = list.map((item, i) => (i >= 4 ? { ...item, status: "staged", currentBid: item.startingBid, bidCount: 0, finalBid: null } : item));
            next = 4;
          }
          const target = list[next];
          setItems(list.map((item, i) => (i === next ? { ...item, status: "live", currentBid: target.startingBid, bidCount: 0 } : item)));
          setCurrentIndex(next);
          setFeed([]);
          setMyState("neutral");
          setRemaining(event.itemDurationSeconds);
        }
        setIntermission((n) => Math.max(0, n - 1));
        return;
      }
      if (s.remaining <= 1) {
        // Hammer down.
        setItems((list) =>
          list.map((item, i) => (i === s.currentIndex ? { ...item, status: item.bidCount > 0 ? "sold" : "reserve_not_met", finalBid: item.bidCount > 0 ? item.currentBid : null } : item)),
        );
        const item = s.items[s.currentIndex];
        setLastHammer({ title: item.title, amount: item.currentBid, sold: item.bidCount > 0, mine: s.myState === "highest", at: Date.now() });
        if (s.myState === "highest") {
          setMyState("won");
          toast({ tone: "success", title: ui("youWon"), description: money(item.currentBid) });
        }
        setRemaining(0);
        setIntermission(INTERMISSION);
        return;
      }
      setRemaining((r) => r - 1);
      setViewers((v) => Math.max(900, v + Math.round((Math.random() - 0.45) * 6)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [event.itemDurationSeconds, money, toast, ui]);

  // Rival bidders: frequent early, thinning out as the price climbs past market.
  useEffect(() => {
    if (!current || intermission > 0 || remaining <= 0) return undefined;
    const pressure = current.marketPrice ? current.currentBid / current.marketPrice : current.currentBid / (current.startingBid * 3);
    const chance = pressure > 0.95 ? 0.25 : pressure > 0.75 ? 0.55 : 0.85;
    const delay = 2800 + Math.random() * 4200;
    const timer = window.setTimeout(() => {
      const s = stateRef.current;
      if (s.intermission > 0 || s.remaining <= 1) return;
      if (Math.random() > chance) return;
      const item = s.items[s.currentIndex];
      const amount = item.bidCount > 0 ? item.currentBid + item.increment : item.startingBid;
      const who = RIVALS[Math.floor(Math.random() * RIVALS.length)];
      recordBid(s.currentIndex, amount, who, false);
      if (s.myState === "highest") {
        setMyState("outbid");
        toast({ tone: "warning", title: ui("youAreOutbid"), description: ui("outbidToast", { amount: money(amount) }) });
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [current, intermission, remaining, recordBid, toast, ui, money]);

  const completed = useMemo(() => items.filter((i) => i.status === "sold" || i.status === "reserve_not_met"), [items]);
  const upcoming = useMemo(() => items.filter((i, index) => i.status === "staged" && index > currentIndex), [items, currentIndex]);
  const nextItem = upcoming[0] || null;

  return {
    event,
    items,
    current,
    currentIndex,
    nextItem,
    completed,
    upcoming,
    remaining,
    duration: event.itemDurationSeconds,
    phase,
    intermission,
    minNext,
    quickBids: current ? [minNext, minNext + current.increment, minNext + current.increment * 3] : [],
    feed,
    viewers,
    myState,
    lastHammer,
    placeBid,
  };
}

export function feedAge(row) {
  if (row.at) return Math.max(0, (Date.now() - row.at) / 1000);
  return row.secondsAgo || 0;
}
