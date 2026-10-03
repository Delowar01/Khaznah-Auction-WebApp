"use client";

// Live Auction behaviour shared by the four options: the room around the
// simulated live event (lib/useLiveEvent.js) — the call on the current lot
// (open, going once, going twice, closing), the late-bid notice, the hammer
// and the pause before the next lot, the bidder's state, one-tap bid amounts,
// the lot queue, the activity rows, screen-reader announcements, the phone
// tabs and the upcoming-event reminders. Nothing here decides how anything
// looks; the toast clearance for the phone bid bar is the Auction Detail's
// useToastClearance.
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { spokenDuration, useTabs } from "@/components/shared/auction/hooks";
import { countdownText } from "@/components/shared/r3/home";
import { useMediaQuery } from "@/components/shared/ui/hooks";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { marketSaving } from "@/lib/catalog";
import { useElapsed } from "@/lib/clock";
import { formatAgo, moneyLabel } from "@/lib/format";
import { EXTEND_TO, INTERMISSION, feedAge, useLiveEvent } from "@/lib/useLiveEvent";
import { LIVE_COPY as C } from "./copy";

/** How long the late-bid notice stays up after the clock jumps back (seconds). */
const NOTICE_SECONDS = 4;

const quickFor = (item) => [item.startingBid, item.startingBid + item.increment, item.startingBid + item.increment * 3];

// ── The room ───────────────────────────────────────────────────────────────
/**
 * Everything a live room shows, ready to render. `room.live` is the engine
 * itself (current lot, items, feed, placeBid …).
 *
 * The call: the engine's phases with one change of presentation — its own
 * "closing" (0 s) is never reached because the hammer falls on that tick,
 * so the final second, after rival bidding has stopped, reads as Closing.
 */
export function useLiveRoom() {
  const { t, ui, pl, money, lang } = useLang();
  const live = useLiveEvent();
  const { current: lot, items, currentIndex, remaining, intermission, phase, lastHammer, nextItem, myState } = live;
  const hammering = phase === "intermission";
  const paused = hammering || !lot;

  let call = phase === "live" ? "open" : phase;
  if (hammering) call = "hammer";
  else if (phase === "going_twice" && remaining <= 1) call = "closing";
  const callLabel = { open: t(C.open), going_once: ui("goingOnce"), going_twice: ui("goingTwice"), closing: ui("closingNow"), hammer: t(C.betweenLots) }[call];

  // Late bids: the engine puts the clock back up to EXTEND_TO seconds. Seen
  // here as the clock rising on the same lot; the notice stays for a few
  // seconds and a new late bid starts it again.
  const [track, setTrack] = useState({ index: currentIndex, remaining, until: 0, count: 0 });
  if (track.index !== currentIndex || track.remaining !== remaining) {
    const late = track.index === currentIndex && !hammering && remaining > track.remaining;
    setTrack({
      index: currentIndex,
      remaining,
      until: late ? remaining - NOTICE_SECONDS + 1 : track.index === currentIndex ? track.until : 0,
      count: track.count + (late ? 1 : 0),
    });
  }
  const extended = !hammering && track.until > 0 && remaining >= track.until;

  const hammer =
    hammering && lastHammer
      ? {
          kind: lastHammer.sold ? (lastHammer.mine ? "won" : "sold") : "passed",
          label: lastHammer.sold ? (lastHammer.mine ? t(C.soldToYou) : ui("soldHammer")) : t(C.passedReserve),
          title: t(lastHammer.title),
          amount: lastHammer.sold ? lastHammer.amount : null,
          nextIn: intermission,
          nextLabel: t(C.nextLotIn, { n: intermission }),
          next: nextItem ? { order: nextItem.order, title: t(nextItem.title), opening: nextItem.startingBid } : null,
          // 1 → 0 across the pause, for a quiet progress line.
          left: intermission / INTERMISSION,
        }
      : null;

  const bidderTitles = { highest: ui("youAreWinning"), outbid: ui("youAreOutbid"), won: ui("youWon") };
  const bidder = bidderTitles[myState] ? { kind: myState, title: bidderTitles[myState] } : null;

  // Bid amounts: while the next lot is waiting, its opening amounts (the
  // buttons stay in place, unavailable, so keyboard focus is never lost).
  const amounts = paused ? (nextItem ? quickFor(nextItem) : [null, null, null]) : live.quickBids;
  const minNext = paused ? (nextItem ? nextItem.startingBid : null) : live.minNext;
  const bid = (amount) => (paused || amount == null ? { ok: false } : live.placeBid(amount));
  const bidLabel = (amount) => ui("bidAmount", { amount: moneyLabel(amount, lang) });

  const host = getSeller(LIVE_EVENT.host);
  const event = {
    title: t(LIVE_EVENT.title),
    presenter: t(LIVE_EVENT.presenter),
    host,
    hostName: t(host.name),
    hostHref: `/seller/${host.code}`,
    viewers: pl("viewers", live.viewers),
    deposit: t(C.liveDeposit, { amount: money(LIVE_EVENT.depositAmount) }),
    progress: t(C.saleProgress, { done: live.completed.length, total: items.length }),
  };

  const saving = lot?.marketPrice ? marketSaving(lot, lot.currentBid) : 0;
  const lotInfo = lot
    ? {
        order: lot.order,
        number: t(C.lotNumber, { n: lot.order }),
        of: ui("lotOf", { n: lot.order, total: items.length }),
        title: t(lot.title),
        note: lot.note ? t(lot.note) : null,
        grade: lot.grade || null,
        priceLabel: lot.bidCount ? ui("currentBid") : ui("openingBid"),
        price: lot.currentBid,
        bids: lot.bidCount ? pl("bids", lot.bidCount) : t(C.noBidsLive),
        savingLabel: saving > 0 ? ui("belowMarket", { pct: saving }) : null,
      }
    : null;

  const clock = {
    seconds: hammering ? 0 : remaining,
    text: t(C.secondsShort, { n: hammering ? 0 : remaining }),
    spoken: t(C.clockSpoken, { time: spokenDuration(hammering ? 0 : remaining, lang) }),
    progress: hammering ? 0 : Math.max(0, Math.min(1, remaining / live.duration)),
    tone: call === "open" ? "calm" : call === "going_once" ? "warn" : call === "hammer" ? "paused" : "final",
  };

  const notice = {
    extended,
    text: t(C.extended, { n: EXTEND_TO }),
    rule: t(C.extendRule, { n: EXTEND_TO }),
  };

  const announce = useAnnouncements({ live, call, callLabel, clock, hammer, lotInfo, extended, extensions: track.count });
  useToastsAwayFromConsole();

  return {
    live,
    lot,
    lotInfo,
    nextItem,
    upNext: nextItem ? t(nextItem.title) : null,
    event,
    call,
    callLabel,
    clock,
    notice,
    hammer,
    bidder,
    paused,
    amounts,
    minNext,
    bid,
    bidLabel,
    announce,
  };
}

