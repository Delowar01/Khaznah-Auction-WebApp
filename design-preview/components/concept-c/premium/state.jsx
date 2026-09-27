"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const PremiumContext = createContext(null);

/**
 * Which layer is open on the Option 3 home: the mobile menu drawer, the bag
 * drawer, or none. Search expands in the header and keeps its own state.
 */
export function PremiumProvider({ children }) {
  const [layer, setLayer] = useState(null);
  const open = useCallback((name) => setLayer(name), []);
  const close = useCallback(() => setLayer(null), []);
  const value = useMemo(() => ({ layer, open, close }), [layer, open, close]);
  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) throw new Error("usePremium must be used inside <PremiumProvider>");
  return context;
}
