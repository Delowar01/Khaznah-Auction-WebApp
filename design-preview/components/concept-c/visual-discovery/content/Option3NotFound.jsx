"use client";

// The branded 404 for an Option 3 address that matches no route at all (an
// unknown seller code or lot, any other unknown path). Next answers those
// with the app-wide page (app/global-not-found.js), outside every layout,
// so this brings what the Option 3 layouts normally provide: the language
// (from the address), the fonts, the preview store, the Option 3 shell and
// styles.
// Loaded only for Option 3 addresses (GlobalNotFoundSwitch).
import "@/styles/concept-c.css";
import "@/styles/r3-visual-discovery.css";
import { useLayoutEffect } from "react";
import { fontVariables } from "@/app/fonts";
import { ConceptShell } from "@/components/shared/presentation/ConceptShell";
import { LangProvider } from "@/components/shared/providers/LangProvider";
import { MotionRoot } from "@/components/shared/providers/MotionRoot";
import { PreviewStore } from "@/components/shared/providers/PreviewStore";
import { dirOf } from "@/lib/i18n";
import { VisualDiscoveryNotFound } from "./NotFoundPage";

export function Option3NotFound({ lang }) {
  // What the [lang] layout and its pre-paint script set on <html>.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dirOf(lang);
    root.dataset.concept = "c";
    root.dataset.r3 = "1";
    root.classList.add(...fontVariables.split(" ").filter(Boolean));
    try {
      if (localStorage.getItem("kz-pbar") === "hidden") root.dataset.pbar = "hidden";
    } catch {}
  }, [lang]);
  return (
    <LangProvider lang={lang}>
      <PreviewStore>
        <MotionRoot>
          <ConceptShell concept="c" defaultTheme="light">
            <VisualDiscoveryNotFound />
          </ConceptShell>
        </MotionRoot>
      </PreviewStore>
    </LangProvider>
  );
}
