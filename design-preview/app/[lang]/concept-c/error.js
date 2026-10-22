"use client";

import { PageError } from "@/components/concept-c/visual-discovery/content/Boundaries";

// A customer page that failed to render: try again (Next's reset) or go home.
export default function Error({ reset }) {
  return <PageError reset={reset} />;
}
