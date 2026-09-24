"use client";

import { useLayoutEffect } from "react";
import { ConceptProvider } from "@/components/shared/providers/ConceptProvider";
import { PresentationBar } from "./PresentationBar";
import { Toaster } from "@/components/shared/ui/Toaster";

/**
 * Wraps one concept: scopes design tokens (html[data-concept]), restores the
 * concept's own light/dark preference, and renders the presentation chrome.
 * The pre-paint script in the root layout does the same on first load, so
 * there is no flash; this effect covers client-side navigation.
 */
export function ConceptShell({ concept, defaultTheme = "light", toasterClassName = "", children }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.concept = concept;
    let theme = defaultTheme;
    try {
      theme = localStorage.getItem(`kz-theme-${concept}`) || defaultTheme;
    } catch {
      // storage unavailable — keep the concept default
    }
    const fromUrl = new URLSearchParams(window.location.search).get("theme");
    if (fromUrl === "dark" || fromUrl === "light") theme = fromUrl;
    root.dataset.theme = theme;
    return () => {
      delete root.dataset.concept;
      root.dataset.theme = "light";
    };
  }, [concept, defaultTheme]);

  return (
    <ConceptProvider concept={concept}>
      <PresentationBar concept={concept} />
      <div className="pt-pbar min-h-dvh bg-bg font-sans text-fg">{children}</div>
      <Toaster className={toasterClassName} />
    </ConceptProvider>
  );
}
