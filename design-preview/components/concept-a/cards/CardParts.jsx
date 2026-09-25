"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { GradeChip } from "../ui/GradeChip";
import { SellerAvatar } from "../ui/SellerAvatar";
import { cx } from "../ui/cx";

/** Card frame: soft warm border, resting lift, elevates gently on hover. */
export function CardShell({ as: Tag = "article", className = "", children, ...props }) {
  return (
    <Tag
      className={cx(
        "group/card @container relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-[box-shadow,border-color,transform] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-line-strong hover:shadow-raised focus-within:border-line-strong",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * The packshot as a curated, framed object: a warm sand mat with an inset
 * hairline ring lifts the photo off the card, and a full-width rule underneath
 * divides the object from its caption. This matted presentation — rather than a
 * flat, edge-to-edge thumbnail — is the concept's product-card signature.
 */
export function CardFrame({ className = "", children }) {
  return (
    <div className={cx("border-b border-line p-3", className)}>
      <div className="relative overflow-hidden rounded-md bg-surface-2 p-2 ring-1 ring-inset ring-line">
        {children}
      </div>
    </div>
  );
}

/** Title link whose ::after stretches over the card, so the whole card is one target. */
export function TitleLink({ href, children, className = "", lines = 2 }) {
  return (
    <Link
      href={href}
      className={cx(
        "rounded-sm text-fg outline-offset-2 transition-colors after:absolute after:inset-0 after:z-[1] after:content-[''] hover:text-primary",
        lines === 2 ? "line-clamp-2" : "line-clamp-1",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Tiny monogram + seller name. */
export function SellerLine({ seller, name, className = "" }) {
  if (!seller) return null;
  return (
    <p className={cx("flex min-w-0 items-center gap-1.5 kb-2xs font-medium text-fg-3", className)}>
      <SellerAvatar seller={seller} size="xs" />
      <span className="truncate">{name}</span>
    </p>
  );
}

/**
 * Quiet, hairline-ruled caption footer: provenance (seller) at the start,
 * condition (grade) at the end. Pushed to the base of the caption with mt-auto
 * so a row of cards keeps its actions aligned.
 */
export function CardMeta({ seller, name, grade, className = "" }) {
  return (
    <div className={cx("mt-auto flex items-center justify-between gap-2 border-t border-line pt-3", className)}>
      <SellerLine seller={seller} name={name} className="flex-1" />
      <GradeChip grade={grade} />
    </div>
  );
}

/** Grey "Sold for …" veil over a closed lot's photo. */
export function SoldOverlay({ amount }) {
  const { ui } = useLang();
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] grid place-items-center bg-black/35">
      <div className="rounded-lg bg-black/75 px-3 py-2 text-center text-white shadow-raised backdrop-blur-sm">
        <p className="kb-eyebrow opacity-85">{ui("soldFor")}</p>
        <Money value={amount} className="kb-price-sm" />
      </div>
    </div>
  );
}

/** Brass eyebrow above the focal price ("Current bid", "Starting bid" …). */
export function PriceLabel({ children }) {
  return <p className="kb-eyebrow text-accent">{children}</p>;
}
