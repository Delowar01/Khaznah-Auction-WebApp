import { SellerPage } from "@/components/concept-a/pages/SellerPage";
import { conceptMetadata } from "@/lib/meta";
import { SELLERS, getSeller } from "@/data/sellers";
import { tr } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return SELLERS.map((s) => ({ code: s.code }));
}

export async function generateMetadata({ params }) {
  const { lang, code } = await params;
  return conceptMetadata("a", "seller", lang, tr(getSeller(code)?.name, lang));
}

export default async function Page({ params }) {
  const { code } = await params;
  return <SellerPage code={code} />;
}
