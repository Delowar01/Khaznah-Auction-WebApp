"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Mail } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { COMPANY_LINE, FOOTER_COLUMNS, NEWSLETTER, PAYMENT_METHODS } from "@/data/site";
import { COPY } from "./copy";
import { LangLink } from "./Header";

export function Footer() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  const titleId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return (
    <footer id="dc-footer" className="mt-14 border-t border-line bg-surface lg:mt-20">
      <div className="dc-container py-10 lg:py-14">
        <section aria-labelledby={titleId} className="grid gap-4 rounded-[22px] bg-[var(--dc-butter)] p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-surface">
              <Mail className="size-5 text-fg" />
            </span>
            <div>
              <h2 id={titleId} className="dc-h3 text-fg">
                {t(NEWSLETTER.title)}
              </h2>
              <p className="mt-0.5 dc-sm text-fg-2">{t(NEWSLETTER.text)}</p>
            </div>
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
            <div className="flex gap-2">
              <label className="min-w-0 flex-1">
                <span className="sr-only">{t(COPY.emailLabel)}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t(NEWSLETTER.placeholder)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${titleId}-error` : undefined}
                  className="h-12 w-full rounded-full border border-line-strong bg-surface px-5 dc-md text-fg outline-none placeholder:text-fg-3 focus:border-fg"
                />
              </label>
              <button type="submit" className="inline-flex h-12 shrink-0 items-center rounded-full bg-primary px-6 dc-sm font-bold text-on-primary hover:bg-primary-hover">
                {t(NEWSLETTER.cta)}
              </button>
            </div>
            <p id={`${titleId}-error`} role="alert" className="mt-1.5 min-h-5 px-4 dc-xs text-danger">
              {error}
            </p>
          </form>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div>
            <Link href={link("/")} className="inline-block rounded-sm outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-9 w-auto" />
            </Link>
            <p className="mt-3 max-w-xs dc-sm text-fg-2">{t(COPY.footerTag)}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title.en}>
                <h2 className="dc-kicker text-fg">{t(column.title)}</h2>
                <ul className="mt-3 space-y-2">
                  {column.links.map((item) => (
                    <li key={item.label.en}>
                      <Link href={item.href.startsWith("/") ? link(item.href) : item.href} className="dc-sm text-fg-2 hover:text-fg hover:underline">
                        {t(item.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="dc-xs text-fg-3">{t(COPY.weAccept)}</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} className="inline-flex h-7 items-center rounded-[8px] bg-surface-2 px-2.5 text-[11px] font-bold text-fg">
                {method}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 dc-xs text-fg-3">
            <span>{t(COPY.country)}</span>
            <LangLink className="font-bold text-fg hover:underline" />
            <span>{t(COMPANY_LINE)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
