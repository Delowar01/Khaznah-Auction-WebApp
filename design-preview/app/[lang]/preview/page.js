import { Suspense } from "react";
import { DevicePreview } from "@/components/shared/presentation/DevicePreview";

export const metadata = { title: "Device preview" };

export default async function PreviewPage({ params }) {
  const { lang } = await params;
  return (
    <Suspense fallback={<div className="h-dvh bg-[#0b0d12]" />}>
      <DevicePreview lang={lang} />
    </Suspense>
  );
}
