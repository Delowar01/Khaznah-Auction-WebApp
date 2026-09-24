"use client";

import { useEffect, useState } from "react";
import { BrowseView } from "../browse/BrowseView";
import { BROWSE_NAV_EVENT } from "../utils/navigation";

export function BrowsePage() {
  // The browse engine reads the URL when it mounts. In-page navigation
  // (header search, mega menu, back/forward) remounts it with the new URL.
  const [navKey, setNavKey] = useState(0);

  useEffect(() => {
    const remount = () => setNavKey((k) => k + 1);
    window.addEventListener(BROWSE_NAV_EVENT, remount);
    window.addEventListener("popstate", remount);
    return () => {
      window.removeEventListener(BROWSE_NAV_EVENT, remount);
      window.removeEventListener("popstate", remount);
    };
  }, []);

  return <BrowseView key={navKey} />;
}
