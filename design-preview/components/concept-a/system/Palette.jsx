"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useHydrated } from "@/components/shared/ui/hooks";
import { toggleTheme } from "@/components/shared/presentation/PresentationBar";
import { COPY } from "../copy";

const TOKENS = [
  { v: "--bg", name: { en: "Paper", ar: "الورق" } },
  { v: "--surface", name: { en: "Surface", ar: "السطح" } },
  { v: "--surface-2", name: { en: "Stone", ar: "الحجر" } },
  { v: "--plate", name: { en: "Plate", ar: "لوح العرض" } },
  { v: "--border", name: { en: "Hairline", ar: "الخط الرفيع" } },
  { v: "--text-primary", name: { en: "Ink", ar: "الحبر" } },
  { v: "--text-secondary", name: { en: "Graphite", ar: "الغرافيت" } },
  { v: "--primary", name: { en: "Khazna indigo", ar: "نيلي خزنة" } },
  { v: "--accent", name: { en: "Antique brass", ar: "النحاس العتيق" } },
  { v: "--stage", name: { en: "Stage", ar: "المسرح" } },
  { v: "--live", name: { en: "Live", ar: "مباشر" } },
  { v: "--success", name: { en: "Success", ar: "نجاح" } },
  { v: "--warning", name: { en: "Warning", ar: "تنبيه" } },
  { v: "--danger", name: { en: "Danger", ar: "خطر" } },
];

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function useTheme() {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || "light", () => "light");
}

export function Palette() {
  const { t } = useLang();
  const theme = useTheme();
  const hydrated = useHydrated();
  const styles = hydrated ? getComputedStyle(document.documentElement) : null;

  return (
    <div>
      <div className="mb-8 inline-flex rounded-control border border-line-strong p-1" role="group" aria-label={t(COPY.sysPalette)}>
        {[
          ["light", Sun, COPY.viewLight],
          ["dark", Moon, COPY.viewDark],
        ].map(([value, Icon, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={theme === value}
            onClick={() => theme !== value && toggleTheme("a")}
            className={`inline-flex h-9 items-center gap-2 rounded-xs px-4 text-[13px] font-medium transition-colors ${theme === value ? "bg-secondary text-on-secondary" : "text-fg-2 hover:text-fg"}`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {t(label)}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
        {TOKENS.map((token) => (
          <li key={token.v}>
            <span className="block aspect-[4/3] rounded-card border border-line shadow-card" style={{ background: `var(${token.v})` }} />
            <p className="mt-3 text-sm font-semibold text-fg">{t(token.name)}</p>
            <p dir="ltr" className="mt-0.5 text-[12px] uppercase text-fg-3 tabular rtl:text-end">
              {styles ? styles.getPropertyValue(token.v).trim() || "—" : " "}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
