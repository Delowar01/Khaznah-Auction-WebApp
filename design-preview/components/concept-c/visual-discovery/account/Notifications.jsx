"use client";

// Notifications (spec B §4): unread count, production's eight category
// filters (over the loaded items), refresh, "Mark all read" while unread
// items are loaded, then each notification — unread ones gold-edged — with
// its time, text, the bid figures for bidding alerts, its link (opening an
// unread one marks it read) and "Mark read"; 10 per page with "Load 10
// more" under All only. Links are used as the server sends them: order
// links point at /account/orders/{id}, a page production does not have
// (they reach the 404, as in production). The category pill shows the
// filter's label where production prints the raw value.
import Link from "next/link";
import { useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { Notice, Panel, PanelHead, Placeholder } from "../kit/Blocks";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Ltr, num, useAccount, useDates } from "./parts";

const FILTERS = ["all", "bidding", "payment", "order", "fulfillment", "dispute", "account", "system"];
// Production's category colours (fulfilment and account use the system amber).
const TINT = {
  bidding: "bg-[#e3ecfb] text-[var(--vd-indigo)]",
  payment: "bg-[#ddf4e6] text-[var(--vd-grade-a)]",
  order: "bg-[#efe7fb] text-[#5b2a9c]",
  dispute: "bg-[#fde3e1] text-[#a61b18]",
  system: "bg-[#fdf1d8] text-[#7a4e0c]",
};
const categoryOf = (item) => String(item.category || "system").toLowerCase();
const isUnread = (item) => item.status === "unread" || !item.read_at;

function bidDetails(item) {
  const payload = item.payload ?? item.extra_data;
  if (!payload) return null;
  const bid = payload.bid || payload.bid_details || payload;
  const details = {
    amount: bid.amount ?? payload.amount ?? payload.bid_amount,
    current: bid.current_bid ?? payload.current_bid,
    next: bid.next_valid_bid ?? payload.next_valid_bid,
    status: bid.status ?? payload.bid_status ?? (payload.is_winning ? "winning" : ""),
  };
  return Object.values(details).some((value) => value !== undefined && value !== null && value !== "") ? details : null;
}

