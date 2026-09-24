"use client";

import { Money } from "@/components/shared/ui/Money";
import { HERO } from "@/data/site";
import { COPY } from "../copy";
import { useCopy } from "../lib/useCopy";

const ROWS = [
  { key: "typeDisplay", spec: "56 / 600", cls: "d-tight text-4xl font-semibold sm:text-[56px] sm:leading-[1.05]", sample: HERO.titleLines[0] },
  { key: "typeHeading", spec: "28 / 600", cls: "d-tight text-[28px] font-semibold leading-tight", sample: { en: "Closing soon", ar: "تُغلق قريباً" } },
  { key: "typeBody", spec: "15 / 400", cls: "text-[15px] leading-relaxed text-fg-2", sample: COPY.sampleBody },
  { key: "typeLabel", spec: "11 / 500", cls: "d-label text-fg-3", sample: { en: "Current bid", ar: "المزايدة الحالية" } },
];

/** Type specimens in English and Arabic, plus monospaced figures. */
export function TypeScale() {
  const c = useCopy();
  return (
    <div className="d-panel divide-y divide-line">
      <div className="grid gap-2 p-5 sm:grid-cols-2">
        <p className="text-sm text-fg-2">
          <span className="font-medium text-fg">EN</span> · {c("sysFontLatin")}
        </p>
        <p className="text-sm text-fg-2">
          <span className="font-medium text-fg">AR</span> · {c("sysFontArabic")}
        </p>
      </div>
      {ROWS.map((row) => (
        <div key={row.key} className="grid gap-4 p-5 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)] md:items-baseline">
          <div>
            <p className="text-sm font-medium text-fg">{c(row.key)}</p>
            <p className="d-num text-xs text-fg-3">{row.spec}</p>
          </div>
          <p lang="en" dir="ltr" className={`text-fg ${row.cls}`}>
            {row.sample.en}
          </p>
          <p lang="ar" dir="rtl" className={`text-fg ${row.cls}`} style={{ fontFamily: "var(--font-d-sans-ar), var(--font-d-sans), sans-serif" }}>
            {row.sample.ar}
          </p>
        </div>
      ))}
      <div className="grid gap-4 p-5 md:grid-cols-[140px_minmax(0,1fr)] md:items-baseline">
        <div>
          <p className="text-sm font-medium text-fg">{c("typeFigures")}</p>
          <p className="d-num text-xs text-fg-3">Geist Mono · tnum</p>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-fg">
          <Money value={3150} className="d-num text-[40px] font-medium" />
          <span className="d-num text-2xl" dir="ltr">
            05:40:12
          </span>
          <span className="d-num text-lg text-fg-2" dir="ltr">
            KZ-0388
          </span>
          <span className="d-num text-lg text-success" dir="ltr">
            +50
          </span>
        </div>
      </div>
    </div>
  );
}
