"use client";

// Auction Detail behaviour shared by the four options: which lot a route
// shows, the page's bidding flow (confirm step, Buy Now, phone sheet, grade
// guide), the bid form, the maximum bid, the bidder's status, bid-history
// pages, the terms, the countdown in words, sharing, tabs, hover zoom and
// keeping toasts clear of the phone bid bar.
// Nothing here decides how anything looks. The simulated auction itself is
// lib/useAuction.js.
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useMediaQuery } from "@/components/shared/ui/hooks";
import { getCategory } from "@/data/categories";
import { ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { FEATURED_AUCTION, getProduct, isAuction } from "@/data/products";
import { CITIES, getSeller } from "@/data/sellers";
import { AUCTION_POLICY } from "@/data/site";
import { marketSaving, openAuctions, relatedProducts, sellerStats } from "@/lib/catalog";
import { useElapsed } from "@/lib/clock";
import { durationParts, formatAgo, formatMonthYear } from "@/lib/format";
import { plural } from "@/lib/i18n";
import { bidAge, useAuction } from "@/lib/useAuction";
import { AUCTION_COPY as C, DURATION_FORMS } from "./copy";

// ── Route ──────────────────────────────────────────────────────────────────
/** The lot an auction route shows: the slug's lot, or the featured auction. */
export function resolveAuctionLot(slug) {
  const found = slug ? getProduct(slug) : null;
  return found && isAuction(found) ? found : getProduct(FEATURED_AUCTION);
}

/** Up to 10 other auctions: same category first, then any open auction (never sold lots). */
export function similarAuctions(product, limit = 10) {
  const related = relatedProducts(product, 30).filter((p) => isAuction(p) && p.status !== "sold");
  const extra = openAuctions().filter((p) => p.slug !== product.slug && !related.includes(p));
  return [...related, ...extra].slice(0, limit);
}

// ── Page flow ──────────────────────────────────────────────────────────────
/**
 * The page's bidding flow around the simulated auction: the confirm step for
 * a bid, Buy Now (dual lots), the phone bid sheet and the grade guide. After
 * a demo Buy Now the lot reads as sold and rival bidding stops.
 */
export function useAuctionDetail(product) {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const [bought, setBought] = useState(false);
  const live = useAuction(product, { simulateRivals: !bought });
  const auction = bought ? { ...live, phase: "sold", ended: true, buyNowAvailable: false } : live;
  const [confirmAmount, setConfirmAmount] = useState(null);
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const { phase } = auction;
  const upcoming = phase === "upcoming";
  const closed = phase === "sold" || phase === "ended";
  const dual = product.saleType === "both";

  /** Validated amount from a bid form: close the phone sheet, then ask to confirm. */
  const requestBid = useCallback((amount) => {
    setSheetOpen(false);
    setConfirmAmount(amount);
  }, []);

  const confirmBid = () => {
    const result = live.placeBid(confirmAmount);
    setConfirmAmount(null);
    if (!result.ok) toast({ tone: "warning", title: ui("placeBid"), description: result.error });
  };

  const confirmBuyNow = () => {
    setBuyNowOpen(false);
    setBought(true);
    toast({ tone: "success", title: t(C.boughtTitle), description: t(C.boughtText, { hours: AUCTION_POLICY.paymentWindowHours }) });
  };

  let priceLabel = ui("currentBid");
  if (bought) priceLabel = ui("buyNow");
  else if (phase === "sold") priceLabel = ui("soldFor");
  else if (closed) priceLabel = ui("winningBid");
  else if (upcoming || !auction.bidCount) priceLabel = ui("startingBid");

  return {
    product,
    auction,
    bought,
    dual,
    upcoming,
    closed,
    open: !upcoming && !closed,
    priceLabel,
    price: bought ? product.buyNowPrice : auction.currentBid,
    // A bid inside the final minutes extends the clock (shown in the confirm step).
    lateBid: auction.remaining > 0 && auction.remaining <= AUCTION_POLICY.antiSnipeWindowSeconds,
    requestBid,
    confirm: { open: confirmAmount != null, amount: confirmAmount, cancel: () => setConfirmAmount(null), accept: confirmBid },
    buyNow: { open: buyNowOpen, show: () => setBuyNowOpen(true), cancel: () => setBuyNowOpen(false), accept: confirmBuyNow, available: auction.buyNowAvailable && !bought },
    sheet: { open: sheetOpen, show: () => setSheetOpen(true), close: () => setSheetOpen(false) },
    guide: { open: guideOpen, show: () => setGuideOpen(true), close: () => setGuideOpen(false) },
  };
}

// ── Lot facts ──────────────────────────────────────────────────────────────
/** Display-ready facts about the lot: category, seller, type, quantity and the breadcrumb. */
export function useLotInfo(product) {
  const { t, ui, pl, lang } = useLang();
  const category = getCategory(product.category);
  const seller = getSeller(product.seller);
  const stats = seller ? sellerStats(seller.code) : null;
  const quantity = product.quantity
    ? t(product.itemType === "pallet" ? C.fullPallet : C.carton, { units: pl("units", product.quantity) })
    : null;
  return {
    title: t(product.title),
    category,
    categoryName: t(category.name),
    categoryHref: `/browse?category=${category.slug}`,
    seller,
    sellerName: seller ? t(seller.name) : "",
    sellerHref: seller ? `/seller/${seller.code}` : null,
    sellerLabel: seller?.platform ? ui("platformSeller") : ui("soldBy"),
    sellerCity: seller ? t(CITIES[seller.city]) : "",
    sellerSince: seller ? ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) }) : "",
    sellerPickup: seller ? t(seller.pickup) : "",
    sellerStats: stats,
    itemType: t(ITEM_TYPES[product.itemType]),
    source: t(SOURCE_TYPES[product.source]),
    // Single items name their source; cartons and pallets their item type.
    typeLine: product.itemType === "single" ? t(SOURCE_TYPES[product.source]) : t(ITEM_TYPES[product.itemType]),
    quantity,
    marketSaving: (bid) => marketSaving(product, bid),
    crumbs: [
      { key: "home", label: ui("home"), href: "/" },
      { key: "auctions", label: ui("auctions"), href: "/browse?tab=auction" },
      { key: "category", label: t(category.name), href: `/browse?category=${category.slug}` },
      { key: "lot", label: t(product.title) },
    ],
  };
}

