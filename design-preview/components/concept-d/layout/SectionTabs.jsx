"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useCopy } from "../lib/useCopy";
import { WithSection } from "./ChromeContext";
import { SECTIONS } from "./nav";

/** Secondary tab row with an animated active underline (layoutId). */
export function SectionTabs() {
  const { link } = useConcept();
  const { t } = useLang();
  const c = useCopy();
  return (
    <nav aria-label={c("primaryNav")} className="-ms-3 h-full">
      <WithSection>
        {(active) => (
          <ul className="flex h-full items-stretch">
            {SECTIONS.map((section) => {
              const isActive = section.key === active;
              return (
                <li key={section.key} className="relative flex">
                  <Link
                    href={link(section.path)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center gap-2 px-3 text-[13.5px] font-medium transition-colors ${isActive ? "text-fg" : "text-fg-2 hover:text-fg"}`}
                  >
                    {section.key === "live" ? <span aria-hidden="true" className="kz-live-dot" /> : null}
                    {t(section.label)}
                    {isActive ? (
                      <motion.span
                        layoutId="d-section-underline"
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--d-ink)] shadow-[0_0_12px_var(--d-ink)]"
                        transition={{ type: "spring", stiffness: 480, damping: 40 }}
                      />
                    ) : null}
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
