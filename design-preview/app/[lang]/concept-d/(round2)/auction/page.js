import { AuctionPage } from "@/components/concept-d/pages/AuctionPage";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_AUCTION } from "@/data/products";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "auction", lang);
}

export default function Page() {
  return <AuctionPage slug={FEATURED_AUCTION} />;
}
