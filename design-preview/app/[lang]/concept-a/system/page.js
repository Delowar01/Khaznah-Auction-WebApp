import { SystemPage } from "@/components/concept-a/pages/SystemPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("a", "system", lang);
}

export default function Page() {
  return <SystemPage />;
}
