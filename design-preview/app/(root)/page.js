import Link from "next/link";

// Entry point: send visitors to their last-used language (English by default).
const REDIRECT = `(function(){var l="en";try{var s=localStorage.getItem("kz-lang");if(s==="ar"||s==="en")l=s;}catch(e){}location.replace("/"+l+location.search);})();`;

export default function RootPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100dvh", fontFamily: "system-ui, sans-serif", background: "#0b0d12", color: "#e9eaee" }}>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      <p style={{ display: "flex", gap: 16 }}>
        <Link href="/en" style={{ color: "#D8A535" }}>
          English
        </Link>
        <Link href="/ar" lang="ar" style={{ color: "#D8A535" }}>
          العربية
        </Link>
      </p>
    </main>
  );
}
