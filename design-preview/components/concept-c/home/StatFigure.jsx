"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { RIYAL, formatNumber } from "@/lib/format";
import { COPY } from "../copy";

/**
 * A STATS entry in Archivo expanded numerals: "2,480+", "100%", and money
 * with the Riyal sign on the left — "⃁ 14.2M" / Arabic "⃁ مليون 14.2"
 * (read right to left: ١٤٫٢ مليون ريال).
 */
export function StatFigure({ stat, className = "" }) {
  const { t, lang } = useLang();
  const figure = <span>{formatNumber(stat.value)}</span>;
  const suffix = stat.suffix ? <span className="text-[0.62em] text-primary">{stat.suffix}</span> : null;

  if (stat.money) {
    const sign = <span className="text-[0.6em]">{RIYAL}</span>;
    const unit = <span className="text-[0.52em] font-semibold">{t(COPY.million).trim()}</span>;
    return lang === "ar" ? (
      <span dir="rtl" className={`c-num inline-flex items-baseline gap-[0.18em] ${className}`}>
        {figure}
        {unit}
        {sign}
      </span>
    ) : (
      <span dir="ltr" className={`c-num inline-flex items-baseline gap-[0.12em] ${className}`}>
        {sign}
        {figure}
        {unit}
      </span>
    );
  }

  return (
    <span dir="ltr" className={`c-num inline-flex items-baseline gap-[0.08em] ${className}`}>
      {figure}
      {suffix}
    </span>
  );
}
