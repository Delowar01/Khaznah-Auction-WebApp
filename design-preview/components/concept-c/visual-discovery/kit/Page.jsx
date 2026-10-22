"use client";

// The page shell of every Option 3 customer screen beyond the five review
// pages: the approved masthead (logo, pill search, utilities, shopping
// modes), the page, the ivory newsletter where a page asks for it, the white
// footer, and the phone menu and cart layers. Auth and payment screens use
// the quieter AuthShell instead (see AuthShell.jsx).
import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { Footer, Newsletter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";

export function SkipLink() {
  const { t } = useLang();
  return (
    <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-full bg-[var(--vd-indigo)] px-5 py-2.5 vd-md font-semibold text-white transition-transform focus:translate-y-0">
      {t(COPY.skip)}
    </a>
  );
}

/**
 * `active`: the shopping mode the header marks (see useModes in Header.jsx;
 * null marks none). `newsletter`: the ivory band above the footer, on the
 * discovery and content pages only — cart, checkout and the account keep
 * their focus.
 */
export function VDPage({ active = null, newsletter = false, children }) {
  return (
    <R3Root>
      <HomeStateProvider>
        <div className="bg-bg font-sans text-fg">
          <SkipLink />
          <Header active={active} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          {newsletter ? <Newsletter /> : null}
          <Footer />
          <Menu active={active} />
          <Cart />
        </div>
      </HomeStateProvider>
    </R3Root>
  );
}
