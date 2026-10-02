import { VisualDiscoveryAuction } from "@/components/concept-c/visual-discovery/auction/VisualDiscoveryAuction";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_AUCTION } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "auction", lang);
}

// Auction detail in the approved Visual Discovery design, with the home page's own
// chrome (outside the (round2) group, so no earlier-prototype note). The
// bare /auction address shows the featured lot, as before.
export default function Page() {
  return <VisualDiscoveryAuction slug={FEATURED_AUCTION} />;
}
