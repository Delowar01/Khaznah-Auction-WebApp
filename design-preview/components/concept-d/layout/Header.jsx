"use client";

import { Menu } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "../ui/cx";
import { CategoryNav } from "./CategoryNav";
import { LogoLink } from "./ChromeBits";
import { useChrome } from "./ChromeContext";
import { HeaderActions } from "./HeaderActions";
import { SearchBar } from "./SearchBar";

/**
 * Sticky header. One search instance lives in a CSS grid: inline in the
 * main bar on desktop, its own full-width row on phones and tablets.
 * Scrolling down tucks the secondary row (mobile search / category nav)
 * under the main bar with a transform, so the layout never jumps.
 */
export function Header() {
  const { ui } = useLang();
  const { collapsed, open, panel } = useChrome();

  return (
    <header className="pointer-events-none sticky top-pbar z-40">
      <div aria-hidden="true" className="pointer-events-auto absolute inset-x-0 top-0 z-10 h-14 border-b border-line bg-surface lg:h-[68px]" />
      <div className="kb-container relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 lg:gap-x-8">
        <div className="pointer-events-auto relative z-20 flex h-14 items-center gap-1 lg:h-[68px]">
          <button
            type="button"
            data-testid="mobile-menu-button"
            aria-label={ui("openMenu")}
            aria-expanded={panel === "menu"}
            onClick={() => open("menu")}
            className="-ms-2 grid size-11 place-items-center rounded-control text-fg transition-colors hover:bg-surface-2 lg:hidden"
          >
            <Menu aria-hidden="true" className="size-6" strokeWidth={1.75} />
          </button>
          <LogoLink />
        </div>

        <div
          className={cx(
            "relative col-span-3 row-start-2 -mx-4 border-b border-line bg-surface px-4 py-1.5 transition-[transform,opacity] duration-300 ease-out sm:-mx-6 sm:px-6",
            "lg:z-20 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0",
            collapsed
              ? "pointer-events-none -translate-y-full opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100"
              : "pointer-events-auto",
          )}
        >
          <SearchBar className="mx-auto w-full lg:max-w-[800px]" />
        </div>

        <div className="pointer-events-auto relative z-20 col-start-3 row-start-1 flex h-14 items-center justify-end lg:h-[68px]">
          <HeaderActions />
        </div>
      </div>
      <CategoryNav collapsed={collapsed} />
    </header>
  );
}
