"use client";

// Option 3 customer building blocks, drawn from the approved pages so the
// new screens read as the same marketplace: the Browse breadcrumbs and
// display heading, the product page's rounded white cards and blue-grey
// tiles, the stock pills (now any status, always with words and an icon),
// the ivory empty panel and the pill buttons. Behaviour-free.
import Link from "next/link";
import { Fragment } from "react";
import { CircleAlert, CircleCheck, Info, LoaderCircle, RotateCcw, TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { btn, cx } from "../ui";

/** Home · Marketplace · … as on Browse; the last crumb is the current page. */
export function Breadcrumbs({ items, className = "" }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const crumbs = [{ label: ui("home"), href: "/" }, ...items];
  return (
    <nav aria-label={ui("breadcrumb")} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 vd-sm text-[var(--vd-muted)]">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.label}-${i}`}>
              {i > 0 ? <li aria-hidden="true">·</li> : null}
              <li className={last ? "min-w-0 max-w-[18rem] truncate" : undefined}>
                {last || !crumb.href ? (
                  <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-[var(--vd-ink)]" : undefined}>
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={link(crumb.href)} className="vd-link hover:text-[var(--vd-indigo)]">
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * The page's opening: breadcrumbs, an optional kicker, the H1 and an intro,
 * with actions at the end. `size` "display" is the Browse heading (content
 * and storefront pages); "compact" suits the transactional pages.
 */
export function PageHeader({ crumbs, kicker, title, intro, actions, size = "compact", className = "", children }) {
  return (
    <div className={cx("vd-container pt-6 dt:pt-8", className)}>
      {crumbs ? <Breadcrumbs items={crumbs} /> : null}
      <div className={cx("flex flex-wrap items-end justify-between gap-x-8 gap-y-3", crumbs ? "mt-4 dt:mt-5" : null)}>
        <div className="min-w-0 max-w-3xl">
          {kicker ? <p className="vd-kicker text-[var(--vd-indigo)]">{kicker}</p> : null}
          <h1 className={cx(size === "display" ? "vd-page-title" : "vd-title-page", "text-[var(--vd-ink)]", kicker ? "mt-2" : null)}>{title}</h1>
          {intro ? <p className="mt-2 vd-lg text-[var(--vd-muted)]">{intro}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

/** The rounded white card of the product price card. */
export function Panel({ as: Tag = "section", className = "", children, ...rest }) {
  return (
    <Tag className={cx("rounded-[24px] border border-[var(--vd-line)] bg-white p-5 text-[var(--vd-ink)] shadow-[0_1px_2px_rgb(7_27_82/0.04),0_14px_34px_-20px_rgb(7_27_82/0.3)] dt:p-6", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Pale blue-grey inner tile (the quantity block of the price card). */
export function Tile({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag className={cx("rounded-[20px] bg-[#f6f8fc] p-3.5", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** A card's own heading row: title (h2 by default), optional note and actions. */
export function PanelHead({ title, note, actions, as: Tag = "h2", id, className = "" }) {
  return (
    <div className={cx("flex flex-wrap items-start justify-between gap-x-4 gap-y-2", className)}>
      <div className="min-w-0">
        <Tag id={id} className="vd-h3 text-[var(--vd-ink)]">
          {title}
        </Tag>
        {note ? <p className="mt-0.5 vd-sm text-[var(--vd-muted)]">{note}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

// Status tones: a pale fill and a dark text of the same hue (AA on white),
// always paired with words and an icon so colour is never the only signal.
export const TONE = {
  success: "bg-[#ddf4e6] text-[var(--vd-grade-a)]",
  warning: "bg-[#fdf1d8] text-[#7a4e0c]",
  danger: "bg-[#fde3e1] text-[#a61b18]",
  info: "bg-[#e3ecfb] text-[var(--vd-indigo)]",
  neutral: "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]",
  gold: "bg-[var(--vd-gold)] text-[var(--vd-ink)]",
  navy: "bg-[var(--vd-navy)] text-white",
  live: "bg-[var(--vd-live)] text-white",
};

const TONE_ICON = { success: CircleCheck, warning: CircleAlert, danger: TriangleAlert, info: Info, neutral: Info };

/** Status pill: icon + words in the tone's colours. `icon={null}` drops the icon (the words carry it). */
export function StatusPill({ tone = "neutral", icon, children, className = "", size = "md" }) {
  const Icon = icon === undefined ? TONE_ICON[tone] : icon;
  return (
    <span className={cx("inline-flex w-fit max-w-full items-center gap-1.5 whitespace-nowrap rounded-full font-bold", size === "sm" ? "h-6 px-2.5 vd-xs" : "h-7 px-3 vd-sm", TONE[tone], className)}>
      {Icon ? <Icon aria-hidden="true" className={size === "sm" ? "size-3.5 shrink-0" : "size-4 shrink-0"} strokeWidth={2.2} /> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Inline message: a toned, rounded band with an icon, a title and text, and optional actions. */
export function Notice({ tone = "info", title, children, actions, icon, role, className = "" }) {
  const Icon = icon === undefined ? TONE_ICON[tone] || Info : icon;
  const shade = {
    info: "bg-[#eef3fd] text-[var(--vd-ink)]",
    success: "bg-[#e8f7ee] text-[var(--vd-ink)]",
    warning: "bg-[#fdf4e2] text-[var(--vd-ink)]",
    danger: "bg-[#fdecea] text-[var(--vd-ink)]",
    neutral: "bg-[#f6f8fc] text-[var(--vd-ink)]",
    navy: "bg-[var(--vd-navy)] text-white",
  }[tone];
  const iconTone = { info: "text-[var(--vd-indigo)]", success: "text-[var(--vd-grade-a)]", warning: "text-[#7a4e0c]", danger: "text-[#a61b18]", neutral: "text-[var(--vd-indigo)]", navy: "text-[var(--vd-gold)]" }[tone];
  return (
    <div role={role} className={cx("flex flex-wrap items-start gap-x-3 gap-y-2 rounded-[18px] px-4 py-3.5", shade, className)}>
      {Icon ? <Icon aria-hidden="true" className={cx("mt-0.5 size-5 shrink-0", iconTone)} strokeWidth={2} /> : null}
      <div className="min-w-0 flex-1 basis-48">
        {title ? <p className="vd-md font-bold">{title}</p> : null}
        {children ? <div className={cx("vd-sm", tone === "navy" ? "text-white/80" : "text-[var(--vd-ink)]/80", title ? "mt-0.5" : null)}>{children}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** The ivory empty panel of Browse: a white disk with an icon, a heading, text and actions. */
export function EmptyState({ icon: Icon, title, text, actions, headingLevel = 2, className = "", compact = false, children }) {
  const Heading = `h${headingLevel}`;
  return (
    <div className={cx("rounded-[20px] bg-[var(--vd-ivory)] px-6 text-center", compact ? "py-9" : "py-12 dt:py-16", className)}>
      {Icon ? (
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_2px_8px_rgb(7_27_82/0.12)]">
          <Icon aria-hidden="true" className="size-7" strokeWidth={1.8} />
        </span>
      ) : null}
      <Heading className="mt-5 vd-h3 !text-[22px] !leading-7 text-[var(--vd-ink)]">{title}</Heading>
      {text ? <p className="mx-auto mt-2 max-w-md vd-md text-[var(--vd-muted)]">{text}</p> : null}
      {actions ? <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div> : null}
      {children}
    </div>
  );
}

/** A load that failed: what happened, and the retry the page already offers. */
export function ErrorState({ title, text, onRetry, retryLabel, actions, headingLevel = 2, className = "" }) {
  const { ui } = useLang();
  const Heading = `h${headingLevel}`;
  return (
    <div role="alert" className={cx("rounded-[20px] border border-[#f3c9c5] bg-[#fdf6f5] px-6 py-10 text-center", className)}>
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-[#a61b18] shadow-[0_2px_8px_rgb(7_27_82/0.1)]">
        <TriangleAlert aria-hidden="true" className="size-6" strokeWidth={1.9} />
      </span>
      <Heading className="mt-4 vd-h3 text-[var(--vd-ink)]">{title || ui("somethingWrong")}</Heading>
      {text ? <p className="mx-auto mt-1.5 max-w-md vd-md text-[var(--vd-muted)]">{text}</p> : null}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {onRetry ? (
          <button type="button" onClick={onRetry} className={btn("indigo", "lg")}>
            <RotateCcw aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {retryLabel || ui("tryAgain")}
          </button>
        ) : null}
        {actions}
      </div>
    </div>
  );
}

/** Indigo spinner with a visible or screen-reader label. */
export function Spinner({ label, className = "", showLabel = false }) {
  return (
    <span role="status" className={cx("inline-flex items-center gap-2 vd-md text-[var(--vd-muted)]", className)}>
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-[var(--vd-indigo)] motion-reduce:animate-none" strokeWidth={2.2} />
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
    </span>
  );
}

/** Pale rounded placeholders for loading rows and cards. */
export function Placeholder({ className = "" }) {
  return <span aria-hidden="true" className={cx("block animate-pulse rounded-full bg-[var(--vd-bluegray)] motion-reduce:animate-none", className)} />;
}

/** A loading card: a heading bar and a few lines, announced once. */
export function LoadingPanel({ label, lines = 3, className = "" }) {
  return (
    <Panel className={className} aria-busy="true">
      <Spinner label={label} />
      <div className="mt-4 grid gap-3">
        <Placeholder className="h-5 w-48 max-w-full" />
        {Array.from({ length: lines }, (_, i) => (
          <Placeholder key={i} className={cx("h-3.5", i % 2 ? "w-3/4" : "w-full")} />
        ))}
      </div>
    </Panel>
  );
}

/** One line of a price summary: label and amount (or any value). */
export function SummaryRow({ label, value, amount, strong = false, tone, hint, className = "" }) {
  return (
    <div className={cx("flex items-baseline justify-between gap-4", strong ? "vd-lg font-extrabold" : "vd-md", className)}>
      <dt className={cx("min-w-0", strong ? "text-[var(--vd-ink)]" : "text-[var(--vd-muted)]")}>
        {label}
        {hint ? <span className="block vd-xs font-normal text-[var(--vd-muted)]">{hint}</span> : null}
      </dt>
      <dd className={cx("shrink-0 text-end", tone === "saving" ? "font-bold text-[var(--vd-grade-a)]" : "text-[var(--vd-ink)]", strong ? null : "font-semibold")}>
        {amount !== undefined ? <Money value={amount} /> : value}
      </dd>
    </div>
  );
}

/** Key facts as a definition grid (order number, date, method …). */
export function Facts({ items, className = "", columns = "sm:grid-cols-2" }) {
  return (
    <dl className={cx("grid gap-x-6 gap-y-3", columns, className)}>
      {items.filter(Boolean).map((item, i) => (
        <div key={i} className="min-w-0">
          <dt className="vd-xs font-semibold text-[var(--vd-muted)]">{item.label}</dt>
          <dd className="mt-0.5 break-words vd-md font-semibold text-[var(--vd-ink)]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Round icon disk used beside headings and in lists. */
export function IconDisk({ icon: Icon, tone = "indigo", className = "" }) {
  const shade = { indigo: "bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]", gold: "bg-[#fdf1d8] text-[#7a4e0c]", white: "bg-white text-[var(--vd-indigo)] shadow-[0_2px_8px_rgb(7_27_82/0.12)]", navy: "bg-[var(--vd-navy)] text-white" }[tone];
  return (
    <span aria-hidden="true" className={cx("grid size-10 shrink-0 place-items-center rounded-full", shade, className)}>
      <Icon className="size-[18px]" strokeWidth={2} />
    </span>
  );
}
