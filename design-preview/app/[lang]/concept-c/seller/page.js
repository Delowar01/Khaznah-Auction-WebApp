import { SellerPage } from "@/components/concept-c/pages/SellerPage";
import { conceptMetadata } from "@/lib/meta";
import { FEATURED_SELLER } from "@/data/sellers";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "seller", lang);
}

export default function Page() {
  return <SellerPage code={FEATURED_SELLER} />;
}
