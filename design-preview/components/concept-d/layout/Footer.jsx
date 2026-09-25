"use client";

import Link from "next/link";
import { BadgeCheck, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, PAYMENT_METHODS, TRUST_POINTS } from "@/data/site";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";
import { LanguageLink } from "./ChromeBits";
import { NewsletterBand } from "./NewsletterBand";

const TRUST_ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard, delivery: Truck };
const LINK = "rounded-sm kb-sm opacity-75 transition-opacity hover:opacity-100 hover:underline underline-offset-4";

function FooterLink({ item }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  const label = t(item.label);
  if (item.href === "#") {
    return (
      <button type="button" className={`${LINK} text-start`} onClick={() => toast({ tone: "info", title: label, description: t(COPY.comingSoon) })}>
        {label}
      </button>
    );
  }
  if (item.href.startsWith("#")) {
    return (
      <Link href={`${link("/")}${item.href}`} className={LINK}>
        {label}
      </Link>
    );
  }
  if (item.href.startsWith("/browse")) {
    return (
      <BrowseLink href={item.href} className={LINK}>
        {label}
      </BrowseLink>
    );
  }
  return (
    <Link href={link(item.href)} className={LINK}>
      {label}
    </Link>
  );
}

/** Ink footer: newsletter, link columns, trust, payment methods, company line. */
export function Footer() {
  const { t } = useLang();
  return (
    <footer className="kb-on-dark bg-secondary text-on-secondary">
      <NewsletterBand />

      <div className="kb-container grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-8">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Logo variant="lockup" title={t(BRAND.name)} className="h-12 w-auto" />
          <p className="mt-4 max-w-sm kb-sm opacity-75">{t(COPY.footerBlurb)}</p>
          <p className="mt-4 kb-sm font-bold text-accent">{t(BRAND.tagline)}</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title.en} aria-label={t(column.title)}>
            <h2 className="mb-3 kb-sm font-bold">{t(column.title)}</h2>
            <ul className="grid gap-2.5">
              {column.links.map((item) => (
                <li key={item.label.en}>
                  <FooterLink item={item} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <ul className="kb-container grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
          {TRUST_POINTS.map((point) => {
            const Icon = TRUST_ICONS[point.key];
            return (
              <li key={point.key} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-accent">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <span className="kb-sm font-semibold">{t(point.title)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-white/10">
        <div className="kb-container flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="kb-xs opacity-70">{t(COMPANY_LINE)}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="kb-xs opacity-70">{t(COPY.weAccept)}</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} dir="ltr" className="rounded-md border border-white/15 bg-white/5 px-2 py-1 kb-2xs font-extrabold tracking-wide">
                {method}
              </span>
            ))}
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-white/15 max-md:hidden" />
            <LanguageLink className="rounded-md px-2 py-1 kb-xs font-bold opacity-85 hover:bg-white/10 hover:opacity-100" />
          </div>
        </div>
      </div>
    </footer>
  );
}
