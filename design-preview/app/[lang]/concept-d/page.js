import { SaudiCommerceHome } from "@/components/concept-d/saudi-commerce/SaudiCommerceHome";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("d", "home", lang);
}

export default function Page() {
  return <SaudiCommerceHome />;
}
