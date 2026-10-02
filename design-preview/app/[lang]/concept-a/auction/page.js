import { PremiumModernAuction } from "@/components/concept-a/premium-modern/auction/PremiumModernAuction";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_AUCTION } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "auction", lang);
}

// Auction detail in the approved Premium Modern design, with the home page's own
// chrome (outside the (round2) group, so no earlier-prototype note). The
// bare /auction address shows the featured lot, as before.
export default function Page() {
  return <PremiumModernAuction slug={FEATURED_AUCTION} />;
}
