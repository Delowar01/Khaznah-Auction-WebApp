"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Which Option 2 layer is open: the full-screen Categories, Search or Menu
// overlays, or the Bag / Watchlist drawers. One at a time, like the header
// they all belong to.
const VisualContext = createContext(null);

export function VisualProvider({ children }) {
  const [layer, setLayer] = useState(null);
  const [query, setQuery] = useState("");
  const open = useCallback((name, initialQuery = "") => {
    setQuery(initialQuery);
    setLayer(name);
  }, []);
  const close = useCallback(() => setLayer(null), []);
  const value = useMemo(() => ({ layer, open, close, query }), [layer, open, close, query]);
  return <VisualContext.Provider value={value}>{children}</VisualContext.Provider>;
}

export function useVisual() {
  const context = useContext(VisualContext);
  if (!context) throw new Error("useVisual must be used inside <VisualProvider>");
  return context;
}
