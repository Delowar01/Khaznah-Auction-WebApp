// Every typeface used by the preview, registered once so portaled overlays
// (modals, drawers) inherit the same font variables as the page.
// Brand fonts (Archivo, Alexandria) drive the selector and presentation chrome
// and are preloaded; concept fonts use preload:false and download only on the
// routes that render them.
import {
  Alexandria,
  Almarai,
  Archivo,
  Cairo,
  Figtree,
  Fraunces,
  IBM_Plex_Sans_Arabic,
  Inter,
  JetBrains_Mono,
  Manrope,
  Readex_Pro,
  Space_Grotesk,
} from "next/font/google";

// Brand — selector, presentation chrome
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-brand-latin", display: "swap" });
const alexandria = Alexandria({ subsets: ["arabic"], variable: "--font-brand-arabic", display: "swap" });

// Option 1 — Modern Commerce (retained Concept B)
const figtree = Figtree({ subsets: ["latin"], variable: "--font-b-sans", display: "swap", preload: false });
const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"], variable: "--font-b-sans-ar", display: "swap", preload: false });

// Option 2 — Premium Commerce (slot a): elegant serif display + humanist sans
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", preload: false });
const readex = Readex_Pro({ subsets: ["arabic"], variable: "--font-readex", display: "swap", preload: false });

// Option 3 — Saudi Modern Commerce (slot c): Arabic-first Cairo + Inter for Latin
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });

// Option 4 — Auction-Forward Commerce (slot d): Space Grotesk display + Inter body,
// JetBrains Mono for countdowns/figures, IBM Plex Sans Arabic for Arabic
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap", preload: false });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet", display: "swap", preload: false });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--font-plex-ar", display: "swap", preload: false });

export const fontVariables = [
  archivo,
  alexandria,
  figtree,
  almarai,
  fraunces,
  manrope,
  readex,
  cairo,
  inter,
  spaceGrotesk,
  jetbrainsMono,
  plexArabic,
]
  .map((font) => font.variable)
  .join(" ");
