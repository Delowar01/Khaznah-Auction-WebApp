"use client";

import { useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useDismiss } from "@/components/shared/ui/hooks";
import { CITIES } from "@/data/sellers";
import { Radio } from "../ui/Choice";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";

/** City radio list, reused by the desktop popover and the mobile menu. */
export function CityPicker({ onPicked, name = "kb-city" }) {
  const { t, ui } = useLang();
  const { city, setCity } = useChrome();
  const { toast } = useStore();
  const pick = (value) => {
    setCity(value);
    const cityName = t(CITIES[value]);
    toast({ tone: "success", title: t(COPY.citySet, { city: cityName }), description: t(COPY.citySetText, { city: cityName }) });
    onPicked?.();
  };
  return (
    <div>
      <div role="radiogroup" aria-label={t(COPY.chooseCity)} className="grid gap-0.5">
        {Object.entries(CITIES).map(([key, label]) => (
          <Radio key={key} name={name} value={key} checked={city === key} onChange={pick}>
            {t(label)}
          </Radio>
        ))}
      </div>
      <p className="mt-2 border-t border-line pt-2 kb-xs text-fg-3">{ui("deliveryText")}</p>
    </div>
  );
}

/** "Deliver to: Riyadh ▾" in the utility strip. */
export function DeliverTo() {
  const { t, ui } = useLang();
  const { city } = useChrome();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, () => setOpen(false), ref);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 items-center gap-1.5 rounded-md px-1.5 transition-colors hover:bg-white/10"
      >
        <MapPin aria-hidden="true" className="size-3.5 text-accent" />
        <span className="opacity-75">{ui("deliverTo")}:</span>
        <span className="font-bold">{t(CITIES[city])}</span>
        <ChevronDown aria-hidden="true" className={cx("size-3.5 opacity-70 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={t(COPY.chooseCity)}
          className="kb-focus-reset kz-fade-up absolute start-0 top-[calc(100%+8px)] z-[60] w-72 rounded-xl border border-line bg-elevated p-3 text-fg shadow-overlay"
        >
          <p className="mb-2 px-1.5 kb-sm font-bold">{t(COPY.chooseCity)}</p>
          <CityPicker onPicked={() => setOpen(false)} name="kb-city-desktop" />
        </div>
      ) : null}
    </div>
  );
}
