"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { CITIES, SELLERS } from "@/data/sellers";
import { buyNowProducts, openAuctions } from "@/lib/catalog";
import { plural } from "@/lib/i18n";
import { COPY, COPY_PLURALS } from "../copy";
import { Echo } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { Section, SectionHead } from "../ui/Section";
import { monogramBg } from "../seller/monogram";

const INDEX = Object.entries(CITIES).map(([key, name]) => {
  const sellers = SELLERS.filter((s) => s.city === key);
  const codes = sellers.map((s) => s.code);
  return {
    key,
    name,
    sellers,
    open: openAuctions().filter((p) => codes.includes(p.seller)).length,
    buyNow: buyNowProducts().filter((p) => codes.includes(p.seller)).length,
    live: sellers.some((s) => s.liveNow),
  };
});

function Monogram({ seller, className = "" }) {
  return (
    <span aria-hidden="true" className={`c-monogram grid place-items-center rounded-xs font-bold ${className}`} style={{ background: monogramBg(seller.tone) }}>
      {seller.monogram}
    </span>
  );
}

function City({ city, index }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const facts = [plural(city.sellers.length, COPY_PLURALS.warehouses, lang), plural(city.open, COPY_PLURALS.openAuctions, lang), plural(city.buyNow, COPY_PLURALS.buyNowItems, lang)];
  return (
    <li className="group relative flex flex-col bg-bg p-6 transition-colors duration-300 hover:bg-surface lg:min-h-[25rem] lg:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="c-num text-sm font-medium text-fg-3">{String(index + 1).padStart(2, "0")}</span>
        {city.live ? (
          <span className="flex items-center gap-2 text-xs font-semibold text-live">
            <Diamond variant="live" size={7} />
            {ui("liveNow")}
          </span>
        ) : (
          <Diamond size={7} className="text-line-strong transition-colors group-hover:text-accent" />
        )}
      </div>
      <h3 className="mt-8 font-display text-[2.75rem] font-bold leading-none text-fg transition-colors group-hover:text-primary rtl:leading-[1.15] lg:mt-10 lg:text-[3.25rem]">{t(city.name)}</h3>
      <Echo content={city.name} size="lg" className="mt-3" />
      <ul className="mt-6 space-y-1.5 text-sm text-fg-2">
        {facts.map((fact) => (
          <li key={fact} className="flex items-center gap-2.5">
            <Diamond size={4} className="text-accent" />
            {fact}
          </li>
        ))}
      </ul>
      <div className="relative mt-6 border-t border-line pt-4 lg:mt-auto lg:min-h-[6.5rem]">
        <div className="c-reveal-preview items-center gap-1.5">
          {city.sellers.map((seller) => (
            <Monogram key={seller.code} seller={seller} className="size-8 text-[0.6875rem]" />
          ))}
        </div>
        <ul className="c-reveal-names space-y-1 lg:pt-4">
          {city.sellers.map((seller) => (
            <li key={seller.code}>
              <Link href={link(`/seller/${seller.code}`)} className="flex min-h-10 items-center justify-between gap-3 text-[0.9375rem] font-medium text-fg hover:text-primary">
                <span className="flex items-center gap-2.5">
                  <Monogram seller={seller} className="size-6 text-[0.5625rem]" />
                  {t(seller.name)}
                </span>
                <DirIcon icon={ArrowRight} className="size-4 shrink-0 text-fg-3" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/** "Across the Kingdom": a typographic index of cities; hover reveals each city's sellers. */
export function CityIndex() {
  return (
    <Section labelledBy="kingdom-title" className="pt-6 sm:pt-8 lg:pt-10">
      <SectionHead id="kingdom-title" eyebrow={COPY.kingdomEyebrow} title={COPY.kingdomTitle} text={COPY.kingdomText} />
      <ol className="grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {INDEX.map((city, index) => (
          <City key={city.key} city={city} index={index} />
        ))}
      </ol>
    </Section>
  );
}
