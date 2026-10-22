"use client";

// The app-wide 404 (app/global-not-found.js) for an Option 3 address shows
// Option 3's branded page, in the address's language; every other address
// keeps the preview's own message (`children`). The branded page is loaded
// in the browser only — the static export serves this same 404 page for any
// unknown address, so the switch has to read the address there.
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const Option3NotFound = dynamic(() => import("@/components/concept-c/visual-discovery/content/Option3NotFound").then((module) => module.Option3NotFound), { ssr: false });

const OPTION3 = /^\/(en|ar)\/concept-c(\/|$)/;
const subscribe = () => () => {};
const option3Lang = () => window.location.pathname.match(OPTION3)?.[1] ?? "";

export function GlobalNotFoundSwitch({ children }) {
  const lang = useSyncExternalStore(subscribe, option3Lang, () => "");
  return lang ? <Option3NotFound lang={lang} /> : children;
}

/** Pre-paint: hide the preview's own message on an Option 3 address until the branded page arrives. */
export const OPTION3_PREPAINT = `(function(){try{if(${OPTION3}.test(location.pathname))document.documentElement.dataset.o3nf="1"}catch(e){}})();`;
