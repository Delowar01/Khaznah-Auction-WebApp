"use client";

// Small pieces shared by the buyer account tabs: plurals, dates as
// production formats them, the item picture tile, status pills, the
// production countdown and a section card.
import { createContext, useContext } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { getProduct } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { plural } from "@/lib/i18n";
import { toneOf } from "../browse/Cards";
import { Panel, PanelHead, StatusPill } from "../kit/Blocks";
import { cx } from "../ui";
import { ACCOUNT_COPY as C, PLURAL } from "./copy";

/** The account page's shared state and actions (see AccountPage.jsx). */
export const AccountContext = createContext(null);
export const useAccount = () => useContext(AccountContext);

export const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
export const num = (value) => Number(value) || 0;

/** Counted copy: `pc("wins", 3, { ref })`. */
export function usePlural() {
  const { lang } = useLang();
  return (key, n, vars = {}) => {
    const text = plural(n, PLURAL[key], lang);
    return text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match));
  };
}

const ZONE = "Asia/Riyadh";

/**
 * Production's dates: `toLocaleString("en-GB")` in both languages on order
 * surfaces ("22/10/2026, 14:05:09"); notifications and disputes switch to
 * `ar-SA` in Arabic (`local`). Riyadh time so every visit reads the same.
 */
export function useDates() {
  const { lang } = useLang();
  const locale = (local) => (local && lang === "ar" ? "ar-SA" : "en-GB");
  return {
    dateTime: (iso, local = false) => (iso ? new Date(iso).toLocaleString(locale(local), { timeZone: ZONE }) : ""),
    date: (iso, local = false) => (iso ? new Date(iso).toLocaleDateString(locale(local), { timeZone: ZONE }) : ""),
  };
}

/** Text that must stay left to right inside Arabic (order numbers, codes, dates). */
export function Ltr({ children, className = "" }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}

/** A status: { label, tone } from status.js, always words plus an icon. */
export function Status({ status, size = "sm", className = "" }) {
  const { t } = useLang();
  return (
    <StatusPill tone={status.tone} size={size} className={className}>
      {t(status.label)}
    </StatusPill>
  );
}

/** The catalogue picture of a lot or order item on its soft plate. */
export function Thumb({ slug, size = "md", className = "", alt = "" }) {
  const product = getProduct(slug);
  const box = { sm: "size-12 rounded-[12px]", md: "size-16 rounded-[14px]", lg: "size-20 rounded-[16px]" }[size];
  return (
    <span className={cx("relative block shrink-0 overflow-hidden", box, className)} style={{ background: product ? toneOf(product.slug) : "var(--vd-bluegray)" }}>
      {product ? <Img image={product.images[0]} cutout alt={alt} sizes="80px" className="vd-multiply absolute inset-0 size-full object-contain p-1.5" /> : null}
    </span>
  );
}

/** Production's watchlist countdown: "49h 3m 12s", "4m 5s"; "Ended" without an end time. */
export function TimeRemaining({ endsIn, className = "" }) {
  const { t } = useLang();
  const remaining = useRemaining(endsIn);
  if (endsIn == null || remaining == null || remaining <= 0) return <span className={className}>{t(C.ended)}</span>;
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return (
    <span className={cx("tabular", className)}>
      {hours ? `${hours}${t(C.unitH)} ` : ""}
      {minutes}
      {t(C.unitM)} {seconds}
      {t(C.unitS)}
    </span>
  );
}

/** A card of the account: rounded white panel with its heading (h3) row. */
export function Section({ title, note, actions, children, className = "", id, ...rest }) {
  return (
    <Panel className={className} aria-labelledby={title ? id : undefined} {...rest}>
      {title ? <PanelHead as="h3" id={id} title={title} note={note} actions={actions} className="mb-4" /> : null}
      {children}
    </Panel>
  );
}

/** Uppercase field caption used above values in rows and cards. */
export function Caption({ children, className = "" }) {
  return <span className={cx("block vd-xs font-semibold text-[var(--vd-muted)]", className)}>{children}</span>;
}

/** The buyer's photo, or the first two letters of the name on navy. */
export function Avatar({ profile, size = "md" }) {
  const { t } = useLang();
  const name = t(profile.full_name) || profile.user_email || t(C.buyer);
  const box = size === "lg" ? "size-24 text-[28px]" : "size-12 text-[15px]";
  return (
    <span role="img" aria-label={t(C.photoOf, { name })} className={cx("grid shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--vd-navy)] font-extrabold text-white", box)}>
      {profile.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatar} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{name.replace(/\s+/g, "").slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}
