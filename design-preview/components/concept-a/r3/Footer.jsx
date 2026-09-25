"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, Globe2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { BRAND, COMPANY_LINE, FOOTER_COLUMNS, NEWSLETTER, PAYMENT_METHODS } from "@/data/site";
import { COPY } from "./copy";
import { LangLink } from "./Header";

function Newsletter() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(ui("invalidEmail"));
      return;
    }
    setError("");
    setEmail("");
    toast({ tone: "success", title: ui("subscribed"), description: t(NEWSLETTER.text) });
  };
  return (
    <form onSubmit={submit} noValidate className="mx-auto mt-8 w-full max-w-[520px]">
      <p className="vm-lg font-bold">{t(NEWSLETTER.title)}</p>
      <p className="mt-1 vm-sm opacity-70">{t(NEWSLETTER.text)}</p>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 p-1.5 ps-5 ring-1 ring-white/15 focus-within:ring-white/60">
        <label htmlFor={id} className="sr-only">
          {t(COPY.emailLabel)}
        </label>
        <input
          id={id}
          type="email"
          autoComplete="email"
          dir="ltr"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          placeholder={t(NEWSLETTER.placeholder)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent vm-md text-inherit outline-none placeholder:text-white/55 rtl:text-right"
        />
        <button type="submit" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 vm-sm font-bold text-[#181614] transition-colors hover:bg-white/90">
          {t(NEWSLETTER.cta)}
          <ArrowRight aria-hidden="true" className="flip-rtl size-4" />
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 vm-sm font-semibold text-[#ffb4a8]">
          {error}
        </p>
      ) : null}
    </form>
  );
}

/** Centred footer: stacked logo, sign-up, link columns, country · language · payments. */
export function Footer() {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <footer id="vm-footer" className="bg-[#181614] text-[#f4f1ec]" style={{ "--logo-word": "#f4f1ec" }}>
      <div className="vm-container pb-8 pt-16 text-center lg:pt-20">
        <Logo variant="stacked" title={t(BRAND.name)} className="mx-auto h-24 w-auto" />
        <p className="mx-auto mt-5 max-w-md vm-md opacity-75">{t(COPY.footerTag)}</p>
        <Newsletter />

        <div className="mx-auto mt-14 grid max-w-[980px] grid-cols-2 gap-x-6 gap-y-10 text-start md:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title.en} aria-label={t(column.title)}>
              <h2 className="vm-eyebrow opacity-60">{t(column.title)}</h2>
              <ul className="mt-3 grid gap-2">
                {column.links.map((item) => (
                  <li key={item.label.en}>
                    <Link href={item.href.startsWith("#") ? item.href : link(item.href)} className="vm-sm opacity-85 underline-offset-4 hover:underline hover:opacity-100">
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-6 lg:flex-row lg:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 vm-sm">
            <span className="inline-flex items-center gap-1.5 opacity-80">
              <Globe2 aria-hidden="true" className="size-4" />
              {t(COPY.countryLine)}
            </span>
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
            <LangLink className="rounded-full px-2 py-1 font-bold hover:bg-white/10" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="vm-xs opacity-70">{t(COPY.weAccept)}</span>
            {PAYMENT_METHODS.map((method) => (
              <span key={method} dir="ltr" className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-extrabold tracking-wide">
                {method}
              </span>
            ))}
          </div>
          <p className="vm-xs opacity-65">{t(COMPANY_LINE)}</p>
        </div>
      </div>
    </footer>
  );
}
