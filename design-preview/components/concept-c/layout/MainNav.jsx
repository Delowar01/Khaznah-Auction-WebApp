"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { NAV } from "@/data/site";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";
import { useActiveNav, useSiteLink } from "./nav";

function NavList({ active }) {
  const { t } = useLang();
  const { resolve, onNavigate } = useSiteLink();
  return (
    <ul className="flex items-center gap-1 xl:gap-2">
      {NAV.map((item) => {
        const isActive = item.key === active;
        return (
          <li key={item.key}>
            <Link
              href={resolve(item.href)}
              onClick={onNavigate(item.href)}
              aria-current={isActive ? "page" : undefined}
              className={cx(
                "group relative flex h-11 items-center gap-2 rounded-control px-3 text-[0.9375rem] font-medium transition-colors",
                isActive ? "text-fg" : "text-fg-2 hover:text-fg",
              )}
            >
              {item.key === "live" ? <Diamond variant="live" size={7} /> : null}
              {t(item.label)}
              <Diamond
                size={6}
                className={cx(
                  "absolute -bottom-1 left-1/2 -translate-x-1/2 text-accent transition-all duration-300",
                  isActive ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-60",
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavList() {
  return <NavList active={useActiveNav()} />;
}

/** Centred primary navigation with a diamond marking the active section. */
export function MainNav({ className = "" }) {
  const { t } = useLang();
  return (
    <nav aria-label={t(COPY.mainNav)} className={className}>
      <Suspense fallback={<NavList active={null} />}>
        <ActiveNavList />
      </Suspense>
    </nav>
  );
}
