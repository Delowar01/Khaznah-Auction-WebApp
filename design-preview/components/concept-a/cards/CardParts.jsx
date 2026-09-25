"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
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

/** Label above a price ("Current bid", "Starting bid" …), set as a refined eyebrow. */
export function PriceLabel({ children }) {
  return <p className="kb-eyebrow text-fg-3">{children}</p>;
}