/** Delivery, pickup (the seller's city and hours) and returns. */
export function useFulfilment(product) {
  const { t, ui } = useLang();
  const seller = getSeller(product.seller);
  return [
    { key: "delivery", title: ui("delivery"), text: ui("deliveryText") },
    { key: "pickup", title: ui("pickup"), text: ui("pickupText", { city: t(CITIES[seller?.city]) }), extra: seller ? t(seller.pickup) : null },
    { key: "returns", title: ui("returns"), text: ui("returnsText") },
  ];
}

/** Deposit, anti-sniping, payment window, increment, binding bids and returns. */
export function useAuctionTerms(product) {
  const { t, ui, money } = useLang();
  return [
    { key: "deposit", text: t(C.termsDeposit, { amount: money(AUCTION_POLICY.depositAmount) }) },
    { key: "snipe", text: ui("antiSnipe") },
    { key: "payment", text: t(C.termsPayment, { hours: AUCTION_POLICY.paymentWindowHours }) },
    { key: "increment", text: t(C.termsIncrement, { amount: money(product.increment) }) },
    { key: "binding", text: ui("bindingBid") },
    { key: "returns", text: ui("returnsText") },
  ];
}

// ── Clock ──────────────────────────────────────────────────────────────────
/** "5 hours 40 minutes" / "5 ساعات و40 دقيقة": two units, for screen readers. */
export function spokenDuration(totalSeconds, lang = "en") {
  const { days, hours, minutes, seconds } = durationParts(totalSeconds ?? 0);
  const word = (key, n) => plural(n, DURATION_FORMS[key], lang);
  let parts;
  if (days > 0) parts = [word("days", days), hours ? word("hours", hours) : null];
  else if (hours > 0) parts = [word("hours", hours), minutes ? word("minutes", minutes) : null];
  else if (minutes > 0) parts = [word("minutes", minutes), seconds ? word("seconds", seconds) : null];
  else parts = [word("seconds", seconds)];
  return parts.filter(Boolean).join(lang === "ar" ? " و" : " ");
}

