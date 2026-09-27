"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DiscoveryContext = createContext(null);

/** Open layer on the Option 4 home ("discover" drawer, "cart" drawer) and the delivery city. */
export function DiscoveryProvider({ children }) {
  const [layer, setLayer] = useState(null);
  const [city, setCity] = useState("riyadh");
  const open = useCallback((name) => setLayer(name), []);
  const close = useCallback(() => setLayer(null), []);
  const value = useMemo(() => ({ layer, open, close, city, setCity }), [layer, open, close, city]);
  return <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>;
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error("useDiscovery must be used inside <DiscoveryProvider>");
  return context;
}
