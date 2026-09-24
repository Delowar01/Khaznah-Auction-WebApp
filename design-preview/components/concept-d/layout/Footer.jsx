"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/brand/Logo";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, PAYMENT_METHODS } from "@/data/site";
import { Container } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";

function FooterLink({ item }) {
  const { link } = useConcept();
  const { t } = useLang();
  const { toast } = useStore();
  const c = useCopy();
  const cls = "inline-flex min-h-8 items-center text-sm text-fg-2 transition-colors hover:text-fg";
  if (item.href === "#") {
    return (
      <button type="button" className={cls} onClick={() => toast({ tone: "info", title: t(item.label), description: c("linkElsewhere") })}>
        {t(item.label)}
      </button>
    );
  }
  const href = item.href.startsWith("#") ? `${link("/")}${item.href}` : link(item.href);
  return (
    <Link href={href} className={cls}>
      {t(item.label)}
    </Link>
  );
}

/** Compact dark footer (dark in both appearances). */
export function Footer({ dockSpace = false }) {
  const { t, isRTL } = useLang();
  return (
    <footer className={`d-scope-dark relative overflow-hidden border-t border-line bg-surface text-fg ${dockSpace ? "pb-24 lg:pb-0" : ""}`}>
      <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative py-14">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo variant="mark" decorative className="h-11 w-auto" />
              <Logo variant={isRTL ? "wordmark-ar" : "wordmark"} title={t(BRAND.name)} className={isRTL ? "h-7 w-auto" : "h-9 w-auto"} />
            </div>
            <p className="d-tight mt-6 max-w-xs text-2xl font-semibold text-fg text-balance">{t(BRAND.tagline)}</p>
            <ul className="mt-6 flex max-w-sm flex-wrap gap-x-4 gap-y-2" aria-label={t(BRAND.legalName)}>
              {BRAND.values.map((value, index) => (
                <li key={`${value.letter}-${index}`} className="flex items-baseline gap-1.5 text-xs text-fg-3" title={t(value.text)}>
                  <span className="d-num font-semibold text-auction">{value.letter}</span>
                  <span>{t(value.title)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title.en}>
                <h2 className="d-label mb-3 text-fg-3">{t(column.title)}</h2>
                <ul className="space-y-1">
                  {column.links.map((item) => (
                    <li key={item.label.en}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-fg-3">{t(COMPANY_LINE)}</p>
          <ul className="flex flex-wrap items-center gap-1.5">
            {PAYMENT_METHODS.map((method) => (
              <li key={method} className="d-num rounded-md border border-line-strong bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-fg-2" dir="ltr">
                {method}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
