"use client";

import { useState } from "react";
import { BellRing, Mail } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { NEWSLETTER } from "@/data/site";
import { Container } from "../ui/Layout";
import { TextField } from "../ui/Controls";
import { Button } from "../ui/Button";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Weekly closing-soon alerts sign-up (validates, then confirms with a toast). */
export function Newsletter() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError(ui("invalidEmail"));
      return;
    }
    setError(null);
    setEmail("");
    toast({ tone: "success", title: ui("subscribed"), description: t(NEWSLETTER.title) });
  };

  return (
    <section aria-labelledby="alerts-title" className="pb-16 md:pb-20">
      <Container>
        <div className="d-panel relative overflow-hidden p-6 sm:p-8">
          <div aria-hidden="true" className="d-glow pointer-events-none absolute -start-24 -top-32 size-96" />
          <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center">
            <div className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent/14 text-auction ring-1 ring-inset ring-accent/30">
                <BellRing aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 id="alerts-title" className="d-tight text-xl font-semibold text-fg sm:text-2xl">
                  {t(NEWSLETTER.title)}
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-fg-2 sm:text-[15px]">{t(NEWSLETTER.text)}</p>
              </div>
            </div>
            <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <TextField
                label={ui("email")}
                hideLabel
                type="email"
                autoComplete="email"
                placeholder={t(NEWSLETTER.placeholder)}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                error={error}
                prefix={<Mail aria-hidden="true" className="size-4 shrink-0 text-fg-3" />}
                className="flex-1"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0">
                {t(NEWSLETTER.cta)}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
