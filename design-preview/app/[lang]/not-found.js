import Link from "next/link";

// Not-found pages receive no route params, so the message is bilingual.
export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#0b0d12] p-8 text-center text-[#e9eaee]">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[#8c909c]">404</p>
        <h1 className="mt-3 text-2xl font-semibold">This page isn’t part of the preview.</h1>
        <p lang="ar" dir="rtl" className="mt-2 text-xl font-semibold text-[#c9ccd5]">
          هذه الصفحة ليست ضمن المعاينة.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/en" className="inline-block rounded-lg bg-[#D8A535] px-4 py-2 font-semibold text-[#141006]">
            Back to concepts
          </Link>
          <Link href="/ar" lang="ar" className="inline-block rounded-lg border border-white/15 px-4 py-2 font-semibold text-[#e9eaee] hover:bg-white/10">
            العودة إلى المفاهيم
          </Link>
        </div>
      </div>
    </main>
  );
}
