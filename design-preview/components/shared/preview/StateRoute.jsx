"use client";

// Reads the page's query string for the Option 3 customer pages: `?state=`
// (a preview state, see lib/previewStates.js) and the page's own production
// parameters (?tab=, ?next=, ?payment_record_id= …). Like BrowseRoute, the
// view renders once the URL is known; the static export has no query
// string, so `fallback` is what the page shows until the browser takes over.
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function Route({ children }) {
  const params = useSearchParams();
  return children(params, params.get("state") || "default");
}

/** `children(params, state)`: URLSearchParams and the preview state ("default" when absent). */
export function StateRoute({ fallback = null, children }) {
  return (
    <Suspense fallback={fallback}>
      <Route>{children}</Route>
    </Suspense>
  );
}