/**
 * The lot's clock: seconds to the end (or to the start while upcoming), its
 * parts for the digits, the label and one spoken phrase. `tone` is
 * "critical" under 10 minutes, "urgent" under an hour.
 */
export function useAuctionClock(auction) {
  const { ui, t, lang } = useLang();
  const { phase } = auction;
  const upcoming = phase === "upcoming";
  const closed = phase === "sold" || phase === "ended";
  const seconds = upcoming ? auction.startsIn : auction.remaining;
  const label = upcoming ? ui("startsIn") : ui("endsIn");
  return {
    closed,
    upcoming,
    seconds,
    parts: durationParts(seconds ?? 0),
    label,
    spoken: closed ? ui(phase === "sold" ? "sold" : "ended") : t(C.timeLeftSpoken, { label, time: spokenDuration(seconds, lang) }),
    tone: phase === "critical" ? "critical" : phase === "urgent" ? "urgent" : "default",
    extended: auction.extended,
  };
}

/** Status label for a phase ("Open for bids", "Ending soon", "Closing now", …). */
export function usePhaseLabel(phase) {
  const { t, ui } = useLang();
  const labels = {
    live: t(C.phaseLive),
    urgent: ui("endingSoon"),
    critical: ui("closingNow"),
    upcoming: ui("upcoming"),
    ended: ui("ended"),
    sold: ui("sold"),
  };
  return labels[phase] || labels.live;
}

// ── Bid form ───────────────────────────────────────────────────────────────
/**
 * Bid amount with −/+ steps of one increment, quick bids and validation.
 * A valid amount goes to `onRequest(amount)` (the confirm step). Rival bids
 * raise the minimum; the field follows unless the bidder typed more.
 */
