import { VisualDiscoveryLogin } from "@/components/concept-c/visual-discovery/auth/LoginPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "login", lang);
}

export default function Page() {
  return <VisualDiscoveryLogin />;
}
