// Every typeface used by the preview, registered once so portaled overlays
// (modals, drawers) inherit the same font variables as the page.
// Brand fonts come from the 2026 guideline (Archivo, Alexandria) and are
// preloaded; concept fonts use preload:false and download only on the
// routes that actually render them.
import {
  Alexandria,
  Almarai,
  Archivo,
  Figtree,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Instrument_Sans,
  Instrument_Serif,
  Markazi_Text,
  Readex_Pro,
} from "next/font/google";

// Brand (selector, presentation chrome, Concept C)
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-brand-latin", display: "swap" });
const alexandria = Alexandria({ subsets: ["arabic"], variable: "--font-brand-arabic", display: "swap" });

// Concept A — Premium Marketplace
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-a-display", display: "swap", preload: false });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-a-sans", display: "swap", preload: false });
const markazi = Markazi_Text({ subsets: ["arabic"], variable: "--font-a-display-ar", display: "swap", preload: false });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--font-a-sans-ar", display: "swap", preload: false });

// Concept B — Modern Commerce
const figtree = Figtree({ subsets: ["latin"], variable: "--font-b-sans", display: "swap", preload: false });
const almarai = Almarai({ subsets: ["arabic"], weight: ["300", "400", "700", "800"], variable: "--font-b-sans-ar", display: "swap", preload: false });

// Concept D — Digital / Auction Marketplace
const geist = Geist({ subsets: ["latin"], variable: "--font-d-sans", display: "swap", preload: false });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-d-mono", display: "swap", preload: false });
const readex = Readex_Pro({ subsets: ["arabic"], variable: "--font-d-sans-ar", display: "swap", preload: false });

export const fontVariables = [
  archivo,
  alexandria,
  instrumentSerif,
  instrumentSans,
  markazi,
  plexArabic,
  figtree,
  almarai,
  geist,
  geistMono,
  readex,
]
  .map((font) => font.variable)
  .join(" ");
