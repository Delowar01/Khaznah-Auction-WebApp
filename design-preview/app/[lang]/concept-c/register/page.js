import { VisualDiscoveryRegister } from "@/components/concept-c/visual-discovery/auth/RegisterPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "register", lang);
}

export default function Page() {
  return <VisualDiscoveryRegister />;
}
