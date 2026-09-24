"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ChromeContext = createContext({ bagOpen: false, setBagOpen: () => {}, openBag: () => {} });

/** Lets pages open the header's bag drawer (e.g. after "Buy it now"). */
export function ChromeProvider({ children }) {
  const [bagOpen, setBagOpen] = useState(false);
  const value = useMemo(() => ({ bagOpen, setBagOpen, openBag: () => setBagOpen(true) }), [bagOpen]);
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  return useContext(ChromeContext);
}
