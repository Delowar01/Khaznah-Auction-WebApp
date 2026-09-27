"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { COMPANY_LINE, FOOTER_COLUMNS, NEWSLETTER, PAYMENT_METHODS } from "@/data/site";
import { COPY } from "./copy";
import { LangLink } from "./Header";
import { btnClass } from "./ui";

/** Newsletter band: one serif line and an email field. */
export function Newsletter() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const titleId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return (
    <section aria-labelledby={titleId} className="border-t border-line bg-surface">
      <div className="pm-container grid gap-6 py-14 lg:grid-cols-2 lg:items-end lg:gap-16 lg:py-20">
        <div>
          <p className="pm-eyebrow text-accent">{t(COPY.newsletterEyebrow)}</p>
          <h2 id={titleId} className="mt-2 pm-h2 text-fg">
            {t(NEWSLETTER.title)}
          </h2>
          <p className="mt-2 pm-md text-fg-2">{t(NEWSLETTER.text)}</p>
        </div>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
              setError(ui("invalidEmail"));
              return;
            }
            setError("");
            setEmail("");
            toast({ tone: "success", title: ui("subscribed"), description: t(NEWSLETTER.title) });
          }}
        >
          <div className="flex items-end gap-3 border-b border-fg">
            <label className="min-w-0 flex-1">
              <span className="sr-only">{t(COPY.emailLabel)}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t(NEWSLETTER.placeholder)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${titleId}-error` : undefined}
                className="h-12 w-full bg-transparent pm-md text-fg outline-none placeholder:text-fg-3"
              />
            </label>
            <button type="submit" className={btnClass("ink", "md", "mb-1.5")}>
              {t(NEWSLETTER.cta)}
            </button>
          </div>
          <p id={`${titleId}-error`} role="alert" className="mt-2 min-h-5 pm-xs text-live">
            {error}
          </p>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <footer id="pm-footer" className="bg-[#1c1a17] text-[#ece8e1] [--logo-mark:#cfae7e] [--logo-word:#f2efe9]">
      <div className="pm-container py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <Link href={link("/")} className="inline-block rounded-sm outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-10 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs pm-sm text-[#c9c2b7]">{t(COPY.footerTag)}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title.en}>
                <h2 className="pm-label text-[#a9a196]">{t(column.title)}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((item) => (
                    <li key={item.label.en}>
                      <Link href={item.href.startsWith("/") ? link(item.href) : item.href} className="pm-sm text-[#ece8e1] hover:underline">
                        {t(item.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-5 border-t border-white/12 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pm-xs text-[#a9a196]">{t(COPY.weAccept)}</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} className="inline-flex h-7 items-center rounded-control border border-white/20 px-2.5 text-[11px] font-semibold tracking-wide text-[#ece8e1]">
                {method}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pm-xs text-[#a9a196]">
            <span>{t(COPY.country)}</span>
            <LangLink className="font-semibold text-[#ece8e1] hover:underline" />
            <span>{t(COMPANY_LINE)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
