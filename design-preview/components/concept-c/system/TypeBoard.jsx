"use client";

import { Money } from "@/components/shared/ui/Money";
import { COPY } from "../copy";

function Specimen({ lang, face, notes }) {
  const pick = (content) => content[lang];
  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="rounded-md border border-line bg-surface p-6 sm:p-8">
      <p className="c-caps text-fg-3">{face}</p>
      <dl className="mt-6 space-y-6">
        <div>
          <dt className="text-xs text-fg-3">{pick(COPY.typeRoles.display)}</dt>
          <dd className="c-display mt-1 text-[2.75rem] sm:text-[3.25rem]">{pick(COPY.displaySample)}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-3">{pick(COPY.typeRoles.heading)}</dt>
          <dd className="c-h2 mt-1">{pick(COPY.headingSample)}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-3">{pick(COPY.typeRoles.body)}</dt>
          <dd className="c-prose mt-1">{pick(COPY.bodySample)}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-3">{pick(COPY.typeRoles.figures)}</dt>
          <dd className="mt-1 flex flex-wrap items-baseline gap-x-5">
            <Money value={3150} className="c-num text-3xl font-semibold text-fg" />
            <span dir="ltr" className="c-num text-2xl font-semibold text-fg">
              02:14:36
            </span>
          </dd>
        </div>
      </dl>
      <p className="mt-6 border-t border-line pt-4 text-xs text-fg-3">{pick(notes)}</p>
    </div>
  );
}

/** Arabic and English specimens side by side, each in its brand typeface. */
export function TypeBoard() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Specimen lang="ar" face="Alexandria · العربية" notes={COPY.typeNotesAr} />
      <Specimen lang="en" face="Archivo · Expanded" notes={COPY.typeNotesEn} />
    </div>
  );
}