export function useBidForm(auction, onRequest, { disabled = false } = {}) {
  const { t, ui, money } = useLang();
  const id = useId();
  const { minNext, increment, quickBids } = auction;
  const [amount, setAmount] = useState(String(minNext));
  const [touched, setTouched] = useState(false);
  const [seenMin, setSeenMin] = useState(minNext);
  const [error, setError] = useState("");

  if (minNext !== seenMin) {
    setSeenMin(minNext);
    if (!touched || Number(amount) < minNext) setAmount(String(minNext));
  }

  const value = Number(amount) || 0;

  const step = (dir) => {
    setAmount(String(Math.max(minNext, value + dir * increment)));
    setTouched(true);
    setError("");
  };

  const submit = (bid = value) => {
    if (!bid) return setError(ui("bidRequired"));
    if (bid < minNext) return setError(ui("bidTooLow", { amount: money(minNext) }));
    setError("");
    onRequest(bid);
  };

  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  return {
    id,
    hintId,
    errorId,
    amount,
    value,
    error,
    minNext,
    increment,
    quickBids,
    disabled,
    valid: !disabled && value >= minNext,
    canLower: !disabled && value > minNext,
    lower: () => step(-1),
    raise: () => step(1),
    lowerLabel: t(C.lowerBid, { amount: money(increment) }),
    raiseLabel: t(C.raiseBid, { amount: money(increment) }),
    quickLabel: (bid) => ui("bidAmount", { amount: money(bid) }),
    quick: (bid) => {
      setAmount(String(bid));
      setTouched(true);
      submit(bid);
    },
    submit: () => submit(),
    inputProps: {
      id,
      type: "number",
      inputMode: "numeric",
      min: minNext,
      step: increment,
      value: amount,
      disabled,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${hintId} ${errorId}` : hintId,
      onChange: (event) => {
        setAmount(event.target.value);
        setTouched(true);
        if (error) setError("");
      },
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        }
      },
    },
  };
}

/** The proxy bid: we bid for you, one increment at a time, up to your maximum. */
export function useMaxBid(auction) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    const result = auction.setMaxBid(Number(value));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setValue("");
  };

  return {
    panelId: `${id}-panel`,
    inputId: `${id}-input`,
    errorId: `${id}-error`,
    open,
    toggle: () => setOpen((v) => !v),
    value,
    error,
    myMax: auction.myMax,
    clear: auction.clearMaxBid,
    save,
    placeholder: String(auction.minNext + auction.increment * 5),
    inputProps: {
      id: `${id}-input`,
      type: "number",
      inputMode: "numeric",
      value,
      placeholder: String(auction.minNext + auction.increment * 5),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
      onChange: (event) => {
        setValue(event.target.value);
        if (error) setError("");
      },
      onKeyDown: (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          save();
        }
      },
    },
  };
}

// ── Bidder status ──────────────────────────────────────────────────────────
/**
 * What the bidder should know now: highest / outbid while live, won / lost /
 * sold when the auction closes, bought after Buy Now. `spoken` feeds a polite
 * live region; `kind` is null when there is nothing to say.
 */
export function useBidderStatus(detail) {
  const { t, ui, money } = useLang();
  const { auction, product, bought } = detail;
  const { bidderState, phase } = auction;
  let status = null;
  if (bought) status = { kind: "bought", title: t(C.boughtBanner), label: ui("buyNow"), amount: product.buyNowPrice };
  else if (phase === "sold") status = { kind: "closed", title: ui("auctionEnded"), label: ui("soldFor"), amount: auction.currentBid };
  else if (bidderState === "won") status = { kind: "won", title: ui("youWon"), label: ui("winningBid"), amount: auction.currentBid };
  else if (bidderState === "lost") status = { kind: "lost", title: t(C.lostBanner), label: ui("winningBid"), amount: auction.currentBid };
  else if (phase === "ended") status = { kind: "closed", title: ui("auctionEnded"), label: auction.bidCount ? ui("winningBid") : null, amount: auction.currentBid };
  else if (bidderState === "highest") status = { kind: "highest", title: ui("youAreWinning"), label: auction.myMax ? ui("yourMaxBid") : null, amount: auction.myMax };
  else if (bidderState === "outbid") status = { kind: "outbid", title: ui("youAreOutbid"), label: ui("nextMinBid"), amount: auction.minNext };
  const spoken = status ? `${status.title}${status.label ? `. ${status.label} ${money(status.amount)}` : ""}` : "";
  return { ...(status || { kind: null }), spoken };
}

/** The winning row of a closed auction's history (a sample bidder, or you). */
export function useWinner(detail) {
  const { t, ui } = useLang();
  const { auction, bought } = detail;
  if (bought || (auction.phase !== "sold" && auction.phase !== "ended")) return null;
  const top = auction.history.find((row) => row.isWinning) || auction.history[0];
  if (!top) return null;
  return { label: t(C.winningBidder), name: top.isOwn ? ui("you") : t(top.label), isOwn: top.isOwn };
}

// ── Bid history ────────────────────────────────────────────────────────────
/** Five rows a page with a "1–5 of 10" range and previous / next. */
export function useHistoryPages(rows, perPage = 5) {
  const { t } = useLang();
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(rows.length / perPage));
  const current = Math.min(page, pageCount);
  const from = rows.length ? (current - 1) * perPage + 1 : 0;
  const to = Math.min(rows.length, current * perPage);
  return {
    rows: rows.slice((current - 1) * perPage, current * perPage),
    total: rows.length,
    page: current,
    pageCount,
    range: t(C.showingRange, { from, to, total: rows.length }),
    hasPrev: current > 1,
    hasNext: current < pageCount,
    prev: () => setPage(current - 1),
    next: () => setPage(current + 1),
  };
}

/** Bidder name and relative time for history rows; the times tick with the page clock. */
export function useBidRow() {
  const { t, ui, lang } = useLang();
  const elapsed = useElapsed();
  return useCallback(
    (row) => ({
      name: row.isOwn ? ui("you") : t(row.label),
      ago: formatAgo(bidAge(row, elapsed), lang),
      auto: row.type === "proxy_auto",
    }),
    [t, ui, lang, elapsed],
  );
}

// ── Phone bid bar ──────────────────────────────────────────────────────────

/** Space between the top of the phone bid bar and the lowest toast. */
const TOAST_GAP = 12;

/**
 * Keeps toasts clear of the fixed phone bid bar. Returns a ref for the bar's
 * outer element; while that element is shown, the page root gets
 * --kz-toast-bottom (the bar's height above the bottom of the screen, safe
 * area included, plus a gap), which the shared Toaster uses as its bottom
 * offset on phones. Measured, so each option's bar height counts; removed
 * when the bar is hidden (tablets and up) or the page goes away, so other
 * pages keep the default placement.
 */
export function useToastClearance() {
  const ref = useRef(null);
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return undefined;
    const root = document.documentElement;
    const update = () => {
      const rect = bar.getBoundingClientRect();
      if (rect.height > 0) root.style.setProperty("--kz-toast-bottom", `${Math.ceil(window.innerHeight - rect.top + TOAST_GAP)}px`);
      else root.style.removeProperty("--kz-toast-bottom");
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      root.style.removeProperty("--kz-toast-bottom");
    };
  }, []);
  return ref;
}

// ── Sharing, tabs, zoom ────────────────────────────────────────────────────
/** Copies the page address and confirms it (the toast confirms even if the clipboard is blocked). */
export function useShareLink() {
  const { ui } = useLang();
  const { toast } = useStore();
  return useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // Clipboard can be blocked (permissions, insecure context).
    }
    toast({ tone: "success", title: ui("linkCopied") });
  }, [toast, ui]);
}

/**
 * Accessible tabs: arrow keys (mirrored in Arabic), Home and End move
 * between tabs and select them; only the selected tab is in the Tab order.
 */
export function useTabs(keys) {
  const { isRTL } = useLang();
  const base = useId();
  const [active, setActive] = useState(keys[0]);
  const tabId = (key) => `${base}-tab-${key}`;
  const panelId = (key) => `${base}-panel-${key}`;
  const select = (key) => {
    setActive(key);
    document.getElementById(tabId(key))?.focus();
  };
  const onKeyDown = (event) => {
    const i = keys.indexOf(active);
    const forward = isRTL ? "ArrowLeft" : "ArrowRight";
    const back = isRTL ? "ArrowRight" : "ArrowLeft";
    let next = null;
    if (event.key === forward) next = keys[(i + 1) % keys.length];
    else if (event.key === back) next = keys[(i - 1 + keys.length) % keys.length];
    else if (event.key === "Home") next = keys[0];
    else if (event.key === "End") next = keys[keys.length - 1];
    if (next == null) return;
    event.preventDefault();
    select(next);
  };
  return {
    active,
    tabProps: (key) => ({
      id: tabId(key),
      role: "tab",
      type: "button",
      "aria-selected": active === key,
      "aria-controls": panelId(key),
      tabIndex: active === key ? 0 : -1,
      onClick: () => setActive(key),
      onKeyDown,
    }),
    panelProps: (key) => ({ id: panelId(key), role: "tabpanel", "aria-labelledby": tabId(key), hidden: active !== key, tabIndex: 0 }),
  };
}

/** 2× zoom under the pointer for fine pointers (mouse, trackpad); off for touch. */
export function useHoverZoom(enabled = true) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [origin, setOrigin] = useState(null);
  const on = enabled && canHover;
  const handlers = useMemo(
    () => ({
      onMouseMove: (event) => {
        if (!on) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOrigin({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
      },
      onMouseLeave: () => setOrigin(null),
    }),
    [on],
  );
  return { style: on && origin ? { transform: "scale(2)", transformOrigin: `${origin.x}% ${origin.y}%` } : undefined, handlers, reset: () => setOrigin(null) };
}
