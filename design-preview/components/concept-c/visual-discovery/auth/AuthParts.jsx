"use client";

// Pieces shared by Option 3's sign-in, registration and seller onboarding
// screens: production's portal switch (Buyer · Seller · Admin), the
// introduction over the photograph, the form heading, banners, the resend
// cooldown and links to production screens this preview does not include.
import Link from "next/link";
import { forwardRef, useEffect, useState } from "react";
import { ArrowRight, CircleAlert, CircleCheck, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { PORTAL_COPY as P } from "@/components/shared/commerce/authCopy";
import { btn, cx } from "../ui";

/**
 * A link to a production screen outside the preview (the seller and staff
 * portals, the seller dashboard). It keeps production's address and, here,
 * says where it leads instead of opening a page the preview does not have.
 */
export function OutsideLink({ href, name, className = "", children, ...rest }) {
  const { t } = useLang();
  const { toast } = useStore();
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        toast({ tone: "info", title: name, description: t(P.outside, { portal: name }) });
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}

/**
 * Production's portal switch. `items`: { key, label, icon, current?, href?
 * (inside the preview), outside? (a production path), onClick? (the
 * in-place swap on /register) }.
 */
export function PortalSwitch({ label, items, className = "" }) {
  const { link } = useConcept();
  const base = "inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 vd-sm font-semibold transition-colors sm:flex-none sm:px-3";
  const idle = cx(base, "text-[var(--vd-ink)] hover:bg-white");
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex w-full gap-1 rounded-full bg-[var(--vd-bluegray)] p-1 sm:w-fit">
        {items.map((item) => {
          const inner = (
            <>
              <item.icon aria-hidden="true" className="size-4 shrink-0 max-[359px]:hidden" strokeWidth={2} />
              {item.label}
            </>
          );
          return (
            <li key={item.key} className="flex min-w-0 flex-1 sm:flex-none">
              {item.current ? (
                <span aria-current="page" className={cx(base, "w-full bg-[var(--vd-indigo)] text-white shadow-[0_1px_3px_rgb(7_27_82/0.2)]")}>
                  {inner}
                </span>
              ) : item.onClick ? (
                <button type="button" onClick={item.onClick} className={cx(idle, "w-full")}>
                  {inner}
                </button>
              ) : item.outside ? (
                <OutsideLink href={item.outside} name={item.label} className={cx(idle, "w-full")}>
                  {inner}
                </OutsideLink>
              ) : (
                <Link href={link(item.href)} className={cx(idle, "w-full")}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** The form's opening: eyebrow, the page's h1 (or h2) and a line under it. */
export function AuthHeading({ eyebrow, title, subtitle, icon: Icon, as: Tag = "h1", id, headingRef, className = "" }) {
  return (
    <div className={className}>
      {eyebrow ? (
        <p className="flex items-center gap-2 vd-kicker text-[var(--vd-indigo)]">
          {Icon ? <Icon aria-hidden="true" className="size-4" strokeWidth={2.2} /> : null}
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} ref={headingRef} tabIndex={-1} className={cx("vd-title-page text-[var(--vd-ink)] outline-none", eyebrow ? "mt-2" : null)}>
        {title}
      </Tag>
      {subtitle ? <p className="mt-2 vd-lg text-[var(--vd-muted)]">{subtitle}</p> : null}
    </div>
  );
}

const BANNER = {
  success: { shade: "bg-[#e8f7ee] text-[#14532d]", icon: CircleCheck, iconTone: "text-[var(--vd-grade-a)]" },
  warning: { shade: "bg-[#fdf4e2] text-[#5c3a06]", icon: CircleAlert, iconTone: "text-[#7a4e0c]" },
  danger: { shade: "bg-[#fdecea] text-[#7f1d1a]", icon: TriangleAlert, iconTone: "text-[#a61b18]" },
};

/** A form message: production's banners keep their roles (status / alert) and live settings. */
export const Banner = forwardRef(function Banner({ tone = "danger", children, className = "", ...rest }, ref) {
  const style = BANNER[tone];
  return (
    <div ref={ref} tabIndex={-1} className={cx("flex items-start gap-3 rounded-[16px] px-4 py-3 vd-md font-semibold outline-none", style.shade, className)} {...rest}>
      <style.icon aria-hidden="true" className={cx("mt-0.5 size-5 shrink-0", style.iconTone)} strokeWidth={2} />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
});

/**
 * The introduction production shows beside the form from 1024 px: the pill,
 * the headline, a line, four reassurance tiles and the protected-details
 * box — here over the furniture photograph.
 */
export function IntroAside({ pill, title, text, tiles, icons, trustTitle, trustText }) {
  const { t } = useLang();
  return (
    <div className="grid gap-5">
      <p className="inline-flex h-8 w-fit items-center rounded-full bg-white/12 px-3.5 vd-kicker text-[var(--vd-gold)] ring-1 ring-white/20">{t(pill)}</p>
      <div>
        <p className="vd-h2 !text-[34px] !leading-[40px] text-white rtl:!leading-[48px]">{t(title)}</p>
        <p className="mt-3 max-w-lg vd-lg text-white/85">{t(text)}</p>
      </div>
      <ul className="grid grid-cols-2 gap-2.5">
        {tiles.map((tile, i) => {
          const Icon = icons[i];
          return (
            <li key={tile.en} className="flex items-start gap-2.5 rounded-[16px] bg-white/[0.08] px-3.5 py-3 ring-1 ring-white/15">
              <Icon aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-[var(--vd-gold)]" strokeWidth={2} />
              <span className="vd-md font-semibold text-white">{t(tile)}</span>
            </li>
          );
        })}
      </ul>
      <div className="flex items-start gap-3 rounded-[18px] bg-white px-4 py-3.5 text-[var(--vd-ink)]">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2} />
        <span className="min-w-0">
          <span className="block vd-md font-bold">{t(trustTitle)}</span>
          <span className="block vd-sm text-[var(--vd-muted)]">{t(trustText)}</span>
        </span>
      </div>
    </div>
  );
}

/** Phones and tablets: the protected-details line under the form (the introduction shows from 1024 px). */
export function TrustNote({ title, text, className = "" }) {
  const { t } = useLang();
  return (
    <p className={cx("mt-4 flex items-start gap-3 rounded-[18px] bg-white px-4 py-3.5 ring-1 ring-[var(--vd-line)] lg:hidden", className)}>
      <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--vd-grade-a)]" strokeWidth={2} />
      <span className="min-w-0">
        <span className="block vd-md font-bold text-[var(--vd-ink)]">{t(title)}</span>
        <span className="block vd-sm text-[var(--vd-muted)]">{t(text)}</span>
      </span>
    </p>
  );
}

/** "or"-style divider with a centred line of text. */
export function Divider({ children, className = "" }) {
  return (
    <div className={cx("flex items-center gap-3", className)}>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--vd-line)]" />
      <span className="vd-md font-semibold text-[var(--vd-muted)]">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-[var(--vd-line)]" />
    </div>
  );
}

/** Resend cooldown: seconds left and a setter (production counts down once a second). */
export function useCooldown(initial = 0) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return undefined;
    const timer = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [left]);
  return [left, setLeft];
}

/** A simulated request: production's call takes a moment; the preview waits as long. */
export const request = (ms = 700) => new Promise((resolve) => window.setTimeout(resolve, ms));

/** The email the code went to, kept left-to-right inside Arabic sentences. */
export function Email({ children, className = "" }) {
  return (
    <bdi dir="ltr" className={cx("font-bold text-[var(--vd-ink)]", className)}>
      {children}
    </bdi>
  );
}

/**
 * The form's main button. While the request runs it shows production's
 * spinner and busy label and refuses a second press (aria-disabled, so the
 * label stays readable); `disabled` is production's disabled state.
 */
export function SubmitButton({ busy = false, busyLabel, label, disabled = false, variant = "indigo", className = "", type = "submit", ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={busy || undefined}
      className={btn(variant, "lg", cx("h-14 w-full vd-lg aria-disabled:cursor-wait", className))}
      {...rest}
    >
      {busy ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" strokeWidth={2.2} /> : <ArrowRight aria-hidden="true" className="flip-rtl size-5" strokeWidth={2.2} />}
      {busy ? busyLabel : label}
    </button>
  );
}
