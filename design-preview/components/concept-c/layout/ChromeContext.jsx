"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useScrollHide } from "../utils/useScrollHide";

const ChromeContext = createContext(null);

/**
 * Chrome-wide UI state: which overlay is open (mini-cart, watchlist, menus),
 * the delivery city, the signed-in state and whether the header's secondary
 * rows are tucked away while scrolling.
 */
export function ChromeProvider({ children }) {
  const pathname = usePathname();
  const [panel, setPanel] = useState(null);
  const [city, setCity] = useState("riyadh");
  const [signedIn, setSignedIn] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const hidden = useScrollHide();

  // Close any open overlay when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setPanel(null);
  }

  const open = useCallback((name) => setPanel(name), []);
  const close = useCallback(() => setPanel(null), []);

  const value = useMemo(
    () => ({
      panel,
      open,
      close,
      city,
      setCity,
      signedIn,
      setSignedIn,
      collapsed: hidden && !pinned,
      setPinned,
    }),
    [panel, open, close, city, signedIn, hidden, pinned],
  );

  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  const context = useContext(ChromeContext);
  if (!context) throw new Error("useChrome must be used inside <ChromeProvider>");
  return context;
}
