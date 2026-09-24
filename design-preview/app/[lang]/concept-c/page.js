import { HomePage } from "@/components/concept-c/pages/HomePage";
import { conceptMetadata } from "@/lib/meta";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return conceptMetadata("c", "home", lang);
}

export default function Page() {
  return <HomePage />;
}
