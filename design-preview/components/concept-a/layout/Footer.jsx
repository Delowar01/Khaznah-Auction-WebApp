"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/brand/Logo";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, PAYMENT_METHODS } from "@/data/site";
import { LangLink } from "./LangLink";

export function Footer() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <footer className="a-stage" style={{ "--logo-word": "var(--stage-fg)", "--logo-mark": "#c9a45a" }}>
      <div className="mx-auto max-w-[1360px] px-6 pb-10 pt-20 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo variant="lockup" className="h-12 w-auto" />
            <p className="a-display mt-8 max-w-sm text-[32px] text-[var(--stage-fg)]">{t(BRAND.tagline)}</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title.en}>
                <h2 className="a-eyebrow !text-[var(--stage-muted)]">{t(col.title)}</h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label.en}>
                      <Link href={l.href.startsWith("#") ? link(`/${l.href}`) : link(l.href)} className="text-[14px] text-[var(--stage-fg)]/85 transition-colors hover:text-[var(--stage-fg)]">
                        {t(l.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-6 border-t border-[var(--stage-line)] pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods">
            {PAYMENT_METHODS.map((m) => (
              <li key={m} className="rounded-xs border border-[var(--stage-line)] px-3 py-1.5 text-[12px] font-semibold tracking-wide text-[var(--stage-fg)]/80" dir="ltr">
                {m}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 text-[12px] text-[var(--stage-muted)] md:flex-row md:items-center md:gap-6">
            <p>{t(COMPANY_LINE)}</p>
            <LangLink className="font-semibold text-[var(--stage-fg)] underline underline-offset-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