// ── Screen-reader announcements ────────────────────────────────────────────
/**
 * Two messages for the live regions (see LiveAnnouncer): `urgent` (going
 * once / twice, closing, the hammer, the next lot going live) and `polite`
 * (a late bid putting the clock back). Each message changes only when its
 * event happens, so nothing repeats; the bidder's own results arrive as
 * toasts, which the Toaster already announces.
 */
function useAnnouncements({ live, call, callLabel, clock, hammer, lotInfo, extended, extensions }) {
  const { t, lang } = useLang();
  const index = live.currentIndex;
  const [said, setSaid] = useState({ key: `lot:${index}`, lot: index, urgent: "", politeKey: 0, polite: "" });

  let key = null;
  let text = "";
  if (hammer) {
    key = `hammer:${live.lastHammer?.at}`;
    text = `${hammer.label}: ${hammer.title}${hammer.amount != null ? `, ${moneyLabel(hammer.amount, lang)}` : ""}.`;
  } else if (call !== "open" && !extended) {
    key = `call:${index}:${call}:${extensions}`;
    text = `${callLabel}. ${clock.spoken}.`;
  } else if (said.lot !== index && lotInfo) {
    key = `lot:${index}`;
    text = t(C.nowLiveSpoken, { n: lotInfo.order, total: live.items.length, title: lotInfo.title, label: lotInfo.priceLabel, amount: moneyLabel(lotInfo.price, lang) });
  }
  const politeChanged = extensions !== said.politeKey;
  if ((key && key !== said.key) || politeChanged) {
    setSaid({
      key: key ?? said.key,
      lot: key?.startsWith("lot:") ? index : said.lot,
      urgent: key && key !== said.key ? text : said.urgent,
      politeKey: extensions,
      polite: politeChanged ? t(C.extendedSpoken, { n: EXTEND_TO }) : said.polite,
    });
  }
  return { urgent: said.urgent, polite: said.polite };
}

