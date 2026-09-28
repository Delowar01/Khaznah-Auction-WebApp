"use client";

import Link from "next/link";
import { useId } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { SiteLink, useNewsletterForm } from "@/components/shared/r3/home";
import { COPY } from "./copy";
import { SaudiLanguage } from "./Header";
import { btn } from "./ui";

/** One forest-green band: newsletter at the start, link groups and legal at the end. */
export function GreenFooter() {
  const { t } = useLang();
  const titleId = useId();
  const { email, setEmail, error, onSubmit } = useNewsletterForm(t(COPY.newsTitle));
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
  const linkClass = "sc-link sc-md text-white/90 hover:text-white dt:text-[16px]";
  return (
    <div data-ref="15" className="bg-[var(--sc-deep)] text-white">
      <div className="sc-container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] dt:h-[239px] dt:grid-cols-[596px_minmax(0,1fr)] dt:gap-0 dt:py-0">
        <section aria-labelledby={titleId} className="dt:pt-[42px]">
          <h2 id={titleId} className="sc-news text-white">
            {t(COPY.newsTitle)}
          </h2>
          <p className="mt-1.5 sc-lg text-white/90 dt:mt-[8px] dt:text-[17px]">{t(COPY.newsText)}</p>
          <form noValidate onSubmit={onSubmit} className="mt-4 max-w-[510px] dt:mt-[20px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-[13px]">
              <label className="min-w-0 sm:flex-1">
                <span className="sr-only">{t(COPY.emailLabel)}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t(COPY.emailPlaceholder)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${titleId}-error` : undefined}
                  className="sc-search h-[50px] w-full rounded-[7px] bg-white px-5 sc-md text-[var(--sc-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--sc-sage)] dt:h-[52px] dt:text-[15px]"
                />
              </label>
              <button type="submit" className={btn("sage", "lg", "h-[50px] sm:w-[140px] sm:px-0 dt:h-[52px] dt:text-[17px]")}>
                {t(COPY.subscribe)}
              </button>
            </div>
            <p id={`${titleId}-error`} role="alert" className="mt-1.5 min-h-4 sc-xs font-semibold text-[#ffd0cc] empty:mt-0 empty:min-h-0">
              {error}
            </p>
          </form>
        </section>
        <nav aria-label={t(COPY.footerNav)} className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 dt:grid-cols-[215px_219px_203px_minmax(0,1fr)] dt:gap-0 dt:pt-[46px]">
          {columns.map((column) => (
            <div key={column.title.en}>
              <h2 className="sc-lg font-bold text-white">{t(column.title)}</h2>
              <ul className="mt-2.5 space-y-2 dt:mt-[12px] dt:space-y-[8px]">
                {column.links.map((item) => (
                  <li key={item.label} className="dt:leading-[23px]">
                    <SiteLink href={item.href} label={item.label} className={linkClass}>
                      {item.label}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="sm:border-s sm:border-white/25 sm:ps-6 dt:mb-[40px] dt:ps-[46px] dt:pt-[35px]">
            <h2 className="sr-only">{t(COPY.legal)}</h2>
            <ul className="space-y-2 dt:space-y-[8px]">
              <li className="dt:leading-[23px]">
                <SiteLink href="#" label={t(COPY.terms)} className={linkClass}>
                  {t(COPY.terms)}
                </SiteLink>
              </li>
              <li className="dt:leading-[23px]">
                <SiteLink href="#" label={t(COPY.privacy)} className={linkClass}>
                  {t(COPY.privacy)}
                </SiteLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

/** White base: the original logo, copyright and language. */
export function BrandBase() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <div data-ref="16" className="bg-white">
      <div className="sc-container flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6 dt:h-[120px] dt:py-0 dt:ps-[45px]">
        <Link href={link("/")} className="rounded-[6px] outline-offset-4">
          <Logo variant="lockup" title={t(COPY.home)} className="h-14 w-auto dt:h-[75px]" />
        </Link>
        <div className="flex flex-wrap items-center gap-x-11 gap-y-2">
          <p className="sc-md text-[var(--sc-ink)] dt:text-[16px]">{t(COPY.copyright)}</p>
          <SaudiLanguage />
        </div>
      </div>
    </div>
  );
}