function NotificationItem({ item }) {
  const { t } = useLang();
  const { link } = useConcept();
  const acc = useAccount();
  const { dateTime } = useDates();
  const category = categoryOf(item);
  const unread = isUnread(item);
  const details = category === "bidding" ? bidDetails(item) : null;
  const statusLabel = details?.status ? C.bidStatus[String(details.status).toLowerCase()] || details.status : null;
  const pair = (label, value) =>
    value === undefined || value === null || value === "" ? null : (
      <span className="whitespace-nowrap">
        {t(label)}: <Money value={num(value)} className="font-bold text-[var(--vd-ink)]" />
      </span>
    );
  return (
    <article className={cx("flex gap-3 rounded-[18px] border p-4", unread ? "border-[#e6c37a] bg-[#fffaf0]" : "border-[var(--vd-line)] bg-white")} data-testid="notification" data-unread={unread || undefined}>
      <span aria-hidden="true" className={cx("grid size-9 shrink-0 place-items-center rounded-[12px]", TINT[category] || TINT.system)}>
        <Bell className="size-4" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h4 className="min-w-0 vd-md font-bold text-[var(--vd-ink)]">
            {unread ? <span className="sr-only">{t(C.unread)}: </span> : null}
            <bdi dir="auto">{t(item.title) || t(C.notification)}</bdi>
          </h4>
          <time dateTime={item.created_at} className="vd-xs text-[var(--vd-muted)]">
            <Ltr>{dateTime(item.created_at, true)}</Ltr>
          </time>
        </div>
        {item.body ? <p className="mt-1 vd-sm text-[var(--vd-ink)]/80">{t(item.body)}</p> : null}
        {details ? (
          <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 rounded-[14px] bg-[#f6f8fc] px-3 py-2 vd-xs text-[var(--vd-muted)]" data-testid="bid-details">
            {pair(C.nYourBid, details.amount)}
            {pair(C.nCurrent, details.current)}
            {pair(C.nNext, details.next)}
            {statusLabel ? (
              <span>
                {t(C.nStatus)}: <span className="font-bold text-[var(--vd-indigo)]">{t(statusLabel)}</span>
              </span>
            ) : null}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.action_url ? (
            <Link
              href={item.action_url.startsWith("/") ? link(item.action_url) : item.action_url}
              onClick={() => {
                if (unread) acc.markRead(item);
              }}
              className={btn("indigo", "sm", "h-10")}
            >
              {t(item.action_label) || t(C.viewDetailsLink)}
            </Link>
          ) : null}
          {unread ? (
            <button type="button" onClick={() => acc.markRead(item)} className={btn("outline", "sm", "h-10")} data-testid="mark-read">
              {t(C.markRead)}
            </button>
          ) : null}
          <span className={cx("inline-flex h-7 items-center rounded-full px-2.5 vd-xs font-bold", TINT[category] || TINT.system)}>{t(C.categories[category] || C.categories.system)}</span>
        </div>
      </div>
    </article>
  );
}

export function Notifications() {
  const { t } = useLang();
  const acc = useAccount();
  const [filter, setFilter] = useState("all");
  const [loadingMore, setLoadingMore] = useState(false);
  const loading = acc.state === "loading";
  const items = acc.has("notifications") ? acc.notifications : [];
  const unread = items.filter(isUnread).length;
  const visible = filter === "all" ? items : items.filter((item) => categoryOf(item) === filter);
  return (
    <Panel>
      <PanelHead as="h3" title={t(C.notificationsTitle)} note={unread ? t(C.unreadCaption, { n: unread }) : t(C.upToDateCaption)} className="mb-4" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div role="group" aria-label={t(C.filters)} className="grid min-w-0 flex-1 grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cx("h-10 min-w-0 truncate rounded-full px-2.5 vd-xs font-bold transition-colors sm:px-3.5", filter === key ? "bg-[var(--vd-indigo)] text-white" : "bg-[var(--vd-bluegray)] text-[var(--vd-ink)] hover:bg-[#dfe7f3]")}
              data-testid={`filter-${key}`}
            >
              {t(C.categories[key])}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={acc.refresh} aria-label={t(C.refreshNotifications)} title={t(C.refresh)} className="grid size-10 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] hover:bg-[#dfe7f3]">
            <RefreshCw aria-hidden="true" className={cx("size-4", acc.refreshing && "animate-spin motion-reduce:animate-none")} strokeWidth={2.2} />
          </button>
          {unread > 0 ? (
            <button type="button" onClick={acc.markAllRead} className={btn("gold", "md")} data-testid="mark-all-read">
              {t(C.markAllRead)}
            </button>
          ) : null}
        </div>
      </div>
      {acc.failing ? (
        <Notice tone="danger" role="alert" className="mt-4">
          {t(C.notificationsFailed)}
        </Notice>
      ) : null}
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2.5">
        {loading ? (
          <div role="status" aria-label={t(C.loadingNotifications)} className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
            {Array.from({ length: 3 }, (_, i) => (
              <Placeholder key={i} className="h-16 !rounded-[18px]" />
            ))}
          </div>
        ) : visible.length ? (
          visible.map((item) => <NotificationItem key={item.id} item={item} />)
        ) : (
          <p className="rounded-[18px] bg-[#f6f8fc] p-5 text-center vd-md text-[var(--vd-muted)]" data-testid="notifications-empty">
            {t(C.noNotifications)}
          </p>
        )}
      </div>
      {acc.notesMore && filter === "all" && !loading && items.length ? (
        <button
          type="button"
          disabled={loadingMore}
          onClick={async () => {
            setLoadingMore(true);
            await acc.loadMoreNotes();
            setLoadingMore(false);
          }}
          className={btn("soft", "lg", "mt-4 w-full")}
          data-testid="notifications-more"
        >
          {loadingMore ? t(C.loadingMoreNotifications) : t(C.loadMoreNotifications)}
        </button>
      ) : null}
    </Panel>
  );
}
