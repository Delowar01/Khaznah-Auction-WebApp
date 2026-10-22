import { VisualDiscoverySellerRegister } from "@/components/concept-c/visual-discovery/auth/SellerRegister";
import { conceptMetadata } from "@/lib/meta";

// A static segment beside seller/[code]: /seller/register is this page
// (production's storefront route cannot use the code REGISTER either).
export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "sellerRegister", lang);
}

export default function Page() {
  return <VisualDiscoverySellerRegister />;
}
