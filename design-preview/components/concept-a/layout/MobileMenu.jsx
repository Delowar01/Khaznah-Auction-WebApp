"use client";

import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Money } from "@/components/shared/ui/Money";
import { Logo } from "@/components/shared/brand/Logo";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CATEGORIES } from "@/data/categories";
import { BRAND, DEMO_USER } from "@/data/site";
import { A_NAV } from "./Header";
import { LangLink } from "./LangLink";
import { COPY } from "../copy";

export function MobileMenu({ open, onClose, onSearch }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <Drawer open={open} onClose={onClose} side="start" title={ui("menu")} panelClassName="bg-bg text-fg">
      <div data-testid="mobile-menu" className="flex h-full flex-col overflow-y-auto">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <Logo variant="lockup" className="h-7 w-auto" />
          <button type="button" onClick={onClose} aria-label={ui("closeMenu")} className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            onClose();
            onSearch();
          }}
          className="mx-5 mt-5 flex h-12 items-center gap-3 rounded-control border border-line-strong px-4 text-start text-fg-3"
        >
          <Search aria-hidden="true" className="size-5" />
          {t(COPY.searchPrompt)}
        </button>
        <nav aria-label={ui("menu")} className="px-5 pt-6">
          <ul className="divide-y divide-line border-y border-line">
            {A_NAV.map((item) => (
              <li key={item.key}>
                <Link href={link(item.path)} onClick={onClose} className="flex items-center justify-between py-4">
                  <span className="a-serif flex items-center gap-3 text-[26px] text-fg">
                    {ui(item.label)}
                    {item.live ? <span className="kz-live-dot" aria-hidden="true" /> : null}
                  </span>
                  <DirIcon icon={ArrowRight} className="size-4 text-fg-3" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-5 pt-7">
          <p className="a-eyebrow mb-3">{t(COPY.departments)}</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={link(`/browse?category=${c.slug}`)} onClick={onClose} className="block py-2 text-[15px] text-fg-2">
                  {t(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto border-t border-line px-5 py-5">
          <p className="a-serif text-lg text-fg">{t(DEMO_USER.name)}</p>
          <p className="mt-1 text-sm text-fg-3">
            {ui("walletBalance")} · <Money value={DEMO_USER.walletBalance} className="text-fg" />
          </p>
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="a-eyebrow !text-fg-3">{t(BRAND.tagline)}</span>
            <LangLink className="font-semibold text-fg underline underline-offset-4" />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
