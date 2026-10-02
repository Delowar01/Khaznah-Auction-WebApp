# Khaznah — design-system audit of the four approved homepages

Phase A of the client review pack. This document records the visual system each
approved homepage actually uses at commit `76a2d95`, so that every new inner
page (starting with Browse) can be built from the same parts.

- **Source of truth:** the homepage code and stylesheets at `76a2d95`. Values
  were read from the code, not from screenshots, and spot-checked against the
  stylesheets.
- **Paths** are relative to `design-preview/`.
- **Scope of the tokens:** each option's colours, radii and type roles live in
  one stylesheet. Options 2–4 only switch their tokens on under
  `:root[data-concept="…"][data-r3]`. That attribute is set before first paint
  by `app/[lang]/layout.js` and kept by `components/shared/r3/R3Root.jsx`.
- **Breakpoints:** Tailwind's `sm` 640, `md` 768, `lg` 1024, `xl` 1280, plus two
  project breakpoints in `app/globals.css`: `dt` = 1200 px and `wd` = 1440 px.
  Options 2–4 are built on `dt`. Option 1 uses Tailwind's own breakpoints and
  never uses `dt` or `wd`.
- **Shared by all four:** Western digits in both languages, the riyal sign
  (U+20C1) from a one-glyph "Riyal" font at the front of every font stack,
  prices always laid out left-to-right (`components/shared/ui/Money.jsx`), and
  a global focus outline of 2 px in the option's focus colour with a 2 px offset
  (`app/globals.css`).

## At a glance

| | Option 1 · Modern Commerce | Option 2 · Premium Modern | Option 3 · Visual Discovery | Option 4 · Contemporary Saudi |
|---|---|---|---|---|
| Slot / stylesheet | `concept-b` · `styles/concept-b.css` | `concept-a` · `styles/r3-premium-modern.css` | `concept-c` · `styles/r3-visual-discovery.css` | `concept-d` · `styles/r3-saudi-commerce.css` |
| Character | Dense, structured marketplace | Editorial, warm, restrained | Bright, photographic, playful | Calm, local, practical retail |
| Page background | Cool grey `#f4f5f7`, white cards | Ivory `#f8f7f3`, stone bands `#ece8e1` | White, blue-grey `#ecf1f8` fills | White, sage `#edf4f0` and cream `#ecebe2` bands |
| Action colour | Indigo `#3d4d9b` | Charcoal `#302f2c` | Indigo `#183997` (navy `#06213f` headings) | Forest green `#174b38` |
| Accent | Gold `#d8a535` | Brass `#b28a43`, bronze `#80602c` | Gold `#e1a932`, coral `#d6401c` timers | Sage `#b6cdc0`, link blue `#294c9b` |
| Type | Figtree / Almarai | Inter / Noto Sans Arabic | Manrope + Inter / Noto Sans Arabic | Inter / IBM Plex Sans Arabic |
| Corners | 12 px cards, 10 px controls | 4–5 px, buttons never pills | 14–18 px cards, every button a pill | 7–9 px cards and controls, no pills |
| Container | 1400 px, gutters 16 / 24 / 32 | 1336 px, gutters 16 / 28 / 52 | 1343 px, gutters 16 / 28 / 50 | 1365 px, gutters 16 / 28 / 37.5 |
| Countdown | Pill coloured by urgency (neutral → amber → red) | Bold red clock text | Coral pill with white text | Red clock text |
| Signature | Three-tier header, indigo hero, bottom tab bar on phones | Centred logo, brass heading dash, stone bands | Pill search and pill mode row, mosaics, handwritten line | Cream utility bar, segmented hero search, green footer band |

---

## Option 1 — Modern Commerce (`concept-b`)

Key files: `styles/concept-b.css` (**B**), `components/concept-b/` (`layout/`,
`home/`, `cards/`, `ui/`), `components/concept-b/pages/HomePage.jsx`.

