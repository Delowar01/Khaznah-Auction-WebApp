import { VisualDiscoveryBrowse } from "@/components/concept-c/visual-discovery/browse/VisualDiscoveryBrowse";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "browse", lang);
}

// Browse in the approved Visual Discovery design, with the home page's own
// chrome (outside the (round2) group, so no earlier-prototype note).
export default function Page() {
  return <VisualDiscoveryBrowse />;
}
