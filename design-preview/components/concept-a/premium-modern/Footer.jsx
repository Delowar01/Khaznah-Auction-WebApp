"use client";

import Link from "next/link";
import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { SiteLink, useNewsletterForm } from "@/components/shared/r3/home";
import { COPY } from "./copy";
import { PremiumLanguage } from "./Header";
import { btn } from "./ui";

/** Separate full-width charcoal band: heading left, email + brass Subscribe right. */
export function Newsletter() {
  const { t } = useLang();
  const titleId = useId();
  const { email, setEmail, error, onSubmit } = useNewsletterForm(t(COPY.newsTitle));
  return (
    <section data-ref="14" aria-labelledby={titleId} className="bg-[var(--pr-charcoal)] text-white">
      <div className="pr-container grid gap-5 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-8 dt:h-[128px] dt:py-0">
        <div className="dt:ps-2">
          <h2 id={titleId} className="pr-news text-white">
            {t(COPY.newsTitle)}
          </h2>
          <p className="mt-1 pr-body text-white/85">{t(COPY.newsText)}</p>
        </div>
        <form noValidate onSubmit={onSubmit} className="min-w-0 md:justify-self-stretch dt:justify-self-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-[11px]">
            <label className="min-w-0 sm:flex-1 dt:w-[387px] dt:flex-none">
              <span className="sr-only">{t(COPY.emailLabel)}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t(COPY.emailPlaceholder)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${titleId}-error` : undefined}
                className="pr-search h-12 w-full rounded-[4px] bg-white px-4 pr-md text-fg outline-none focus-visible:ring-2 focus-visible:ring-[var(--pr-brass)]"
              />
            </label>
            <button type="submit" className={btn("brass", "lg", "h-12 font-semibold sm:w-[140px] dt:w-[157px]")}>
              {t(COPY.subscribe)}
            </button>
          </div>
          <p id={`${titleId}-error`} role="alert" className="mt-1.5 min-h-4 pr-xs text-[#ffb4b4] empty:mt-0 empty:min-h-0">
            {error}
          </p>
        </form>
      </div>
    </section>
  );
}

/** Warm ivory footer: brand, four link groups, copyright and language. */
export function Footer() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const columns = [
    {
      title: COPY.colMarketplace,
      links: [
        { label: ui("buyNow"), href: "/browse?tab=buy_now" },
        { label: t(COPY.navTimed), href: "/browse?tab=auction" },
        { label: t(COPY.navLive), href: "/live-auction" },
        { label: t(COPY.navBulk), href: "/browse?category=bulk-pallets" },
      ],
    },
    {
      title: COPY.colHelp,
      links: [
        { label: t(COPY.linkHowItWorks), href: "#how-it-works" },
        { label: t(COPY.linkGrades), href: "#grades" },
        { label: t(COPY.linkDelivery), href: "#" },
        { label: t(COPY.linkContact), href: "#" },
      ],
    },
    {
      title: COPY.colAbout,
      links: [
        { label: t(COPY.linkAbout), href: "#" },
        { label: t(COPY.linkSell), href: "#" },
      ],
    },
    {
      title: COPY.colLegal,
      links: [
        { label: t(COPY.linkTerms), href: "#" },
        { label: t(COPY.linkPrivacy), href: "#" },
      ],
    },
  ];
  return (
    <footer data-ref="15" id="pr-footer" className="bg-bg">
      <div className="pr-container pt-8 dt:pt-[27px]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] dt:grid-cols-[338px_254px_261px_282px_minmax(0,1fr)] dt:gap-0">
          <div>
            <Link href={link("/")} className="inline-block rounded-[4px] outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-[52px] w-auto dt:h-[64px]" />
            </Link>
            <p className="mt-3 pr-sm text-fg-2">{t(COPY.footerTag)}</p>
          </div>
          <nav aria-label={t(COPY.footerNav)} className="grid grid-cols-2 gap-x-6 gap-y-7 dt:contents">
            {columns.map((column) => (
              <div key={column.title.en} className="dt:pt-[3px]">
                <h2 className="pr-md font-medium text-fg">{t(column.title)}</h2>
                <ul className="mt-2.5 space-y-[9px]">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <SiteLink href={item.href} label={item.label} className="pr-link pr-sm text-fg-2 hover:text-fg">
                        {item.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 dt:mt-[36px] dt:h-[86px] dt:py-0">
          <p className="pr-xs text-fg-2">{t(COPY.copyright)}</p>
          <PremiumLanguage />
        </div>
      </div>
    </footer>
  );
}
