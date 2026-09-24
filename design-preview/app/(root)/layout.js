import "../globals.css";

export const metadata = {
  title: "Khazna — Customer Website Concepts",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/khazna-mark.svg" },
};

export default function RootRedirectLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