// ── Activity ───────────────────────────────────────────────────────────────
/** The feed as display rows: who (You / Bidder 7Q3), initials, amount and age. */
export function useFeedRows(live) {
  const { t, ui, money, lang } = useLang();
  return live.feed.map((row) => {
    const who = row.own ? ui("you") : `${ui("bidder")} ${row.who}`;
    return {
      id: row.id,
      own: row.own,
      who,
      initials: row.own ? t(DEMO_USER.initials) : row.who.slice(0, 3),
      amount: row.amount,
      text: ui("bidFrom", { who, amount: money(row.amount) }),
      spoken: ui("bidFrom", { who, amount: moneyLabel(row.amount, lang) }),
      ago: formatAgo(feedAge(row), lang),
    };
  });
}

// ── Lot queue ──────────────────────────────────────────────────────────────
const QUEUE_LABEL = { live: "liveNow", sold: "soldFor", passed: "passed", next: "upNext", upcoming: "upcoming" };

/**
 * Every lot in the sale with its status: live, sold (with the price), passed
 * (not sold), next or upcoming. `current` marks the lot on the block.
 */
export function useLotQueue(live) {
  const { t, ui } = useLang();
  const hammering = live.phase === "intermission";
  return live.items.map((item, index) => {
    let status = "upcoming";
    if (item.status === "live") status = "live";
    else if (item.status === "sold") status = "sold";
    else if (item.status === "reserve_not_met") status = "passed";
    else if (live.nextItem?.order === item.order) status = "next";
    return {
      key: item.order,
      order: item.order,
      title: t(item.title),
      image: item.image,
      startingBid: item.startingBid,
      finalBid: item.finalBid ?? null,
      status,
      label: ui(QUEUE_LABEL[status]),
      current: index === live.currentIndex && !hammering,
    };
  });
}

// ── Toasts ─────────────────────────────────────────────────────────────────
/**
 * From 768 px the toast stack normally sits at the bottom end — where every
 * option's bid console is. While the live room is open it moves to the start
 * side (--kz-toast-align), so a bid, outbid or won toast never lands on the
 * Bid button; leaving the page restores the default. Phones keep the centred
 * stack above the live bid bar (useToastClearance).
 */
export function useToastsAwayFromConsole() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--kz-toast-align", "flex-start");
    return () => root.style.removeProperty("--kz-toast-align");
  }, []);
}

// ── Phone tabs ─────────────────────────────────────────────────────────────
/**
 * Bid, Activity and Lots as tabs below `query`; from `query` up the three
 * sections show together and carry no tab semantics. Visibility is the
 * caller's CSS (`shown(key)` + its own breakpoint), so the server HTML is
 * right at every width before the page hydrates.
 */
export function useLiveTabs(query = "(min-width: 1024px)") {
  const { t } = useLang();
  const tabs = useTabs(["bid", "activity", "lots"]);
  const wide = useMediaQuery(query, false);
  return {
    label: t(C.roomSections),
    items: [
      { key: "bid", label: t(C.tabBid) },
      { key: "activity", label: t(C.tabActivity) },
      { key: "lots", label: t(C.tabLots) },
    ],
    tabProps: tabs.tabProps,
    panelProps: (key) => (wide ? { id: tabs.panelProps(key).id } : { ...tabs.panelProps(key), hidden: undefined }),
    shown: (key) => tabs.active === key,
  };
}

// ── Upcoming events ────────────────────────────────────────────────────────
/** Local reminder toggles for upcoming live events, confirmed by a toast both ways (no backend). */
export function useEventReminders() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const [on, setOn] = useState(() => new Set());
  const toggle = useCallback(
    (event) => {
      const next = !on.has(event.slug);
      setOn((set) => {
        const copy = new Set(set);
        if (next) copy.add(event.slug);
        else copy.delete(event.slug);
        return copy;
      });
      toast({ tone: next ? "success" : "neutral", title: next ? ui("reminderSet") : t(C.reminderOff), description: t(event.title) });
    },
    [on, t, toast, ui],
  );
  return { isOn: (event) => on.has(event.slug), toggle };
}

/** The other live events with host, lot count, a ticking "starts in" and the reminder. */
export function useUpcomingEvents() {
  const { t, ui, pl, lang } = useLang();
  const reminders = useEventReminders();
  const elapsed = useElapsed();
  return OTHER_EVENTS.map((event) => {
    const host = getSeller(event.host);
    const startsIn = Math.max(0, event.startsIn - elapsed);
    return {
      key: event.slug,
      title: t(event.title),
      image: event.image,
      host,
      hostName: host ? t(host.name) : "",
      lots: pl("lots", event.lots),
      startsLabel: ui("startsIn"),
      startsIn: countdownText(startsIn, lang),
      startsSpoken: spokenDuration(startsIn, lang),
      reminded: reminders.isOn(event),
      toggle: () => reminders.toggle(event),
      remindLabel: reminders.isOn(event) ? ui("reminderOn") : ui("remindEvent"),
    };
  });
}
