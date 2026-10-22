import { notFound } from "next/navigation";
import { VisualDiscoverySeller } from "@/components/concept-c/visual-discovery/seller/SellerView";
import { conceptMetadata } from "@/lib/meta";
import { SELLERS, getSeller } from "@/data/sellers";
import { tr } from "@/lib/i18n";

// Unknown seller codes 404 (production: the lookup's 404 calls notFound()).
export const dynamicParams = false;

export function generateStaticParams() {
  return SELLERS.map((s) => ({ code: s.code }));
}

export async function generateMetadata({ params }) {
  const { lang, code } = await params;
  return conceptMetadata("c", "seller", lang, tr(getSeller(code)?.name, lang));
}

export default async function Page({ params }) {
  const { code } = await params;
  const seller = getSeller(code);
  if (!seller) notFound();
  return <VisualDiscoverySeller seller={seller} />;
}