### A. Brand / visual character
- A bright, dense marketplace (B:1-8): a cool-grey page holding white cards with
  1 px borders, 14 px body text and a lot of information per card.
- Indigo carries every action. Gold marks value: filled gold with dark text on
  light surfaces, gold text and icons on dark surfaces (live band, footer).
- Ink grounds the page: the 36 px utility strip at the top and the footer.
- Headings are heavy (700–800) with tight negative tracking.
- Product photos sit on light "plates" with `mix-blend-mode: multiply`
  (B:297-300). The hero is an indigo gradient with a masked 44 px grid and a gold
  glow (B:258-276).
- Unlike Options 2–4, this option keeps a working dark theme (B:82-131;
  `PresentationBar.jsx` keeps the theme toggle for Option 1). It opens in light.

### B. Color system (light value; dark value in brackets)
- **Page background:** `--bg #f4f5f7` [#0c111d].
- **Surfaces:** `--surface #ffffff` [#161b26]; `--surface-2 #eef0f4` [#1f242f];
  elevated `#ffffff`. Image plate `#f6f7f9` (stays light in dark mode).
- **Primary accent:** indigo `--primary #3d4d9b`, hover `#33418a`, text on it
  white. Also `--auction` and `--focus`. Brand extras: indigo-950 `#0f1538`,
  -900 `#18205a`, -800 `#242e78`, gold-soft `#f3d98f` (B:70-78).
- **Secondary accent:** gold `--accent #d8a535` with `#1a1406` text; ink
  `--secondary #101828`.
- **Text:** `--text-primary #101828`; secondary `#475467`; tertiary / muted
  `#5d6679`.
- **Borders:** `--border #e3e6eb`, `--border-strong #cdd2da`.
- **Status:** success `#067647`, warning `#a54107`, danger `#c01f14`, live
  `#d1242f`.
- **Auction urgency** (`components/concept-b/ui/Countdown.jsx:18-25`, thresholds
  in `lib/catalog.js` `auctionPhase`): over 1 h neutral grey pill; 1 h or less
  amber (`warning/10`); 10 min or less red (`danger/10`) with a pulsing dot;
  upcoming indigo; ended or sold muted.
- **Card background:** `bg-surface` with `border-line`
  (`cards/CardParts.jsx:14`).
- **Grades** (B:44-50): new `#175cd3`, A `#067647`, B `#0e7090`, C `#a54107`,
  D `#c4320a`, R `#6941c6`, F `#c01f14`; chips are a 10 % tint with a 25 % ring
  (`ui/GradeChip.jsx`).
- **Badges on photos** (B:304-310): indigo, ink, green "New", red "Closing now",
  amber "Ending soon", gold discount.

### C. Typography
- **Families** (`app/fonts.js`): Figtree (English), Almarai (Arabic, weights
  300/400/700/800). Display and body use the same stack.
- **Body:** 14/1.5 English; 15/1.7 Arabic (B:139-147).
- **Scale** (size/line-height px, B:153-189): 2xs 11/14 · xs 12/16 · sm 13/18 ·
  md 14/20 · lg 16/24 · xl 18/26 · h3 17/23 (700) · h2 20/26 → 22/28 at 768 ·
  h1 24/30 → 28/34 at 768 (800, −0.02em) · display 32/36 → 42/46 → 50/54 ·
  hero title 34/38 → 42/46 at 1280.
- **Labels:** eyebrow 11/14, 700, +0.06em, uppercase.
- **Prices and auction values:** price-sm 15/20 (700), price 18/24 (800),
  price-lg 28/32 → 32/36 (800, −0.02em). Amounts use tabular numerals.
- **Arabic:** every role one step larger with taller leading and letter-spacing
  0; the eyebrow is 12/17 and not uppercase (B:191-217).

### D. Container and grid
- **Container:** `.kb-container` max 1400 px; gutters 16 px (phone), 24 px from
  640, 32 px from 1280 (B:220-233).
- **Columns:** hero 12-column grid (carousel 8, promo tiles 4); categories an
  8-column grid from 1024; auction rail 5 per row from 1024; deals 2 → 3 → 5
  columns; Featured a 5-column grid from 1024.
- **Rails:** below 1024 px rails bleed to the screen edge and snap.
- **Section spacing:** sections start 40 px down with 48 px between them
  (48 / 56 px from 1024); bottom padding 64 / 80 px. Card gaps 12 px.

### E. Shape language
- **Radii** (B:52-58): xs 4, sm 6, md 8, lg 12, xl 16, card 12, control 10,
  pill 999. Hero and panels 16; cards 12; badges and chips 8; countdown, watch
  and rail buttons fully round.
- **Shadows** (B:60-63): card `0 1px 2px` (5 %); raised on hover; overlay for
  menus. Cards are flat until hovered.
- **Buttons** (`ui/Button.jsx`): 10 px radius, semibold; primary indigo, soft
  indigo, outline, outline-primary, ink, gold accent, white "brand" on dark;
  heights 28 / 36 / 40 / 48.
- **Pills and chips:** 36 px toggle chips (`ui/Choice.jsx`); badges 20–28 px.
- **Fields** (`ui/Field.jsx`): 10 px radius, strong border, indigo border plus a
  4 px indigo ring on focus.
- **Search:** 44 px with a 2 px indigo border and a solid indigo submit
  (`layout/SearchBar.jsx`).

### F. Card language
- **Auction** (`cards/AuctionCard.jsx`): square plate, status badge top-start
  (Closing now / Ending soon / Auction with gavel / Auction + Buy now), watch
  top-end, seller line, two-line title, grade chip, "Current bid" with the
  amount and bid count, then a footer row with the urgency countdown pill and an
  indigo "Bid now".
- **Buy Now** (`cards/BuyNowCard.jsx`): gold "−N %" or "New" badge, price with
  the old price struck through, a 4 px stock meter ("Only N left" in amber),
  full-width outline "Add to cart".
- **Featured:** a two-pane lead card with an indigo "Featured lot" eyebrow and
  large price, beside a grid of auction cards.
- **Seller:** cover image, monogram in the seller colour, two stats, an indigo
  "Visit store ›" text link.
- **Bulk / pallet:** badges in the text area ("Auction" soft indigo or "Buy
  now"), a units badge, a manifest strip of thumbnails with ×qty chips.

### G. Interaction language
- **Hover:** cards lift 2 px and gain the raised shadow; photos zoom about 5 %;
  titles turn indigo.
- **Focus:** 2 px indigo outline; on dark bars it switches to gold-soft.
- **Selected / active:** segmented control = white segment with shadow on a grey
  track; tabs and the current nav link = 2 px indigo underline; pressed chips =
  indigo border and tint with a check icon.
- **Watch:** a 36 px round frosted button; the heart fills red when on, with a
  toast.
- **CTAs:** primary indigo (Bid now) → white on dark (hero, Join live) →
  outline-primary (Add to cart) → soft → gold only for Subscribe → "View all ›"
  links.

### H. Responsive character
- **Desktop (1024+):** three-tier header (ink utility strip, 68 px main bar with
  inline search, 44 px category nav with mega menu); hero with promo tiles.
- **Tablet (640–1023):** 56 px bar with a menu button; search on its own row that
  hides on scroll; rails show about three cards.
- **Phone:** fixed 60 px bottom tab bar (Home, Categories, Live, Cart,
  Account); hero cut-outs hidden; categories, featured and sellers become swipe
  rails.

### I. RTL rules
- Logical properties throughout; directional icons mirror via `.flip-rtl`.
- Carousel, rail paging and progress bars follow the reading direction.
- Short durations read right-to-left with Arabic unit letters (ي س د ث); clock
  times stay left-to-right. Discounts and stats are wrapped in `dir="ltr"`.

---

## Option 2 — Premium Modern Marketplace (`concept-a`)

Key files: `styles/r3-premium-modern.css` (**CSS**),
`components/concept-a/premium-modern/` (`PremiumModernHome.jsx`, `Header.jsx`,
`Hero.jsx`, `sections.jsx`, `ui.jsx`, `Footer.jsx`).

### A. Brand / visual character
- "Warm ivory storefront, charcoal commerce buttons, restrained brass accents,
  very dark ink headings, small 4–6 px corners and almost no shadow" (CSS:7-12).
- One sans family; no serif. Light only.
- Signature devices: a 38 × 3 px brass dash before every section heading
  (`.pr-dash`); a centred lockup logo between the shopping modes and the account
  links; stone-coloured full-width bands; cut-out photos on tinted plates.
- Motion is minimal: no scroll reveals, no pulsing live dot.

### B. Color system
- **Page background:** ivory `--bg #f8f7f3`.
- **Surfaces:** white cards; stone `--pr-stone #ece8e1` bands (Ending soon,
  trust strip) and plates; warm panel `--pr-panel #f3f0ea`; plate
  `#f2efe9`; search field `--pr-search #f1f0ec`.
- **Primary accent:** charcoal `--primary #302f2c` (hover `#1e1d1b`) for every
  transaction.
- **Secondary accent:** brass `#b28a43` (hover `#a47d39`, ink text) for the one
  hero action and Subscribe; bronze `#80602c` for links, hovers and "View all".
- **Text:** ink `#171b27`; muted `#61656f`. Hard-coded greys: inactive nav
  `#3c3f49`, eyebrows `#4a4d57`.
- **Borders:** `#e4e2dc` / strong `#d3cfc6`; card borders `#ebe9e3`.
- **Status:** live / danger `#c82239`; success `#216a52`; warning `#895d1c`.
- **Auction urgency:** the countdown is always bold red `--pr-timer #d51f28`
  with a clock icon; no urgency tiers. Live bids flash brass.
- **Card background:** white with `#ebe9e3` borders; Featured lead on the warm
  panel.
- **Grade pills:** New `#214391` on `#e3edfc`; A `#216a52` on `#d9f2e8`; B and C
  `#895d1c` on `#ffe8bc`; D, R, F `#b3323d` on `#f8dfe2`.

### C. Typography
- **Families:** Inter (English), Noto Sans Arabic (Arabic first in Arabic).
- **Body:** 15/1.45 English; 16/1.6 Arabic.
- **Scale** (CSS:123-186): xs 12/16 · sm 13/18 · md 14/20 · body 15/22 ·
  lg 16/23 · title 15/20 (550) → 16/21 · h3 17/23 (600) · h2 24/30 → 27/33 →
  28/32 (700, −0.012em) · hero 38/41 → 48/51 → 58/61 (780). No separate h1 class;
  the homepage H1 uses `.pr-hero`.
- **Labels:** label 12/16 (600); eyebrow 12/16, 500, 0.14em, uppercase.
- **Prices:** price 22/26 → 24/28 → 26/30 (700, tabular); price-sm 19/23 →
  23/27.
- **Arabic:** one step larger, letter-spacing 0, eyebrows lose uppercase and
  tracking; h2 25/38 → 28/42 → 30/44.

### D. Container and grid
- **Container:** `.pr-container` max 1336 px; gutters 16 / 28 (768) / 52 (1200).
- **Columns:** categories 8 across at 1200; Ending soon `240px | 1fr` with three
  cards; Featured `2fr | 3fr`; Buy Now 4 across at 1200, 2 below, 1 below
  360 px; sellers 5 across.
- **Section spacing:** about 20–32 px top and 24–36 px bottom per section;
  heading-to-content gap 16 px (19 px at 1200).

### E. Shape language
- **Radii:** tokens xs 3, sm 4, md 5, lg 6, xl 8; in practice 4 px buttons and
  controls, 5 px cards and search, 6 px popovers. Buttons are never pills; only
  grade pills, the heart and badges are round.
- **Shadows:** none on cards; overlay shadow only on popovers and drawers.
- **Buttons** (`ui.jsx` `btn`): charcoal, brass, outline (`#b9a98a` border on
  `#fbfaf7`), ghost; heights 36 / 44 / 48.
- **Search:** 48 px, 5 px radius, `#e0ddd6` border on `#f1f0ec`, bronze border on
  focus, no submit button.
- **Fields:** white, 4 px radius, 2 px brass ring on focus (newsletter).

### F. Card language
- **Auction (Ending soon):** white, borderless, image beside details: title,
  seller, grade pill, "Current bid", price, red clock, full-width charcoal "Bid
  now". No heart.
- **Featured auction:** bordered, stone 4:3 plate, bronze "AUCTION" eyebrow,
  current bid, red clock, charcoal "Bid now", heart.
- **Buy Now:** bordered white card, heart top-end, seller above the title, grade
  pill, price with no label, full-width charcoal "Add to cart" with a cart icon.
- **Featured lead:** warm panel, scene photo, dash + "AUCTION" eyebrow, large
  price and bid count.
- **Seller:** 134 px card with a cover strip and a bronze "Shop now ›".
- **Bulk / pallet:** a long divided row: thumbnail, units, a bronze "View
  manifest" link between hairlines, price and a charcoal button.

### G. Interaction language
- **Hover:** `.pr-link` underlines; header icons and nav turn bronze; category
  photos lift 2 px with a brass underline.
- **Focus:** 2 px charcoal outline.
- **Selected:** city option = stone fill, semibold, brass dot; current language
  semibold with `aria-current`.
- **Active nav:** none on the homepage — "Timed Auctions" is always the
  semibold item by position.
- **Save:** a bare 20 px outline heart; filled `#c82239` when saved, toast.
- **CTAs:** brass only for the hero primary and Subscribe; charcoal for every
  transaction; outline for secondary; bronze text links for View all.

### H. Responsive character
- **Desktop (1200+):** two header rows — shopping modes · centred logo · wishlist,
  account, cart; then All categories · broad search · city · language.
- **Tablet / phone:** a start-side menu drawer replaces the modes below 1200 px
  (below 1366 px in Arabic); account and cart become icons; the categories
  button becomes a 44 px square; rails for categories, Ending soon (below
  1200), Featured and sellers.

### I. RTL rules
- Logical properties; chevrons mirror; the hero uses a separately composed Arabic
  photo rather than a mirrored one.
- Arabic keeps the menu button up to 1366 px because the Arabic nav labels are
  wider.
- Countdown units ي/س/د/ث, space-separated, inside a right-to-left span.

---

## Option 3 — Visual Discovery Marketplace (`concept-c`)

Key files: `styles/r3-visual-discovery.css` (**CSS**),
`components/concept-c/visual-discovery/` (`VisualDiscoveryHome.jsx`,
`Header.jsx`, `Hero.jsx`, `sections.jsx`, `ui.jsx`, `Footer.jsx`).

### A. Brand / visual character
- "Bright white marketplace: indigo controls, navy headings and live band, gold
  hero / newsletter actions, soft rounded imagery (12–20 px), pill navigation
  and circular cart buttons" (CSS:7-10).
- Led by photography: tinted plates with cut-outs, a mixed-height product wall,
  mosaics instead of uniform grids.
- One playful accent: a rotated handwritten line with three gold sketch strokes.

### B. Color system
- **Page background:** white `--bg #ffffff`.
- **Surfaces:** white cards; blue-grey `--vd-bluegray #ecf1f8` for the search
  pill, hovers and inactive tabs; ivory `--vd-ivory #faf5eb` for the hero tile and
  newsletter; plate `#f4f6fa`; tinted product plates (`#e6ebf1`, `#f3ebe3`,
  `#dfe7f0` …).
- **Primary accent:** indigo `#183997` (hover `#12307f`) for controls,
  transactional buttons and focus.
- **Secondary accent:** navy `#06213f` (live band, `--auction`); gold `#e1a932`
  (hover `#d39b22`) with ink text for headline actions.
- **Text:** ink `#071b52`; muted `#5b6b92`.
- **Borders:** `#e5edf7` / strong `#cfdaea`; `#dfe7f3` on pills and Ending soon
  cards.
- **Status:** live / danger `#d92623`; success `#207344`; warning `#8f5410`.
- **Auction urgency:** every countdown is a coral `#d6401c` pill with white
  text; no tiers.
- **Card background:** white with a line border; no shadow.
- **Grade pills:** New and R `#244896` on `#e3ecfb`; A `#207344` on `#ddf4e6`;
  B `#8f5410` on `#ffe8bc`; C `#a8401a` on `#ffe4d6`; D and F `#b8384e` on
  `#fbe0e5`.

### C. Typography
- **Families:** Manrope for display, Inter for body; Noto Sans Arabic first in
  Arabic. Handwriting: Caveat (English), Aref Ruqaa (Arabic).
- **Body:** 15/1.45 English; 16/1.6 Arabic.
- **Scale** (CSS:127-164): xs 12/16 · sm 13/18 · md 14/20 · body 15/21 ·
  title 14/19 → 15/20 (650) · h3 17/23 (750) · h2 26/31 → 30/36 → 38/44 (800,
  −0.025em) · hero 44 → 58 → up to 75 px (800).
- **Labels:** label 11/14 (650); kickers xs, bold, uppercase, 0.08em, muted.
- **Prices:** 20/24 → 22/26 → 25/28 (800, −0.02em, tabular).
- **Arabic:** one step larger, taller leading, letter-spacing 0; h2 26/40 →
  30/46 → 34/50.

### D. Container and grid
- **Container:** `.vd-container` max 1343 px; gutters 16 / 28 / 50. Header
  wrapper max 1440 px with 16 / 28 / 64 px padding.
- **Columns:** hero mosaic 436 / 556 / 401 fr; category pills 2 → 4 across;
  Featured mosaic (lead + three tiles); Ending soon rail → 3 across at 1024;
  product wall 2 columns → 4 at 1200.
- **Section spacing:** 28 px between sections (30 px at 1200), 21–24 px right
  after the navy live band.

### E. Shape language
- **Radii:** xs 6, sm 10, md 12, lg 16, xl 20, card 16, control 999 (pill). In
  practice 18 px hero tiles and lead, 16 px wall and Featured tiles, 14 px Ending
  soon cards, 12 px Bid now buttons.
- **Shadows:** cards are flat (border only); soft shadows on floating cards and
  the heart disk.
- **Buttons** (`ui.jsx` `btn`): always fully rounded; gold, indigo, navy,
  outline (1.5 px indigo), soft, white; heights 36 / 40 / 48.
- **Search:** 48 px pill on blue-grey with an indigo icon and a 2 px indigo ring.
- **Pills:** mode row 34 px pills; category pills; grade pills.

### F. Card language
- **Auction (Ending soon):** 14 px card, coral countdown pill top-end, "Current
  bid", outline "Bid now".
- **Featured lead:** scene photograph with a floating white info card, a
  blue-grey "Auction" chip with a gavel icon and a filled indigo "Bid now".
- **Featured tiles:** tinted plate, heart, countdown, filled indigo "Bid now".
- **Buy Now (wall):** white 16 px card, heart top-end, title, seller, grade pill,
  price, a 48 px indigo circular cart button.
- **Seller:** photo banners with a directional shade and a white "Browse shop"
  pill; compact image-beside-text cards.
- **Bulk / pallet:** borderless tinted panels, navy "Bid now" or indigo "Add to
  cart" pills.

### G. Interaction language
- **Hover:** colour changes; images zoom 2 %; heart scales 1.05; titles
  underline.
- **Focus:** 2 px indigo outline; the search pill uses a 2 px indigo ring.
- **Active nav:** the current mode pill is solid indigo with white semibold text
  and `aria-current="page"` ("Discover" on the homepage).
- **Selected:** wall tabs use `aria-pressed`, indigo when on, blue-grey when off.
- **Save:** white heart disk; filled indigo heart when saved, toast.
- **CTAs:** gold for headline actions; filled indigo for transactions; outline
  for secondary; navy for bulk bids; arrow text links for View all.

### H. Responsive character
- **Desktop (1200+):** logo · pill search · city, language, account, cart; a
  second row of mode pills aligned under the search.
- **Tablet (768–1199):** menu button; search inline in row 1.
- **Phone:** search on its own full-width row; the mode pills scroll
  horizontally; mosaics collapse to two columns and then one below 380 px.

### I. RTL rules
- Logical properties; arrows mirror; banner shades and the furniture scrim flip;
  the handwritten line rotates the other way in Arabic.
- Countdown pills render right-to-left with ي/س/د/ث.

---

## Option 4 — Contemporary Saudi Commerce (`concept-d`)

Key files: `styles/r3-saudi-commerce.css` (**CSS**),
`components/concept-d/saudi-commerce/` (`SaudiCommerceHome.jsx`, `Header.jsx`,
`Hero.jsx`, `sections.jsx`, `ui.jsx`, `Footer.jsx`).

### A. Brand / visual character
- A white storefront with pale-sage panels, forest-green commerce actions,
  dark-ink headings and prices and blue text links (CSS:7-11).
- Signature pieces: a cream utility bar, a centred bilingual hero on limestone
  photography with a strong segmented search (category · query · green Search),
  and a green newsletter / footer band.
- Flat retail feel: 1 px borders, no shadows, hover changes colour only.

### B. Color system
- **Page background:** white.
- **Surfaces:** pale sage `--sc-soft #edf4f0` (trust strip, category rail,
  pallet panels); cream `--sc-utility #ecebe2` (utility bar) and `--sc-cream
  #ede3d5` (Featured panel at 55 %); plate `#f3f4f5`; grade panel `#f1f3f5`.
- **Primary accent:** forest green `#174b38` (hover `#113a2b`).
- **Secondary accent:** deep green `#143c2e` (footer); sage `#b6cdc0` (Subscribe
  only); link blue `#294c9b`.
- **Text:** ink `#102139`; muted `#5e6b7d`.
- **Borders:** `#e3ebe9` / strong `#cfdcd7`.
- **Status:** live / danger `#d2332a`; success `#225d4d`; warning `#936121`.
- **Auction urgency:** red clock text `#d2332a`; no tiers.
- **Card background:** white with `#e3ebe9` borders.
- **Grade pills:** New and R `#294c9b` on `#e4ecf9`; A `#225d4d` on `#d5efe6`;
  B `#936121` on `#ffebc8`; C `#b23c3a` on `#ffe0de`; D and F `#b23c3a` on
  `#fbe2e5`.

### C. Typography
- **Families:** Inter (English), IBM Plex Sans Arabic (Arabic first; weights
  300–700, so 750/800 render at 700 in Arabic).
- **Body:** 15/1.45 English; 16/1.6 Arabic.
- **Scale** (CSS:134-171): xs 12/16 · sm 13/18 · md 14/20 · body 15/21 ·
  nav 15/21 → 17/23 (500) · title 15/20 → 17/23 (600) · h3 17/23 → 18/24 (650) ·
  h2 24/30 → 27/33 → 30/36 (750, −0.015em) · hero 34 → 44 → 57 px (800).
- **Labels:** label 12/16 (600); micro headings xs semibold uppercase 0.08em.
- **Prices:** 22/26 → 25/29 → 27/31 (750, tabular). Step numerals 44 → 70 px.
- **Arabic:** one step larger; letter-spacing 0 on headings and prices.

### D. Container and grid
- **Container:** `.sc-container` max 1365 px; gutters 16 / 28 / 37.5. Header rows
  use `.sc-head` (1334 px, gutters up to 53 px).
- **Columns:** Ending soon list beside the live scene (681 / 654 fr); Featured
  4 across inside a cream panel; retail floor `253px | 1fr` with a category rail;
  Buy Now as horizontal cards 2 × 2; sellers as divided rows.
- **Section spacing:** 30–40 px between sections.

### E. Shape language
- **Radii:** xs 4, sm 6, md 8, lg 10, xl 14, card 9, control 7. Buttons and fields
  7 px; cards 9 px; plates and pills 6 px; large panels 12 px. No pill buttons.
- **Shadows:** none on cards; only overlays and the hero search shell.
- **Buttons** (`ui.jsx` `btn`): green, outline (2 px green border), sage;
  heights 40 / 44 / 48.
- **Search:** the segmented shell — white, 11 px radius, 7 px inner padding, a
  `#eef1f4` category select, a magnifier, the query field and a green Search
  button.

### F. Card language
- **Auction (Ending soon):** horizontal row — plate, title, seller, grade pill,
  "Current bid", 24 px price, red clock, green "Bid now".
- **Featured auction:** vertical, 4:3 plate, green "Auction" tag with a gavel,
  heart, bid count, full-width green "Bid now".
- **Buy Now:** bordered horizontal card, image on the start side, grade pill,
  price, green "Add to cart" with a cart icon, heart.
- **Seller:** divided rows with cover, name, three product thumbnails and a blue
  "Visit store →" link.
- **Bulk / pallet:** sage panels with units, green Bid now / Add to cart and a
  blue "View manifest" link.

### G. Interaction language
- **Hover:** colour or underline only; nav turns green and underlines; category
  rail rows get a light-green fill.
- **Focus:** 2 px green outline.
- **Selected:** city = sage fill and green text with a dot; saved heart filled
  green with `aria-pressed`.
- **Active nav:** none on the homepage.
- **CTAs:** green filled for every main action; outline for Shop Buy Now and
  icon carts; blue arrow links for View all; sage only for Subscribe.

### H. Responsive character
- **Desktop (1200+):** cream utility bar (city, delivery, language), then logo ·
  five shopping modes · account and cart.
- **Tablet / phone:** menu button below 1200 px; account and cart labels hidden
  below 768 px; the hero search stacks vertically on phones.

### I. RTL rules
- Logical properties; arrows mirror; photos never mirror; the live-scene cut-out
  offset changes side in Arabic.
- Countdown in a right-to-left span with ي/س/د/ث; plurals use the six Arabic
  plural forms.

---

## Observations (homepages are frozen, nothing was changed)

These were found while auditing. They are recorded for a later polish phase;
none was fixed in this phase because the homepages are frozen.

1. **Option 4 hero search field:** the query input has `outline-none` and no
   replacement focus style (`Hero.jsx`, input class). The suggestions panel opens
   on focus, but there is no focus ring on the field itself.
2. **Option 4 dark areas:** the green focus outline is barely visible on the deep
   green footer.
3. **Option 2 grade guide:** the guide tiles colour B blue while the B pill in
   the same block is amber.
4. **Option 1 theme:** Option 1 still offers a dark theme; Options 2–4 are light
   only.

## What Browse takes from each system

| | Option 1 | Option 2 | Option 3 | Option 4 |
|---|---|---|---|---|
| Header | The shared three-tier header, current mode underlined | The two-row masthead, current mode marked | The pill header, current mode pill solid indigo | The utility bar and nav row, current mode marked |
| Page head | Dense heading with an auction summary strip | Editorial heading with the brass dash | Large display heading with discovery chips | Cream band with the segmented search |
| Filters | Persistent white rail with collapsible groups | Hairline-divided rail, no boxes | Chip row + rounded filter drawer | Structured sage rail |
| Cards | Compact 12 px cards, urgency pills, indigo Bid now | Spacious 5 px cards, red clock, charcoal Bid now | Image-led 16 px cards, coral pill, indigo pill buttons | Practical 9 px cards, red clock, green Bid now |

The Browse report (`CLIENT_REVIEW_BROWSE_REPORT.md`) describes how each page
uses these parts.
