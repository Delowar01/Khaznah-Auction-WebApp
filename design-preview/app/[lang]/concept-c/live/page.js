import { redirect } from "next/navigation";

// Production's /live: a redirect to the live tab of Browse.
export default async function Page({ params }) {
  const { lang } = await params;
  redirect(`/${lang}/concept-c/browse?tab=live`);
}
