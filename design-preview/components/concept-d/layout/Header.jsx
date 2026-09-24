"use client";

import Link from "next/link";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/shared/brand/Logo";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Container } from "../ui/Layout";
import { useCopy } from "../lib/useCopy";
import { useChrome } from "./ChromeContext";
import { SearchTrigger } from "./SearchTrigger";
import { LivePill } from "./LivePill";
import { WalletMenu } from "./WalletMenu";
import { AccountMenu } from "./AccountMenu";
import { SectionTabs } from "./SectionTabs";
import { MarketStatus } from "./MarketStatus";

function IconButton({ label, onClick, children, className = "", ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`relative grid size-11 shrink-0 place-items-center rounded-control text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function CartButton() {
  const { cartCount } = useStore();
  const { openCart } = useChrome();
  const c = useCopy();
  return (
    <IconButton label={c("cartButton", { n: cartCount })} onClick={openCart}>
      <ShoppingCart aria-hidden="true" className="size-5" />
      {cartCount > 0 ? (
        <span className="d-num absolute end-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10.5px] font-semibold text-on-accent kz-fade-up">
          {cartCount}
        </span>
      ) : null}
    </IconButton>
  );
}

export function Header() {
  const { link } = useConcept();
  const { ui, isRTL } = useLang();
  const { openMenu, openPalette } = useChrome();
  const c = useCopy();

  return (
    <header className="d-glass sticky top-pbar z-40 border-b border-line">
      <Container className="flex h-[var(--d-header-h)] items-center gap-2 lg:gap-4">
        <IconButton label={ui("openMenu")} onClick={openMenu} className="-ms-2 lg:hidden" data-testid="mobile-menu-button">
          <Menu aria-hidden="true" className="size-5" />
        </IconButton>

        <Link href={link("/")} aria-label={c("homeLink")} className="flex shrink-0 items-center gap-2.5 rounded-md py-1">
          <Logo variant="mark" decorative className="h-8 w-auto" />
          <Logo variant={isRTL ? "wordmark-ar" : "wordmark-en"} decorative className={isRTL ? "h-5 w-auto" : "h-[13px] w-auto"} />
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
          <SearchTrigger />
        </div>
        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-1 lg:gap-2">
          <LivePill className="hidden lg:inline-flex" />
          <IconButton label={c("openSearch")} onClick={openPalette} className="md:hidden">
            <Search aria-hidden="true" className="size-5" />
          </IconButton>
          <WalletMenu className="hidden sm:block" />
          <CartButton />
          <AccountMenu className="hidden md:block" />
        </div>
      </Container>

      <div className="hidden border-t border-line lg:block">
        <Container className="flex h-11 items-center justify-between gap-6">
          <SectionTabs />
          <MarketStatus />
        </Container>
      </div>
    </header>
  );
}
