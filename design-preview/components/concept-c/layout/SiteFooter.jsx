"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/brand/Logo";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, PAYMENT_METHODS } from "@/data/site";
import { COPY } from "../copy";
import { Echo } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { Newsletter } from "./Newsletter";
import { useSiteLink } from "./nav";

function FooterLink({ item }) {
  const { t } = useLang();
  const { toast } = useStore();
  const { resolve, onNavigate } = useSiteLink();
  const label = t(item.label);
  const cls = "c-link inline-flex min-h-9 items-center text-[0.9375rem] text-fg-2 hover:text-fg";
  if (item.href === "#") {
    return (
      <button type="button" onClick={() => toast({ tone: "info", title: label, description: t(COPY.pageSoon) })} className={`${cls} text-start`}>
        {label}
      </button>
    );
  }
  return (
    <Link href={resolve(item.href)} onClick={onNavigate(item.href)} className={cls}>
      {label}
    </Link>
  );
}

/** Night-indigo footer: stacked logo, bilingual tagline, alerts, columns, payments. */
export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="c-night relative overflow-hidden">
      <span className="c-gridlines" style={{ "--grid": "5rem", "--grid-mask": "linear-gradient(to bottom, black, transparent 75%)" }} />
      <div className="c-container relative pb-8 pt-16 lg:pt-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20">
          <div>
            <Logo variant="stacked" className="c-logo h-24 w-auto sm:h-28" title={t(BRAND.name)} />
            <p className="mt-8 text-2xl font-bold leading-snug text-fg sm:text-[1.75rem]">{t(BRAND.tagline)}</p>
            <Echo content={BRAND.tagline} size="lg" className="mt-1" />
            <div className="mt-10">
              <Newsletter />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title.en} aria-label={t(column.title)}>
                <p className="c-caps mb-4 flex items-center gap-2 text-fg">
                  <Diamond size={5} className="text-accent" />
                  {t(column.title)}
                </p>
                <ul className="space-y-1">
                  {column.links.map((item) => (
                    <li key={item.label.en}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap items-center gap-2" aria-label={t(COPY.paymentMethods)}>
            {PAYMENT_METHODS.map((method) => (
              <li key={method} lang="en" className="c-num flex h-8 items-center rounded-xs border border-line-strong px-3 text-xs font-semibold tracking-wide text-fg">
                {method}
              </li>
            ))}
          </ul>
          <p className="text-sm text-fg-2">{t(COMPANY_LINE)}</p>
        </div>
      </div>
    </footer>
  );
}
