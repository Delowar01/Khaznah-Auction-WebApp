"use client";

import Link from "next/link";
import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { SiteLink, useNewsletterForm } from "@/components/shared/r3/home";
import { COPY } from "./copy";
import { DiscoveryLanguage } from "./Header";

/** Ivory band: split-colour heading left, white field + gold Subscribe right. */
export function Newsletter() {
  const { t } = useLang();
  const titleId = useId();
  const { email, setEmail, error, onSubmit } = useNewsletterForm(`${t(COPY.newsTitleA)} ${t(COPY.newsTitleB)}`);
  return (
    <section data-ref="12" aria-labelledby={titleId} className="mx-auto max-w-[1440px] bg-[var(--vd-ivory)] dt:rounded-[18px]">
      <div className="vd-container">
        <div className="grid gap-5 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-8 dt:h-[142px] dt:grid-cols-[minmax(0,1fr)_614px] dt:gap-6 dt:py-0 dt:pe-[14px] dt:ps-[16px]">
          <div>
            <h2 id={titleId} className="vd-news">
              <span className="text-[var(--vd-ink)]">{t(COPY.newsTitleA)}</span> <span className="text-[var(--vd-blue)]">{t(COPY.newsTitleB)}</span>
            </h2>
            <p className="mt-1 vd-lg text-[var(--vd-ink)]/85 dt:mt-0.5">{t(COPY.newsText)}</p>
          </div>
          <form noValidate onSubmit={onSubmit} className="min-w-0 dt:pt-[14px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
              <label className="min-w-0 sm:flex-1">
                <span className="sr-only">{t(COPY.emailLabel)}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t(COPY.emailPlaceholder)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${titleId}-error` : undefined}
                  className="vd-search h-[52px] w-full rounded-[10px] bg-white px-5 vd-md text-[var(--vd-ink)] outline-none ring-[var(--vd-indigo)] focus-visible:ring-2 sm:rounded-e-none dt:h-[54px] dt:ps-6"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--vd-gold)] px-10 text-[16px] font-bold text-[var(--vd-ink)] transition-colors outline-offset-2 hover:bg-[var(--vd-gold-hover)] sm:-ms-1.5 sm:w-[180px] dt:h-[56px] dt:w-[214px] dt:text-[17px]"
              >
                {t(COPY.subscribe)}
              </button>
            </div>
            <p id={`${titleId}-error`} role="alert" className="mt-1.5 min-h-4 vd-xs font-semibold text-[#b3261e] empty:mt-0 empty:min-h-0">
              {error}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// Brand glyphs (lucide has no social logos). They are marks, so they never mirror.
const SOCIAL = [
  {
    key: "instagram",
    name: "Instagram",
    glyph: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "x",
    name: "X",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
      </svg>
    ),
  },
  {
    key: "youtube",
    name: "YouTube",
    glyph: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z" />
      </svg>
    ),
  },
];

/** White footer: brand, three link groups, language + social, legal line. */
export function Footer() {
  const { t } = useLang();
  const { link } = useConcept();
  const columns = [
    {
      title: COPY.colMarketplace,
      links: [
        { label: t(COPY.navBuyNow), href: "/browse?tab=buy_now" },
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
  ];
  const linkClass = "vd-link vd-body text-[var(--vd-muted)] hover:text-[var(--vd-indigo)]";
  return (
    <footer data-ref="13" className="bg-white">
      <div className="vd-container pt-8 dt:pt-[31px]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] dt:grid-cols-[365px_219px_247px_minmax(0,1fr)_auto] dt:gap-0 dt:pe-[14px] dt:ps-[6px]">
          <div>
            <Link href={link("/")} className="inline-block rounded-[8px] outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-11 w-auto dt:h-[53px]" />
            </Link>
            <p className="mt-4 max-w-[250px] vd-body text-[var(--vd-muted)] dt:mt-5">{t(COPY.footerTag)}</p>
          </div>
          <div className="order-last flex flex-wrap items-center justify-between gap-5 md:order-none md:col-start-2 md:row-start-1 md:flex-col md:items-end md:justify-start dt:col-start-5 dt:gap-0 dt:pt-[3px]">
            <DiscoveryLanguage roomy />
            <ul aria-label={t(COPY.social)} className="flex items-center gap-2 dt:mt-[17px] dt:gap-[9px]">
              {SOCIAL.map((item) => (
                <li key={item.key}>
                  <SiteLink href="#" label={item.name} iconOnly className="grid size-10 place-items-center rounded-full text-[var(--vd-indigo)] transition-colors hover:bg-[var(--vd-bluegray)] dt:size-[34px]">
                    <span aria-hidden="true" className="block size-[22px]">
                      {item.glyph}
                    </span>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label={t(COPY.footerNav)} className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:col-span-2 dt:contents">
            {columns.map((column) => (
              <div key={column.title.en} className="dt:pt-[3px]">
                <h2 className="vd-lg font-semibold text-[var(--vd-ink)] dt:leading-[22px]">{t(column.title)}</h2>
                <ul className="mt-3 space-y-2 dt:mt-[11px] dt:space-y-[5px]">
                  {column.links.map((item) => (
                    <li key={item.label} className="dt:leading-[22px]">
                      <SiteLink href={item.href} label={item.label} className={linkClass}>
                        {item.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[var(--vd-line)] pb-8 pt-5 dt:mx-2 dt:mt-[37px] dt:pb-[47px] dt:pt-[19px]">
          <p className="vd-md text-[var(--vd-muted)] dt:text-[15px] dt:leading-[22px]">{t(COPY.copyright)}</p>
          <ul aria-label={t(COPY.legal)} className="flex items-center">
            <li>
              <SiteLink href="#" label={t(COPY.terms)} className={linkClass}>
                {t(COPY.terms)}
              </SiteLink>
            </li>
            <li aria-hidden="true" className="mx-5 h-5 w-px bg-[var(--vd-indigo)]/60 dt:mx-[24px]" />
            <li>
              <SiteLink href="#" label={t(COPY.privacy)} className={linkClass}>
                {t(COPY.privacy)}
              </SiteLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
