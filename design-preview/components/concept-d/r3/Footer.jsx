"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, PAYMENT_METHODS } from "@/data/site";
import { COPY } from "./copy";
import { LangLink } from "./Header";

/** Dark footer that closes the page the way the live stage opens it. */
export function Footer() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <footer id="floor-footer" className="bg-[var(--ac-stage)] text-[var(--ac-stage-fg)]" style={{ "--logo-word": "#f3f2ee" }}>
      <div className="ac-container grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
        <div className="col-span-2 md:col-span-1">
          <Logo variant="lockup" title={t(BRAND.name)} className="h-9 w-auto" />
          <p className="mt-3 max-w-[260px] ac-sm text-[var(--ac-stage-dim)]">{t(COPY.footerTag)}</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title.en} aria-label={t(column.title)}>
            <h2 className="ac-label text-[var(--ac-stage-dim)]">{t(column.title)}</h2>
            <ul className="mt-3 grid gap-2">
              {column.links.map((item) => (
                <li key={item.label.en}>
                  <Link href={item.href.startsWith("#") ? item.href : link(item.href)} className="ac-sm hover:underline">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-[var(--ac-stage-line)]">
        <div className="ac-container flex flex-col gap-3 py-4 ac-xs text-[var(--ac-stage-dim)] md:flex-row md:items-center md:justify-between">
          <p>{t(COMPANY_LINE)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span>{t(COPY.weAccept)}</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} dir="ltr" className="rounded-[4px] border border-[var(--ac-stage-line)] px-1.5 py-0.5 ac-2xs font-bold text-[var(--ac-stage-fg)]">
                {method}
              </span>
            ))}
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-[var(--ac-stage-line)]" />
            <span>{t(COPY.country)}</span>
            <LangLink className="font-semibold text-[var(--ac-stage-fg)] hover:underline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
