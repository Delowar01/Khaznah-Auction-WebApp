import { SaudiCommerceAuction } from "@/components/concept-d/saudi-commerce/auction/SaudiCommerceAuction";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_AUCTION } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "auction", lang);
}

// Auction detail in the approved Contemporary Saudi Commerce design, with the home page's own
// chrome (outside the (round2) group, so no earlier-prototype note). The
// bare /auction address shows the featured lot, as before.
export default function Page() {
  return <SaudiCommerceAuction slug={FEATURED_AUCTION} />;
}
