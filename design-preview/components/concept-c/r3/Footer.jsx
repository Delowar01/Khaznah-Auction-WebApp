"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, PAYMENT_METHODS } from "@/data/site";
import { COPY } from "./copy";
import { LangLink } from "./Rail";

/** Compact footer: link columns in one band, then company · payments · language. */
export function Footer() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="hb-main grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 md:col-span-1">
          <Logo variant="lockup" title={t(BRAND.name)} className="h-8 w-auto" />
          <p className="mt-3 max-w-[260px] hb-sm text-fg-2">{t(COPY.footerTag)}</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title.en} aria-label={t(column.title)}>
            <h2 className="hb-eyebrow text-fg-3">{t(column.title)}</h2>
            <ul className="mt-2.5 grid gap-1.5">
              {column.links.map((item) => (
                <li key={item.label.en}>
                  <Link href={item.href.startsWith("#") ? item.href : link(item.href)} className="hb-sm text-fg-2 hover:text-fg hover:underline">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="hb-main flex flex-col gap-3 py-4 hb-xs text-fg-3 md:flex-row md:items-center md:justify-between">
          <p>{t(COMPANY_LINE)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span>{t(COPY.weAccept)}</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} dir="ltr" className="rounded-[4px] border border-line px-1.5 py-0.5 hb-2xs font-bold text-fg-2">
                {method}
              </span>
            ))}
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-line" />
            <span>{t(COPY.saudiArabia)}</span>
            <LangLink className="font-semibold text-primary hover:underline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
