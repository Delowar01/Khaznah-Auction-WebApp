"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { UtilityBar } from "./layout/UtilityBar";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ChromeProvider } from "./layout/ChromeContext";

const SKIP = { en: "Skip to content", ar: "تخطَّ إلى المحتوى" };

export function Chrome({ children }) {
  const { t } = useLang();
  return (
    <ChromeProvider>
      <a href="#main" className="sr-only z-[500] rounded-control bg-secondary px-4 py-3 text-sm font-semibold text-on-secondary focus:not-sr-only focus:fixed focus:start-4 focus:top-[calc(var(--pbar-h)+12px)]">
        {t(SKIP)}
      </a>
      <UtilityBar />
      <Header />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
    </ChromeProvider>
  );
}
