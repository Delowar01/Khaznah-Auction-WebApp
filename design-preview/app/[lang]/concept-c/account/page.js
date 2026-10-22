import { VisualDiscoveryAccount } from "@/components/concept-c/visual-discovery/account/AccountPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "account", lang);
}

export default function Page() {
  return <VisualDiscoveryAccount />;
}
