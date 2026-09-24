"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { dirOf, fill, plural, tr } from "@/lib/i18n";
import { PLURALS, UI } from "@/data/ui";
import { moneyText } from "@/lib/format";

const LangContext = createContext(null);

export function LangProvider({ lang, children }) {
  const value = useMemo(() => {
    const t = (content, vars) => (vars ? fill(tr(content, lang), vars) : tr(content, lang));
    const ui = (key, vars) => {
      const entry = UI[key];
      if (!entry) return key;
      return vars ? fill(tr(entry, lang), vars) : tr(entry, lang);
    };
    const pl = (key, n) => plural(n, PLURALS[key], lang);
    const href = (path = "") => `/${lang}${path && !path.startsWith("/") ? "/" : ""}${path}`;
    return { lang, dir: dirOf(lang), isRTL: lang === "ar", t, ui, pl, href, money: moneyText };
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem("kz-lang", lang);
    } catch {
      // storage unavailable
    }
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used inside <LangProvider>");
  return context;
}
