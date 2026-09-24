"use client";

import { useState } from "react";
import { ChevronRight, LayoutGrid, Phone } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORIES } from "@/data/categories";
import { HOW_IT_WORKS } from "@/data/site";
import { Button } from "../ui/Button";
import { TextField } from "../ui/Field";
import { DialogPanel, SheetPanel } from "../ui/Panels";
import { Plate } from "../ui/Plate";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";
import { AccountSummary } from "./AccountMenu";
import { useChrome } from "./ChromeContext";
import { useAccountActions, useFirstName } from "./useAccountActions";

/** Categories sheet opened from the mobile tab bar. */
export function CategorySheet() {
  const { t, ui, pl } = useLang();
  const { panel, close } = useChrome();
  return (
    <SheetPanel open={panel === "categories"} onClose={close} title={ui("shopByCategory")}>
      <ul className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
        {CATEGORIES.map((category) => (
          <li key={category.slug}>
            <BrowseLink
              href={`/browse?category=${category.slug}`}
              onClick={close}
              className="flex flex-col overflow-hidden rounded-xl border border-line transition-colors hover:border-line-strong"
            >
              <Plate image={category.image} alt="" sizes="160px" className="aspect-[4/3]" />
              <span className="px-2.5 pb-2 pt-1.5">
                <span className="block truncate kb-sm font-bold text-fg">{t(category.name)}</span>
                <span className="block kb-2xs text-fg-3 tabular">{pl("lots", category.count)}</span>
              </span>
            </BrowseLink>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-6">
        <BrowseLink href="/browse" onClick={close} className="flex h-12 items-center justify-center gap-2 rounded-control bg-primary/10 kb-md font-bold text-primary">
          <LayoutGrid aria-hidden="true" className="size-4" />
          {ui("allLots")}
        </BrowseLink>
      </div>
    </SheetPanel>
  );
}

/** Account sheet opened from the mobile tab bar / header icon. */
export function AccountSheet() {
  const { ui } = useLang();
  const { panel, close } = useChrome();
  const actions = useAccountActions();
  return (
    <SheetPanel open={panel === "account"} onClose={close} title={ui("account")}>
      <div className="p-4">
        <AccountSummary className="rounded-xl border border-line bg-surface-2 p-3" />
        <ul className="mt-3 grid gap-0.5">
          {actions.map((action) => (
            <li key={action.key} className={action.divider ? "mt-1 border-t border-line pt-1" : undefined}>
              <button
                type="button"
                onClick={() => {
                  if (action.key !== "watchlist") close();
                  action.onSelect();
                }}
                className="flex h-12 w-full items-center gap-3 rounded-lg px-3 text-start kb-md font-semibold text-fg transition-colors hover:bg-surface-2"
              >
                <action.icon aria-hidden="true" className="size-5 text-fg-3" />
                <span className="flex-1">{action.label}</span>
                {action.count ? <span className="rounded-full bg-surface-2 px-2 kb-xs font-bold text-fg-2 tabular">{action.count}</span> : null}
                {action.money != null ? <Money value={action.money} className="kb-sm font-bold text-fg-2" /> : null}
                <DirIcon icon={ChevronRight} className="size-4 text-fg-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </SheetPanel>
  );
}

/** Mobile-number sign-in used after signing out. */
export function SignInDialog() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const { panel, close, setSignedIn } = useChrome();
  const firstName = useFirstName();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const digits = value.replace(/\D/g, "").replace(/^966/, "").replace(/^0/, "");
    if (!/^5\d{8}$/.test(digits)) {
      setError(t(COPY.invalidMobile));
      return;
    }
    setError("");
    setValue("");
    setSignedIn(true);
    close();
    toast({ tone: "success", title: t(COPY.welcomeBack, { name: firstName }) });
  };

  return (
    <DialogPanel open={panel === "signin"} onClose={close} title={t(COPY.signInTitle)}>
      <form onSubmit={submit} noValidate className="grid gap-4">
        <p className="kb-md text-fg-2">{t(COPY.signInText)}</p>
        <TextField
          label={t(COPY.mobileNumber)}
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          placeholder="5X XXX XXXX"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError("");
          }}
          error={error}
          hint={error ? undefined : t(COPY.mobileHint)}
          size="lg"
          data-autofocus
        />
        <Button type="submit" size="lg" block>
          {t(COPY.continue)}
        </Button>
        <p className="text-center kb-sm text-fg-3">
          {t(COPY.newHere)}{" "}
          <button
            type="button"
            className="font-bold text-primary underline-offset-4 hover:underline"
            onClick={() => toast({ tone: "info", title: ui("register"), description: t(HOW_IT_WORKS[0].text) })}
          >
            {ui("register")}
          </button>
        </p>
      </form>
    </DialogPanel>
  );
}
