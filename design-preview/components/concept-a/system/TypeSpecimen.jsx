"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { tr } from "@/lib/i18n";
import { Caption } from "./Section";
import { COPY } from "../copy";

const FACES = {
  en: { display: "var(--font-a-display)", sans: "var(--font-a-sans)" },
  ar: { display: "var(--font-a-display-ar)", sans: "var(--font-a-sans-ar)" },
};

function Specimen({ lang }) {
  const { t } = useLang();
  const face = FACES[lang];
  const ar = lang === "ar";
  return (
    <div lang={lang} dir={ar ? "rtl" : "ltr"} className="min-w-0 rounded-card border border-line bg-surface p-6 sm:p-8">
      <p className="a-eyebrow !text-fg-3" style={{ letterSpacing: ar ? 0 : undefined, textTransform: ar ? "none" : undefined }}>
        {ar ? "العربية · Markazi Text / IBM Plex Sans Arabic" : "English · Instrument Serif / Instrument Sans"}
      </p>
      <p className="mt-6 text-[44px] leading-[1.1] text-fg sm:text-[56px]" style={{ fontFamily: face.display, fontWeight: ar ? 600 : 400, lineHeight: ar ? 1.3 : 1.05 }}>
        {tr(COPY.sampleDisplay, lang)}
      </p>
      <p className="mt-3 text-[12px] text-fg-3">{t(COPY.typeDisplay)} · 56</p>
      <p className="mt-6 text-[28px] text-fg" style={{ fontFamily: face.display, fontWeight: ar ? 600 : 400, lineHeight: ar ? 1.5 : 1.2 }}>
        {tr({ en: "Closing soon", ar: "مزادات تُغلق قريباً" }, lang)}
      </p>
      <p className="mt-1 text-[12px] text-fg-3">{t(COPY.typeHeading)} · 28</p>
      <p className="mt-6 text-[16px] text-fg-2" style={{ fontFamily: face.sans, lineHeight: ar ? 1.85 : 1.6 }}>
        {tr(COPY.sampleBody, lang)}
      </p>
      <p className="mt-1 text-[12px] text-fg-3">{t(COPY.typeBody)} · 16</p>
      <p className="mt-6 text-[12px] font-semibold text-fg" style={{ fontFamily: face.sans, letterSpacing: ar ? 0 : "0.18em", textTransform: ar ? "none" : "uppercase", fontSize: ar ? 13 : 11 }}>
        {tr({ en: "Condition graded", ar: "مصنّف حسب الحالة" }, lang)}
      </p>
      <p className="mt-1 text-[12px] text-fg-3">{t(COPY.typeLabel)}</p>
    </div>
  );
}

export function TypeSpecimen() {
  const { t } = useLang();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Specimen lang="en" />
        <Specimen lang="ar" />
      </div>
      <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
        <Caption>{t(COPY.typeFigures)}</Caption>
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 text-fg">
          <Money value={4600} className="a-serif text-[56px] leading-none" symbolClassName="text-[0.74em]" />
          <Money value={1250} className="text-[20px] font-semibold" />
          <span dir="ltr" className="a-serif text-[40px] tabular">05:40:11</span>
          <span dir="ltr" className="text-[15px] tabular text-fg-2">KZ-0388</span>
        </div>
      </div>
    </div>
  );
}
