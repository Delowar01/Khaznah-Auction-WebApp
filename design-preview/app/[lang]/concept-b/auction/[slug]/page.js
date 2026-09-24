import { AuctionPage } from "@/components/concept-b/pages/AuctionPage";
import { conceptMetadata } from "@/lib/meta";
import { PRODUCTS, getProduct } from "@/data/products";
import { tr } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.saleType !== "buy_now").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  return conceptMetadata("b", "auction", lang, tr(getProduct(slug)?.title, lang));
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <AuctionPage slug={slug} />;
}
