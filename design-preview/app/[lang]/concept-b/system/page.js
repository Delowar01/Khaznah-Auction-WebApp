import { SystemPage } from "@/components/concept-b/pages/SystemPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("b", "system", lang);
}

export default function Page() {
  return <SystemPage />;
}
