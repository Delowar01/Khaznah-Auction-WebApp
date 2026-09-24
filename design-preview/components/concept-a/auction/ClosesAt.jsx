"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useElapsed } from "@/lib/clock";

// Wall-clock time when the page's shared countdown clock started. Read once
// on the client (null on the server) so absolute times never mismatch during
// hydration.
let anchor = null;
const subscribe = () => () => {};
const getSnapshot = () => {
  if (anchor === null) anchor = Date.now();
  return anchor;
};
const getServerSnapshot = () => null;

/** Absolute close/open time ("Closes Thu 25 Sep, 21:14"), rendered after hydration. */
export function ClosesAt({ seconds, label, className = "" }) {
  const start = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const elapsed = useElapsed();
  const { lang, t } = useLang();
  if (start === null || seconds == null) {
    return (
      <span className={className} aria-hidden="true">
        &nbsp;
      </span>
    );
  }
  const at = new Date(Math.round((start + (elapsed + seconds) * 1000) / 60000) * 60000);
  const date = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Riyadh",
  }).format(at);
  return <span className={className}>{t(label, { date })}</span>;
}
