"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "./copy";
import { UtilityBar } from "./layout/UtilityBar";
import { SiteHeader } from "./layout/SiteHeader";
import { SiteFooter } from "./layout/SiteFooter";

/** Concept C site chrome: skip link, utility line, sticky header (+ mobile menu), main, footer. */
export function Chrome({ children }) {
  const { t } = useLang();
  return (
    <div className="flex min-h-[calc(100dvh-var(--pbar-h))] flex-col">
      <a href="#main" className="c-skip">
        {t(COPY.skip)}
      </a>
      <UtilityBar />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
