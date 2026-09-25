"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getProduct } from "@/data/products";
import { HERO } from "@/data/site";
import { RIYAL, formatNumber } from "@/lib/format";
import { COPY } from "../copy";

const FRIDGE = getProduct("fridge-690");
const LAMP = getProduct("task-lamp");

// Display and prices are set in Fraunces (serif); UI/body in Manrope; Arabic in
// Readex. Stacks are pinned here so each row shows its true face regardless of
// the page's current language.
const SERIF = { fontFamily: '"Riyal", var(--font-fraunces), Georgia, "Times New Roman", serif' };
const SANS = { fontFamily: '"Riyal", var(--font-manrope), system-ui, sans-serif' };
const ARABIC = { fontFamily: '"Riyal", var(--font-readex), var(--font-manrope), system-ui, sans-serif' };

// Each role: Latin size/leading/weight, Arabic size/leading (one step larger,
// taller, no tracking), plus which Latin face carries it.
const ROLES = [
  { key: "display", copy: COPY.typeDisplay, face: SERIF, latin: "Fraunces", en: [56, 60, 600, "-0.02em"], ar: [52, 74, 600], sample: HERO.titleLines[0] },
  { key: "title", copy: COPY.typeTitle, face: SERIF, latin: "Fraunces", en: [26, 33, 600, "-0.01em"], ar: [26, 40, 600], sample: COPY.dealsTitle },
  { key: "card", copy: COPY.typeCard, face: SANS, latin: "Manrope", en: [16, 24, 500], ar: [17, 28, 500], sample: LAMP.title },
  { key: "body", copy: COPY.typeBody, face: SANS, latin: "Manrope", en: [14, 22, 400], ar: [15, 26, 400], sample: HERO.body },
  { key: "meta", copy: COPY.typeMeta, face: SANS, latin: "Manrope", en: [12, 16, 500], ar: [13, 20, 400], sample: LAMP.conditionNote },
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

/** Fraunces (display + price) + Manrope (UI) + Readex (Arabic) scale, each role in both scripts. */
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
                {role.latin} {role.en[0]}/{role.en[1]} · Readex {role.ar[0]}/{role.ar[1]}
              </span>
            </p>
          </div>
          <Line spec={role.en} style={role.face} lang="en">
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
            <span dir="ltr">Fraunces · tabular-nums · 31/35 · 600</span>
          </p>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-3 tabular" style={SERIF}>
          <span dir="ltr" className="kb-price-lg text-fg">
            {RIYAL} {formatNumber(FRIDGE.currentBid)}
          </span>
          <span dir="ltr" className="kb-lg font-bold text-fg-3" style={SANS}>
            05:40:12
          </span>
        </p>
        <p className="flex flex-wrap items-baseline gap-x-3 tabular" style={SERIF}>
          <span dir="ltr" className="kb-price-lg text-primary">
            {RIYAL} {formatNumber(LAMP.price)}
          </span>
          <s dir="ltr" className="kb-lg font-semibold text-fg-3" style={SANS}>
            {RIYAL} {formatNumber(LAMP.originalPrice)}
          </s>
        </p>
      </div>
    </div>
  );
}
