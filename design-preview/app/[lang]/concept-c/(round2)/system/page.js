import { SystemPage } from "@/components/concept-c/pages/SystemPage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "system", lang);
}

export default function Page() {
  return <SystemPage />;
}
