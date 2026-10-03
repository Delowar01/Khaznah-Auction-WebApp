import { VisualDiscoveryLive } from "@/components/concept-c/visual-discovery/live/VisualDiscoveryLive";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "live", lang);
}

// Live auction in the approved Visual Discovery design, with the home page's
// own chrome (outside the (round2) group, so no earlier-prototype note).
export default function Page() {
  return <VisualDiscoveryLive />;
}
