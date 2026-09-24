import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#0b0d12] p-8 text-center text-[#e9eaee]">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[#8c909c]">404</p>
        <h1 className="mt-3 text-2xl font-semibold">This page isn’t part of the preview.</h1>
        <Link href="/en" className="mt-6 inline-block rounded-lg bg-[#D8A535] px-4 py-2 font-semibold text-[#141006]">
          Back to concepts
        </Link>
      </div>
    </main>
  );
}
