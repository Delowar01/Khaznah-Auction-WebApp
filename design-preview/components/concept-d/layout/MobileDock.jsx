"use client";

import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useCopy } from "../lib/useCopy";
import { WithSection } from "./ChromeContext";
import { SECTIONS } from "./nav";

/** Bottom dock (< 1024px) with a raised, pulsing Live button in the centre. */
export function MobileDock() {
  const { link } = useConcept();
  const { t } = useLang();
  const c = useCopy();
  return (
    <nav aria-label={c("primaryNav")} className="d-glass fixed inset-x-0 bottom-0 z-40 border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden">
      <WithSection>
        {(active) => (
          <ul className="mx-auto grid h-16 max-w-lg grid-cols-5 items-stretch px-1">
            {SECTIONS.map((section) => {
              const isActive = active === section.key;
              if (section.key === "live") {
                return (
                  <li key={section.key} className="relative flex justify-center">
                    <Link
                      href={link(section.path)}
                      aria-current={isActive ? "page" : undefined}
                      className="absolute -top-5 flex flex-col items-center gap-1"
                    >
                      <span className="relative grid size-14 place-items-center rounded-full bg-[var(--d-live-fill)] text-[var(--d-ov-fg)] shadow-[0_10px_28px_-8px_var(--live)] ring-4 ring-bg">
                        <section.icon aria-hidden="true" className="size-6" />
                        <span aria-hidden="true" className="kz-live-dot absolute end-1.5 top-1.5 ring-2 ring-[var(--d-live-fill)] [--live:var(--d-ov-fg)]" />
                      </span>
                      <span className={`text-[11px] font-semibold ${isActive ? "text-fg" : "text-fg-2"}`}>{t(section.label)}</span>
                    </Link>
                  </li>
                );
              }
              return (
                <li key={section.key} className="flex">
                  <Link
                    href={link(section.path)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${isActive ? "text-fg" : "text-fg-2 hover:text-fg"}`}
                  >
                    {isActive ? <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 rounded-full bg-[var(--d-ink)]" /> : null}
                    <section.icon aria-hidden="true" className={`size-5 ${isActive ? "d-ink" : ""}`} />
                    <span className="max-w-full truncate px-0.5">{t(section.label)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </WithSection>
    </nav>
  );
}
