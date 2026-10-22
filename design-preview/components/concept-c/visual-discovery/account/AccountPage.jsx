"use client";

// Option 3 — Buyer account (production /account, account specs A and B).
// One customer workspace: a navy "Buyer Account Hub" heading with the four
// production figures and actions, then the nine sections — a sticky white
// list beside the content from 1024 px, a swipeable row of section pills
// above it on phones and tablets. Each section keeps production's data,
// rules, wording and states; the section's own card follows the cart and
// seller pages (white rounded panels, blue-grey tiles, ivory empty panels,
// pill buttons, status pills with words and an icon).
//
// Production behaviour kept: ?tab= with its aliases (deposits → wallet,
// bids → watchlist; anything else → overview), switching sections replaces
// the URL (no history entries) and keeps other parameters; figures and
// badges come only from data loaded in this visit (spec A §3.5 — a direct
// visit to a later section shows 0 until Overview or Orders has loaded);
// the alert bar's precedence; the suspension banner and appeal (production
// can never show it — quirk Q33 — so the preview states show the design).
// Sign-in guard: a signed-out visitor goes to sign in with no next, so after
// signing in the buyer lands on the home page (production — quirk Q4).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CreditCard, FileText, Heart, House, RefreshCw, Settings, TriangleAlert, Trophy, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { Money } from "@/components/shared/ui/Money";
import {
  ADDRESSES,
  APPEAL,
  DISPUTES,
  INVOICES,
  MY_BIDS,
  NOTIFICATIONS_PAGE_1,
  NOTIFICATIONS_PAGE_2,
  ORDERS_PAGE_1,
  ORDERS_PAGE_2,
  PAYMENT_RECORDS,
  PROFILE,
  SAVED_METHODS,
  SUSPENSION,
  TRANSACTIONS,
  WALLET,
  withDetail,
} from "@/data/accountSamples";
import { getProduct } from "@/lib/catalog";
import { Breadcrumbs, IconDisk, Notice, Panel, Placeholder, Spinner } from "../kit/Blocks";
import { VDPage } from "../kit/Page";
import { useSession } from "../kit/session";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { AccountContext, Avatar, Ltr, num, useAccount, usePlural, wait } from "./parts";
import { CLOSED_LOT, DISPUTE_CLOSED, isPaid, isPendingPayment } from "./status";
import { AppealBanner } from "./Appeal";
import { Overview } from "./Overview";
import { Watchlist, AuctionDrawer } from "./Watchlist";
import { Won, PayNowPanel } from "./Won";
import { Orders, OrderDrawer } from "./Orders";
import { WalletTab } from "./WalletTab";
import { Payments } from "./Payments";
import { Disputes, DisputeModal } from "./Disputes";
import { Notifications } from "./Notifications";
import { Profile } from "./Profile";

export const TAB_IDS = ["overview", "watchlist", "won", "orders", "wallet", "payments", "disputes", "notifications", "profile"];
const ALIAS = { deposits: "wallet", bids: "watchlist" };
const ICONS = { overview: House, watchlist: Heart, won: Trophy, orders: FileText, wallet: Wallet, payments: CreditCard, disputes: TriangleAlert, notifications: Bell, profile: Settings };

/** Production's ?tab= rule: exact ids, two aliases, everything else → overview. */
export function tabOf(value) {
  const id = ALIAS[value] || value;
  return TAB_IDS.includes(id) ? id : "overview";
}

// Sections whose data production loads before showing them (the skeleton
// tabs), and the data each section loads (spec A §3, B §0.6).
const PRIMARY = new Set(["overview", "won", "orders", "wallet", "payments"]);
const SOURCES = {
  overview: ["orders", "invoices", "wallet", "addresses", "bids", "watchlist"],
  won: ["orders", "invoices", "addresses"],
  orders: ["orders", "invoices", "addresses", "payments", "fulfillments"],
  wallet: ["wallet", "transactions", "methods", "payments"],
  payments: ["invoices", "payments", "methods"],
  watchlist: ["bids", "watchlist"],
  disputes: ["disputes"],
  notifications: ["notifications"],
  profile: ["addresses"],
};
// The requests production counts in its (never shown) load-error message.
const FAILING = { overview: 4, won: 3, orders: 3, wallet: 1, payments: 2, watchlist: 2, disputes: 1, profile: 1 };

