"use client";

import { useId, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { NEWSLETTER } from "@/data/site";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

export function Newsletter() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(ui("invalidEmail"));
      return;
    }
    setError("");
    setEmail("");
    toast({ tone: "success", title: ui("subscribed"), description: t(COPY.newsletterDone) });
  };

  return (
    <section className="mx-auto max-w-[1360px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
      <div className="grid gap-10 rounded-card border border-line bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
        <div>
          <h2 className="a-display text-[34px] text-fg sm:text-[44px] rtl:sm:text-[38px]">{t(NEWSLETTER.title)}</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-fg-2 rtl:leading-8">{t(NEWSLETTER.text)}</p>
        </div>
        <form onSubmit={submit} noValidate className="w-full">
          <label htmlFor={id} className="a-eyebrow">
            {ui("email")}
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id={id}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder={t(NEWSLETTER.placeholder)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className={`h-[52px] min-w-0 flex-1 rounded-control border bg-bg px-4 text-[15px] text-fg outline-none transition-colors placeholder:text-fg-3 focus:border-fg ${error ? "border-danger" : "border-line-strong"}`}
            />
            <Button type="submit" size="lg">
              {t(NEWSLETTER.cta)}
            </Button>
          </div>
          <p id={`${id}-error`} role={error ? "alert" : undefined} className={`mt-2 min-h-5 text-[13px] text-danger ${error ? "" : "invisible"}`}>
            {error || "—"}
          </p>
        </form>
      </div>
    </section>
  );
}
