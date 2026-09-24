"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { RIYAL, formatNumber, moneyLabel } from "@/lib/format";

/**
 * Amount with the official Saudi Riyal sign. Always laid out left-to-right
 * (sign on the left of the figure, as in production) and announced to screen
 * readers as a full phrase ("1,240 Saudi riyals").
 */
export function Money({ value, className = "", symbolClassName = "", strike = false }) {
  const { lang } = useLang();
  const Tag = strike ? "s" : "span";
  return (
    <Tag className={`inline-flex items-baseline gap-[0.2em] whitespace-nowrap tabular ${className}`} dir="ltr">
      <span className="sr-only">{moneyLabel(value, lang)}</span>
      <span aria-hidden="true" className={symbolClassName}>
        {RIYAL}
      </span>
      <span aria-hidden="true">{formatNumber(value)}</span>
    </Tag>
  );
}
