"use client";

import { createContext, useContext, useMemo } from "react";
import { useLang } from "./LangProvider";

const ConceptContext = createContext(null);

/** Gives components the active concept id and a link builder rooted at it. */
export function ConceptProvider({ concept, children }) {
  const { lang } = useLang();
  const value = useMemo(() => {
    const base = `/${lang}/concept-${concept}`;
    const link = (path = "") => {
      if (!path || path === "/") return base;
      if (path.startsWith("#")) return path;
      return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
    };
    return { concept, base, link };
  }, [concept, lang]);
  return <ConceptContext.Provider value={value}>{children}</ConceptContext.Provider>;
}

export function useConcept() {
  const context = useContext(ConceptContext);
  if (!context) throw new Error("useConcept must be used inside <ConceptProvider>");
  return context;
}
