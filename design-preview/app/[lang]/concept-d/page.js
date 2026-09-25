import { AuctionHome } from "@/components/concept-d/r3/AuctionHome";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "home", lang);
}

export default function Page() {
  return <AuctionHome />;
}
