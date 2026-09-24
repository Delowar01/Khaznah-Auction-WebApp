"use client";

import { useId, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { NEWSLETTER } from "@/data/site";
import { Button } from "../ui/Button";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Closing-soon alerts sign-up with inline validation. */
export function Newsletter() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const inputId = useId();
  const errorId = useId();

  const submit = (event) => {
    event.preventDefault();
    if (!EMAIL.test(value.trim())) {
      setError(true);
      return;
    }
    setError(false);
    setValue("");
    toast({ tone: "success", title: ui("subscribed"), description: t(NEWSLETTER.title) });
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-md">
      <p className="font-semibold text-fg">{t(NEWSLETTER.title)}</p>
      <p className="mt-1 text-sm text-fg-2">{t(NEWSLETTER.text)}</p>
      <div className="mt-4 flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          {ui("email")}
        </label>
        <input
          id={inputId}
          type="email"
          inputMode="email"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(false);
          }}
          placeholder={t(NEWSLETTER.placeholder)}
          aria-invalid={error || undefined}
          aria-describedby={error ? errorId : undefined}
          className="c-input min-w-0 flex-1"
        />
        <Button type="submit" variant="gold">
          {t(NEWSLETTER.cta)}
        </Button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-danger">
          <TriangleAlert aria-hidden="true" className="size-4" />
          {ui("invalidEmail")}
        </p>
      ) : null}
    </form>
  );
}
