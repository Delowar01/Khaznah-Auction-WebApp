"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/data/products";
import { HERO } from "@/data/site";
import { RIYAL, formatNumber } from "@/lib/format";
import { COPY } from "../copy";

const FRIDGE = getProduct("fridge-690");
const LAMP = getProduct("task-lamp");

const LATIN = { fontFamily: '"Riyal", var(--font-b-sans), system-ui, sans-serif' };
const ARABIC = { fontFamily: '"Riyal", var(--font-b-sans-ar), var(--font-b-sans), system-ui, sans-serif' };

// Each role: Latin size/leading/weight, Arabic size/leading (one step larger, taller, no tracking).
const ROLES = [
  { key: "display", copy: COPY.typeDisplay, en: [50, 54, 800, "-0.03em"], ar: [46, 66, 800], sample: HERO.titleLines[0] },
  { key: "title", copy: COPY.typeTitle, en: [22, 28, 800, "-0.02em"], ar: [23, 34, 800], sample: COPY.dealsTitle },
  { key: "card", copy: COPY.typeCard, en: [14, 20, 600], ar: [15, 24, 700], sample: LAMP.title },
  { key: "body", copy: COPY.typeBody, en: [14, 21, 400], ar: [15, 26, 400], sample: HERO.body },
  { key: "meta", copy: COPY.typeMeta, en: [12, 16, 500], ar: [13, 20, 400], sample: LAMP.conditionNote },
];

function Line({ spec, style, lang, children }) {
  const [size, leading, weight, tracking] = spec;
  return (
    <p
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="line-clamp-3 text-fg"
      style={{ ...style, fontSize: size, lineHeight: `${leading}px`, fontWeight: weight, letterSpacing: tracking || 0 }}
    >
      {children}
    </p>
  );
}

/** Figtree + Almarai scale, each role shown in both scripts. */
export function TypeSpecimen() {
  const { t } = useLang();
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      {ROLES.map((role) => (
        <div key={role.key} className="grid gap-4 border-b border-line p-5 last:border-b-0 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="kb-sm font-bold text-fg">{t(role.copy)}</p>
            <p className="font-mono kb-2xs text-fg-3">
              <span dir="ltr">
                Figtree {role.en[0]}/{role.en[1]} · Almarai {role.ar[0]}/{role.ar[1]}
              </span>
            </p>
          </div>
          <Line spec={role.en} style={LATIN} lang="en">
            {role.sample.en}
          </Line>
          <Line spec={role.ar} style={ARABIC} lang="ar">
            {role.sample.ar}
          </Line>
        </div>
      ))}
      <div className="grid gap-4 p-5 lg:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <p className="kb-sm font-bold text-fg">{t(COPY.typePrice)}</p>
          <p className="font-mono kb-2xs text-fg-3">
            <span dir="ltr">tabular-nums · 28/32 · 800</span>
          </p>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-3 tabular" style={LATIN}>
          <span dir="ltr" className="kb-price-lg text-fg">
            {RIYAL} {formatNumber(FRIDGE.currentBid)}
          </span>
          <span dir="ltr" className="kb-lg font-bold text-fg-3">
            05:40:12
          </span>
        </p>
        <p className="flex flex-wrap items-baseline gap-x-3 tabular" style={LATIN}>
          <span dir="ltr" className="kb-price-lg text-primary">
            {RIYAL} {formatNumber(LAMP.price)}
          </span>
          <s dir="ltr" className="kb-lg font-semibold text-fg-3">
            {RIYAL} {formatNumber(LAMP.originalPrice)}
          </s>
        </p>
      </div>
    </div>
  );
}
