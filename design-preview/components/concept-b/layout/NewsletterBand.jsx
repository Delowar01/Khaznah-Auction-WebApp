"use client";

import { useId, useState } from "react";
import { CircleAlert, Mail } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { NEWSLETTER } from "@/data/site";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** "Closing-soon alerts" sign-up at the top of the footer. */
export function NewsletterBand() {
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
    <div className="border-b border-white/10">
      <div className="kb-container grid items-center gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-on-accent">
            <Mail aria-hidden="true" className="size-6" />
          </span>
          <div>
            <h2 className="kb-h3">{t(NEWSLETTER.title)}</h2>
            <p className="mt-1 kb-sm opacity-75">{t(NEWSLETTER.text)}</p>
          </div>
        </div>
        <form onSubmit={submit} noValidate className="grid gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor={id} className="sr-only">
              {t(COPY.newsletterLabel)}
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
              className={cx(
                "h-12 w-full min-w-0 rounded-control border bg-white/5 px-4 kb-md text-on-secondary placeholder:text-on-secondary/55 outline-none transition-colors focus:border-accent focus:bg-white/10 sm:flex-1 rtl:text-right",
                error ? "border-danger" : "border-white/20",
              )}
            />
            <Button type="submit" variant="accent" size="lg">
              {t(NEWSLETTER.cta)}
            </Button>
          </div>
          {error ? (
            <p id={`${id}-error`} className="flex items-center gap-1.5 kb-xs font-semibold text-accent">
              <CircleAlert aria-hidden="true" className="size-3.5" />
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