const unreadOf = (list) => list.filter((item) => item.status === "unread" || !item.read_at).length;

// A one-page sample invoice, so "Download invoice" saves a real PDF file.
function invoicePdf(invoice) {
  const text = `Khaznah design preview - sample invoice ${invoice.invoice_number || invoice.id}`;
  const stream = `BT /F1 14 Tf 56 760 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((object, i) => {
    offsets.push(body.length);
    body += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([body], { type: "application/pdf" });
}

/** The account's data and actions for one preview state (see lib/previewStates.js). */
function useAccountStore(state, tab) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { watched } = useStore();
  const empty = state === "empty";
  const failing = state === "error";
  const fresh = (rows) => (empty || failing ? [] : rows);

  const [orders, setOrders] = useState(() => fresh(ORDERS_PAGE_1));
  const [ordersMore, setOrdersMore] = useState(!empty && !failing);
  const [invoices] = useState(() => fresh(INVOICES));
  const [wallet, setWallet] = useState(() => (failing ? null : { ...WALLET, balance: empty ? "0.00" : WALLET.balance }));
  const [transactions, setTransactions] = useState(() => fresh(TRANSACTIONS));
  const [methods, setMethods] = useState(() => fresh(SAVED_METHODS));
  const [payments] = useState(() => fresh(PAYMENT_RECORDS));
  const [disputes, setDisputes] = useState(() => fresh(DISPUTES));
  const [notifications, setNotifications] = useState(() => fresh(NOTIFICATIONS_PAGE_1));
  const [notesMore, setNotesMore] = useState(!empty && !failing);
  const [unread, setUnread] = useState(() => (empty ? 0 : unreadOf([...NOTIFICATIONS_PAGE_1, ...NOTIFICATIONS_PAGE_2])));
  const [addresses, setAddresses] = useState(() => fresh(ADDRESSES));
  const [profile, setProfile] = useState(() => ({ ...PROFILE }));
  const [bids, setBids] = useState(() => fresh(MY_BIDS));
  const [prices, setPrices] = useState({});
  const [appeals, setAppeals] = useState(() => (state === "appeal" ? [APPEAL] : []));
  const suspension = state === "suspended" || state === "appeal" ? SUSPENSION : null;

  // What this visit has loaded (production keeps it across section changes).
  const [loaded, setLoaded] = useState(() => new Set(SOURCES[tab]));
  const [loadedFor, setLoadedFor] = useState(tab);
  if (loadedFor !== tab) {
    setLoadedFor(tab);
    if (!SOURCES[tab].every((source) => loaded.has(source))) setLoaded(new Set([...loaded, ...SOURCES[tab]]));
  }
  const has = (source) => loaded.has(source);

  const [refreshing, setRefreshing] = useState(false);
  const [action, setAction] = useState(null);
  const [walletAction, setWalletAction] = useState({ message: null, loading: false });
  const [busy, setBusy] = useState({});
  const mark = (key, value) => setBusy((current) => ({ ...current, [key]: value }));
  const [tracking, setTracking] = useState(null);
  const [orderPanel, setOrderPanel] = useState(null);
  const [lotPanel, setLotPanel] = useState(null);
  const [payNow, setPayNow] = useState(null);
  const [disputeOpen, setDisputeOpen] = useState(false);

  /** Production's page-level message (spec A §4.7), remembered with its section. */
  const say = useCallback((text) => setAction(text ? { text, tab } : null), [tab]);

  const refresh = async () => {
    setRefreshing(true);
    await wait(450);
    // A refresh re-reads page 1: pages added by "Load 8 more" are dropped.
    setOrders((current) => current.filter((o) => ORDERS_PAGE_1.some((p) => p.id === o.id) || !ORDERS_PAGE_2.some((p) => p.id === o.id)));
    if (!empty && !failing) setOrdersMore(true);
    setNotifications((current) => current.filter((n) => !NOTIFICATIONS_PAGE_2.some((p) => p.id === n.id)));
    if (!empty && !failing) setNotesMore(true);
    setRefreshing(false);
  };

  const go = (path) => router.push(link(path));

  const payOrder = async (order, addressId) => {
    mark(`pay-${order.id}`, true);
    setAction(null);
    await wait(700);
    mark(`pay-${order.id}`, false);
    // Paying from Orders sends no address: a win without one is refused (quirk Q8).
    if (!addressId && order.order_type === "auction_win" && order.needsAddress) {
      say(C.addressWindowClosed);
      return;
    }
    say(C.msgPaymentGateway);
    go("/payment/moyasar/9051");
  };

  const payGroup = async (ref) => {
    mark(`group-${ref}`, true);
    await wait(800);
    mark(`group-${ref}`, false);
    say(C.msgGroupCreated);
    go("/payment/moyasar/9051");
  };

  const downloadInvoice = async (invoice) => {
    mark(`invoice-${invoice.id}`, true);
    setAction(null);
    await wait(700);
    const url = URL.createObjectURL(invoicePdf(invoice));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${invoice.invoice_number || `invoice-${invoice.id}`}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    mark(`invoice-${invoice.id}`, false);
    say(C.msgInvoiceDone);
  };

  const openOrder = async (order) => {
    setOrderPanel({ order, detail: null, loading: true, error: false });
    await wait(450);
    setOrderPanel((current) => (current && current.order.id === order.id ? { order, detail: failing ? null : withDetail(order), loading: false, error: failing } : current));
  };

  const trackOrder = async (order) => {
    mark(`track-${order.id}`, true);
    setAction(null);
    await wait(600);
    setTracking({ order, fulfillments: order.fulfillments });
    mark(`track-${order.id}`, false);
    openOrder(order);
  };

  const loadMoreOrders = async () => {
    mark("more", true);
    await wait(600);
    setOrders((current) => [...current, ...ORDERS_PAGE_2.filter((o) => !current.some((c) => c.id === o.id))]);
    setOrdersMore(false);
    mark("more", false);
  };

  // Watchlist rows (spec A §6.1): lots you bid on (the server watches them
  // with source "bid") then your saved lots; closed lots are only counted.
  const watchRows = useMemo(() => {
    const rows = [];
    const seen = new Set();
    let unavailable = 0;
    for (const bid of bids) {
      const product = getProduct(bid.lot);
      if (!product || CLOSED_LOT.has(product.status)) continue;
      seen.add(product.slug);
      rows.push({ id: `bid-${product.id}`, source: "bid", is_winning: bid.is_winning, amount: bid.amount, product });
    }
    for (const slug of empty || failing ? [] : watched) {
      const product = getProduct(slug);
      if (!product) continue;
      if (CLOSED_LOT.has(product.status)) {
        unavailable += 1;
        continue;
      }
      if (seen.has(product.slug)) continue;
      seen.add(product.slug);
      rows.push({ id: `watch-${product.id}`, source: "manual", product });
    }
    return { rows, unavailable, all: rows.length + unavailable };
  }, [bids, watched, empty, failing]);

  const currentPrice = (product) => prices[product.slug] ?? (product.currentBid || product.buyNowPrice || product.price || 0);

  const quickBid = async (product, amount) => {
    await wait(500);
    setBids((current) => {
      const others = current.filter((bid) => bid.lot !== product.slug);
      return [{ id: Date.now(), lot: product.slug, amount, is_winning: true }, ...others];
    });
    setPrices((current) => ({ ...current, [product.slug]: amount }));
  };

  const openLot = async (row) => {
    setLotPanel({ row, loading: true, error: false });
    await wait(450);
    setLotPanel((current) => (current && current.row.id === row.id ? { row, loading: false, error: failing } : current));
  };

  // Wallet (spec B §1).
  const topUp = async (raw) => {
    const value = String(raw ?? "").trim();
    setWalletAction({ message: null, loading: true });
    await wait(500);
    let error = null;
    if (!/^\d+(\.\d+)?$/.test(value)) error = C.amountInvalid;
    else if (/\.\d{3,}$/.test(value)) error = C.amountDecimals;
    else if (Number(value) < 10) error = C.amountMin;
    if (error) {
      setWalletAction({ message: error, loading: false });
      return;
    }
    setWalletAction({ message: C.msgTopUp, loading: false });
    await wait(900);
    go("/payment/moyasar/9051");
  };

  const methodAction = async (kind, method) => {
    setWalletAction({ message: null, loading: true });
    await wait(450);
    if (kind === "remove") setMethods((current) => current.filter((m) => m.id !== method.id));
    if (kind === "default") setMethods((current) => current.map((m) => ({ ...m, is_default: m.id === method.id })));
    if (kind === "auto") setMethods((current) => current.map((m) => (m.id === method.id ? { ...m, consent_for_auto_charge: !m.consent_for_auto_charge } : m)));
    setWalletAction({ message: kind === "remove" ? C.msgMethodRemoved : C.msgMethodUpdated, loading: false });
  };

  const retryWallet = async () => {
    await wait(400);
    if (!failing) setWallet((current) => current ?? { ...WALLET });
  };

  // Disputes (spec B §3).
  const createDispute = async ({ order, type, reason, files }) => {
    for (const file of files) {
      await wait(250);
      if (file.size > 25 * 1024 * 1024) throw C.fileTooLarge;
      if (file.type.startsWith("image/") && !/^image\/(jpeg|png|gif|webp)$/.test(file.type)) throw C.fileNotImage;
    }
    await wait(400);
    if (files.length > 12) throw C.tooManyFiles;
    setDisputes((current) => [{ id: Math.max(130, ...current.map((d) => d.id)) + 1, order: order.id, order_number: order.order_number, status: "open", dispute_type: type, reason, updated_at: new Date().toISOString() }, ...current]);
    say(C.msgDisputeSubmitted);
  };

  const cancelDispute = async (dispute) => {
    await wait(450);
    setDisputes((current) => current.map((d) => (d.id === dispute.id ? { ...d, status: "cancelled", updated_at: new Date().toISOString() } : d)));
    say(C.msgDisputeCancelled);
  };

  // Notifications (spec B §4).
  const markRead = async (item) => {
    await wait(250);
    setNotifications((current) => current.map((n) => (n.id === item.id ? { ...n, status: "read", read_at: n.read_at || new Date().toISOString() } : n)));
    setUnread((count) => Math.max(0, count - 1));
  };
  const markAllRead = async () => {
    await wait(350);
    setNotifications((current) => current.map((n) => ({ ...n, status: "read", read_at: n.read_at || new Date().toISOString() })));
    setUnread(0);
  };
  const loadMoreNotes = async () => {
    await wait(600);
    setNotifications((current) => [...current, ...NOTIFICATIONS_PAGE_2.filter((n) => !current.some((c) => c.id === n.id))]);
    setNotesMore(false);
  };

  // Profile and addresses (spec B §5).
  const saveProfile = async (fields) => {
    await wait(400);
    setProfile((current) => ({ ...current, ...fields }));
    say(C.msgProfileSaved);
  };
  const uploadAvatar = async (file) => {
    await wait(900);
    setProfile((current) => ({ ...current, avatar: URL.createObjectURL(file) }));
    say(C.msgPhotoUpdated);
  };
  const createAddress = async (form) => {
    await wait(500);
    // The server requires a label (spec A Q37); the form does not say so.
    if (!String(form.label || "").trim()) {
      say(C.labelBlank);
      return null;
    }
    const created = { ...form, id: Math.max(30, ...addresses.map((a) => a.id)) + 1 };
    // A new default drops the old default from the list until reload (spec B §5.6).
    setAddresses((current) => [created, ...current.filter((row) => !form.is_default || !row.is_default)]);
    say(C.msgAddressSaved);
    return created;
  };
  const updateAddress = async (id, form) => {
    await wait(450);
    setAddresses((current) => current.map((row) => (row.id === id ? { ...row, ...form } : form.is_default ? { ...row, is_default: false } : row)));
    say(C.msgAddressUpdated);
  };
  const deleteAddress = async (id) => {
    await wait(400);
    setAddresses((current) => current.filter((row) => row.id !== id));
    say(C.msgAddressRemoved);
  };

  const submitAppeal = async (reason) => {
    await wait(700);
    setAppeals([{ id: 9, status: "pending", reason, resolution_note: null }]);
    refresh();
  };

  // An order changed by Pay now (delivery price, coupon, wallet): a field
  // object or a function of the order.
  const updateOrder = (orderId, change) => setOrders((current) => current.map((o) => (o.id === orderId ? (typeof change === "function" ? change(o) : { ...o, ...change }) : o)));

  // Figures the shell shows (spec A §4.1, §4.2): only loaded data counts.
  const loadedOrders = has("orders") ? orders : [];
  const counts = {
    orders: loadedOrders.length,
    paid: loadedOrders.filter(isPaid).length,
    pending: loadedOrders.filter(isPendingPayment).length,
    won: loadedOrders.filter((o) => o.order_type === "auction_win").length,
    watchlist: has("watchlist") ? watchRows.rows.length : 0,
    disputes: has("disputes") ? disputes.filter((d) => !DISPUTE_CLOSED.has(d.status)).length : 0,
    notifications: unread,
  };

  return {
    state,
    tab,
    empty,
    failing,
    has,
    counts,
    refreshing,
    refresh,
    action,
    say,
    busy,
    orders,
    ordersMore,
    loadMoreOrders,
    invoices: has("invoices") ? invoices : [],
    invoiceFor: (order) => invoices.find((row) => row.order === order.id) || null,
    wallet: has("wallet") ? wallet : null,
    walletRaw: wallet,
    walletAction,
    setWallet,
    topUp,
    methodAction,
    retryWallet,
    transactions,
    setTransactions,
    methods,
    payments,
    disputes,
    createDispute,
    cancelDispute,
    disputeOpen,
    setDisputeOpen,
    notifications,
    notesMore,
    loadMoreNotes,
    markRead,
    markAllRead,
    unread,
    addresses: has("addresses") ? addresses : [],
    createAddress,
    updateAddress,
    deleteAddress,
    profile,
    saveProfile,
    uploadAvatar,
    setProfile,
    watchRows,
    currentPrice,
    quickBid,
    bids,
    openLot,
    lotPanel,
    setLotPanel,
    openOrder,
    orderPanel,
    setOrderPanel,
    tracking,
    trackOrder,
    payOrder,
    payGroup,
    downloadInvoice,
    payNow,
    setPayNow,
    updateOrder,
    suspension,
    appeals,
    submitAppeal,
    t,
  };
}

/** Production's loading skeleton (spec A §4.6): four tiles and four blocks. */
export function AccountLoading() {
  const { t } = useLang();
  return (
    <div role="status" aria-label={t(C.loading)} data-testid="account-loading" className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 dt:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Placeholder key={i} className="h-28 !rounded-[20px]" />
        ))}
      </div>
      <div className="grid gap-4 dt:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Placeholder key={i} className="h-48 !rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}


function Hero({ onTab }) {
  const { t } = useLang();
  const acc = useAccount();
  const pc = usePlural();
  const name = t(acc.profile.full_name) || t(C.buyer);
  const stats = [
    { key: "orders", label: C.statOrders, value: acc.counts.orders },
    { key: "paid", label: C.statPaid, value: acc.counts.paid },
    { key: "wallet", label: C.statWallet, value: <Money value={num(acc.wallet?.balance)} symbolClassName="text-[0.75em]" /> },
    { key: "account", label: C.statAccount, value: <bdi dir="auto">{name}</bdi>, title: name },
  ];
  return (
    <section aria-labelledby="account-title" className="relative overflow-hidden rounded-[24px] bg-[var(--vd-navy)] px-5 py-7 text-white sm:px-8 sm:py-8 dt:px-10 dt:py-10" data-testid="account-hero">
      <span aria-hidden="true" className="absolute -end-20 -top-24 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(225_169_50/0.26),transparent)]" />
      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-end">
        <div className="min-w-0">
          <h1 id="account-title" className="vd-page-title text-white">
            {t(C.heroLead)}
            <span className="text-[var(--vd-gold)]">{t(C.heroAccent)}</span>
          </h1>
          <p className="mt-2 max-w-xl vd-lg text-white/80 max-sm:hidden">{t(C.heroText)}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <button type="button" onClick={() => onTab("orders")} className={btn("gold", "lg")} data-testid="hero-orders">
              {acc.counts.pending > 0 ? pc("heroPay", acc.counts.pending) : t(C.viewOrdersCta)}
            </button>
            <button type="button" onClick={() => onTab("wallet")} className={btn("white", "lg")}>
              <Wallet aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {t(C.openWalletCta)}
            </button>
            <button
              type="button"
              onClick={acc.refresh}
              disabled={acc.refreshing}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 vd-md font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              data-testid="account-refresh"
            >
              <RefreshCw aria-hidden="true" className={cx("size-4", acc.refreshing && "animate-spin motion-reduce:animate-none")} strokeWidth={2.2} />
              {t(C.refresh)}
            </button>
          </div>
        </div>
        <dl aria-label={t(C.stats)} className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.key} className="min-w-0 rounded-[18px] bg-white/[0.08] px-4 py-3" data-testid={`stat-${stat.key}`}>
              <dt className="vd-xs font-semibold text-white/75">{t(stat.label)}</dt>
              <dd className="mt-0.5 truncate vd-h3 !text-[22px] !leading-8 text-white tabular" title={stat.title}>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** One section link: an anchor to ?tab= that switches in place (replaceState). */
function SectionLink({ id, active, count, onTab, layout }) {
  const { t } = useLang();
  const { link } = useConcept();
  const Icon = ICONS[id];
  const current = id === active;
  const label = t(C.tabs[id]);
  const badge = count > 0 ? (
    <span className={cx("grid h-6 min-w-6 place-items-center rounded-full px-1.5 vd-xs font-bold tabular", current ? "bg-white text-[var(--vd-indigo)]" : "bg-[var(--vd-gold)] text-[var(--vd-ink)]")} data-testid={`badge-${id}`}>
      {count}
    </span>
  ) : null;
  return (
    <a
      href={link(`/account?tab=${id}`)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onTab(id);
      }}
      aria-current={current ? "page" : undefined}
      data-testid={`tab-${id}`}
      className={cx(
        "flex items-center gap-3 rounded-full transition-colors",
        layout === "rail" ? "h-11 shrink-0 border px-4 vd-md" : "h-11 px-3 vd-md",
        current
          ? "border-[var(--vd-indigo)] bg-[var(--vd-indigo)] font-semibold text-white"
          : layout === "rail"
            ? "border-[var(--vd-line)] bg-white text-[var(--vd-ink)] hover:border-[#b6c6df]"
            : "text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]",
      )}
    >
      <Icon aria-hidden="true" className={cx("size-[18px] shrink-0", current ? "text-white" : "text-[var(--vd-indigo)]")} strokeWidth={2} />
      <span className={layout === "rail" ? "whitespace-nowrap" : "min-w-0 flex-1 truncate"}>{label}</span>
      {badge}
    </a>
  );
}

function Sidebar({ tab, onTab }) {
  const { t } = useLang();
  const acc = useAccount();
  const name = t(acc.profile.full_name) || t(C.buyer);
  const email = acc.profile.user_email || t(C.statAccount);
  return (
    <nav aria-label={t(C.nav)} className="hidden lg:block">
      <Panel className="sticky top-[calc(var(--pbar-h)+20px)] !p-3">
        <div className="flex items-center gap-3 border-b border-[var(--vd-line)] px-2 pb-4 pt-2">
          <Avatar profile={acc.profile} />
          <div className="min-w-0">
            <p className="line-clamp-2 vd-md font-bold text-[var(--vd-ink)]">
              <bdi dir="auto">{name}</bdi>
            </p>
            {/* Production says "Verified buyer" whatever the email status (quirk Q34). */}
            <p className="truncate vd-xs text-[var(--vd-muted)]" title={email}>
              {t(C.verifiedBuyer)}
              <Ltr>{email}</Ltr>
            </p>
          </div>
        </div>
        <ul className="mt-2 grid gap-0.5">
          {TAB_IDS.map((id) => (
            <li key={id}>
              <SectionLink id={id} active={tab} count={acc.counts[id] ?? 0} onTab={onTab} layout="list" />
            </li>
          ))}
        </ul>
      </Panel>
    </nav>
  );
}

/** Phones and tablets: the sections as a swipeable pill row, the current one kept in view. */
function Rail({ tab, onTab }) {
  const { t } = useLang();
  const acc = useAccount();
  const rail = useRef(null);
  useEffect(() => {
    const list = rail.current;
    const pill = list?.querySelector('[aria-current="page"]');
    if (!pill) return;
    const box = list.getBoundingClientRect();
    const at = pill.getBoundingClientRect();
    if (at.left < box.left + 16) list.scrollLeft -= box.left + 16 - at.left;
    else if (at.right > box.right - 16) list.scrollLeft += at.right - (box.right - 16);
  }, [tab]);
  return (
    <nav aria-label={t(C.nav)} className="-mx-[var(--vd-gutter)] lg:hidden">
      <ul ref={rail} className="vd-rail flex gap-2 overflow-x-auto px-[var(--vd-gutter)] pb-1">
        {TAB_IDS.map((id) => (
          <li key={id} className="shrink-0">
            <SectionLink id={id} active={tab} count={acc.counts[id] ?? 0} onTab={onTab} layout="rail" />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TabHeader({ tab }) {
  const { t } = useLang();
  return (
    <Panel className="flex items-center gap-4 !py-4">
      <IconDisk icon={ICONS[tab]} />
      <div className="min-w-0 flex-1">
        <h2 className="vd-h3 !text-[20px] !leading-7 text-[var(--vd-ink)]" data-testid="tab-title">
          {t(C.tabs[tab])}
        </h2>
        <p className="vd-sm text-[var(--vd-muted)] max-sm:hidden">{t(C.tabText[tab] || C.tabText.overview)}</p>
      </div>
      <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-[var(--vd-bluegray)] px-3 vd-xs font-bold text-[var(--vd-ink)] max-sm:hidden">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--vd-grade-a)]" />
        {t(C.liveData)}
      </span>
    </Panel>
  );
}

/** Production's alert bar: dispute help on Disputes, else unpaid orders, else nothing. */
function AlertBar({ tab, onTab }) {
  const { t } = useLang();
  const acc = useAccount();
  const pc = usePlural();
  if (tab === "disputes") {
    return (
      <Notice
        tone="warning"
        icon={Bell}
        title={t(C.needHelp)}
        actions={
          <button type="button" onClick={() => acc.setDisputeOpen(true)} className={btn("gold", "md")} data-testid="alert-open-dispute">
            {t(C.openDispute)}
          </button>
        }
      >
        {t(C.needHelpText)}
      </Notice>
    );
  }
  if (acc.counts.pending <= 0) return null;
  return (
    <Notice
      tone="warning"
      icon={Bell}
      title={t(C.paymentRequired)}
      actions={
        tab === "orders" ? null : (
          <button type="button" onClick={() => onTab("orders")} className={btn("gold", "md")}>
            {t(C.viewOrdersCta)}
          </button>
        )
      }
    >
      {pc("alertPayment", acc.counts.pending)}
    </Notice>
  );
}

/** Production's action message (spec A §4.7), shown where it happened and, as in production, on Orders. */
function ActionMessage({ tab }) {
  const { t } = useLang();
  const acc = useAccount();
  if (!acc.action || (tab !== "orders" && tab !== acc.action.tab)) return null;
  return (
    <div role="status" className="rounded-[18px] border border-[#ecd49a] bg-[#fdf4e2] px-4 py-3 vd-md font-semibold text-[var(--vd-ink)]" data-testid="action-message">
      {t(acc.action.text)}
    </div>
  );
}

function LoadErrorNotice({ tab }) {
  const pc = usePlural();
  const acc = useAccount();
  if (!acc.failing || !FAILING[tab]) return null;
  return (
    <div data-testid="load-error">
      <Notice tone="warning" role="alert">
        {pc("loadError", FAILING[tab])}
      </Notice>
    </div>
  );
}

const TABS = { overview: Overview, watchlist: Watchlist, won: Won, orders: Orders, wallet: WalletTab, payments: Payments, disputes: Disputes, notifications: Notifications, profile: Profile };

function AccountView({ params, state }) {
  const { t } = useLang();
  const tab = tabOf(params.get("tab"));
  const acc = useAccountStore(state, tab);

  // Production's changeTab: replace ?tab= in place, keep the other parameters.
  const onTab = useCallback((next) => {
    const id = ALIAS[next] || next;
    if (!TAB_IDS.includes(id)) return;
    const search = new URLSearchParams(window.location.search);
    search.set("tab", id);
    window.history.replaceState(null, "", `${window.location.pathname}?${search.toString()}`);
  }, []);

  const Content = TABS[tab];
  const skeleton = state === "loading" ? tab !== "notifications" && tab !== "profile" : acc.refreshing && PRIMARY.has(tab);

  return (
    <AccountContext.Provider value={{ ...acc, onTab }}>
      <div className="vd-container pb-16 pt-6 dt:pb-20 dt:pt-8">
        <Breadcrumbs items={[{ label: t(C.crumb) }]} />
        <div className="mt-4 dt:mt-5">
          <Hero onTab={onTab} />
        </div>
        {acc.suspension ? (
          <div className="mt-5">
            <AppealBanner />
          </div>
        ) : null}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start dt:mt-6 dt:grid-cols-[280px_minmax(0,1fr)] dt:gap-6">
          <Sidebar tab={tab} onTab={onTab} />
          <Rail tab={tab} onTab={onTab} />
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4" data-testid="account-content" data-tab={tab}>
            <TabHeader tab={tab} />
            <AlertBar tab={tab} onTab={onTab} />
            <ActionMessage tab={tab} />
            <LoadErrorNotice tab={tab} />
            {skeleton ? <AccountLoading /> : <Content />}
          </div>
        </div>
      </div>
      <OrderDrawer />
      <AuctionDrawer />
      <PayNowPanel />
      <DisputeModal />
    </AccountContext.Provider>
  );
}

/** Signed out: off to sign in, with no way back to the section (production's guard, quirk Q4). */
function Guarded({ params, state }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { ready, signedIn } = useSession();
  useEffect(() => {
    if (!ready || signedIn) return;
    router.replace(link("/login"));
  }, [ready, signedIn, router, link]);
  if (!ready || !signedIn) {
    return (
      <div aria-busy="true" className="vd-container grid min-h-[50vh] place-items-center py-16" data-testid="account-guard">
        <Spinner label={t(C.loading)} />
      </div>
    );
  }
  return <AccountView key={state} params={params} state={state} />;
}

/** Option 3 — Buyer account (production /account). */
export function VisualDiscoveryAccount() {
  return (
    <VDPage>
      <StateRoute
        fallback={
          <div className="vd-container py-16">
            <AccountLoading />
          </div>
        }
      >
        {(params, state) => <Guarded params={params} state={state} />}
      </StateRoute>
    </VDPage>
  );
}

/** The legacy /account/watchlist: opens the Watchlist section in place (production replaces the URL). */
export function WatchlistRedirect() {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  useEffect(() => {
    router.replace(link("/account?tab=watchlist"));
  }, [router, link]);
  return (
    <VDPage>
      <div className="vd-container grid min-h-[50vh] place-items-center py-16" data-testid="watchlist-redirect">
        <p role="status" className="vd-md text-[var(--vd-muted)]">
          {t(C.openingWatchlist)}
        </p>
      </div>
    </VDPage>
  );
}

