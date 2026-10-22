"use client";

import { SellerError } from "@/components/concept-c/visual-discovery/content/Boundaries";

// Production's seller/[code]/error.js: retry, or browse every listing (never unfiltered results).
export default function Error({ reset }) {
  return <SellerError reset={reset} />;
}
