# Option 3 — approved customer website changes

Option 3 (Visual Discovery Marketplace, route slot `concept-c`) is the
customer's chosen direction. This report covers the two approved changes:

| Change | Status |
|---|---|
| 1. Homepage hero category cards (Auction · Buy Now · Live Auction artwork) | **Done** |
| 2. Auction winner celebration | **Done** (Auction Detail and Live Auction) |

This is the design-preview implementation, in `design-preview/` only (see
"Design preview and production" below). No backend, database, API, auction
rule or other option was changed, and nothing was deployed or merged.

---

## Change 1 — Homepage hero category cards

### The artwork

The six supplied pictures (`6_Images.zip`) are used exactly as supplied:
not recreated, not cropped in the files, no text or button added over
them. Each was matched to its card by what it shows:

| Card | English | Arabic | Size |
|---|---|---|---|
| Auction (handbag, watch, gavel) | `option3-auction-en` | `option3-auction-ar` | 1254 × 1254 |
| Buy Now (tablet, headphones, coffee machine) | `option3-buy-now-en` | `option3-buy-now-ar` | 1564 × 1006 (AR 1565 × 1005) |
| Live Auction (camera on a pedestal, broadcast camera) | `option3-live-auction-en` | `option3-live-auction-ar` | 1564 × 1006 (AR 1565 × 1005) |

- Masters: `design-preview/assets-src/option3-cards/*.png`. These are
  byte-identical copies, recorded with the name they arrived under and their
  SHA-256 in `ASSET_MANIFEST.json`.
- Served files: `design-preview/public/images/work/option3-cards/*-{640,960,1280,master}.webp`.
  `scripts/process-option3-cards.mjs` writes them, only ever downscaling.
  Settings: WebP quality 92 with smart subsampling, because the lettering is
  part of each picture. At 3× zoom the words, red dot and gold rule match
  the PNG. The table is in `DERIVATIVES.md`.

### What changed on the home page

The three hero tiles were replaced in their existing places: Auction where
Furniture was (still the largest), Buy Now where Electronics was (top),
Live Auction where Home & Kitchen was (bottom). The old tile labels, the
Explore button, the circular arrows and the tote product card that
overlapped the Furniture photo are gone. The rest of the home page is
unchanged.

| Card | Opens (existing route) | Link name, English | Link name, Arabic |
|---|---|---|---|
| Auction | `/browse?tab=auction` (Timed Auctions) | Auction — Explore timed auctions | المزادات — استكشف المزادات المحددة بوقت |
| Buy Now | `/browse?tab=buy_now` | Buy Now — Shop fixed-price items | اشترِ الآن — تسوّق المنتجات بسعر ثابت |
| Live Auction | `/live-auction` | Live Auction — Join live auctions | المزاد المباشر — انضم إلى المزادات المباشرة |

The routes are the ones the Option 3 header already uses for the same
three modes, prefixed through the existing `link()` helper. No new route
was added.

- **Language.** The existing language routing decides which picture shows:
  `/en/…` shows the English picture and `/ar/…` the Arabic one. There is no
  second mechanism. Arabic keeps the mirrored right-to-left layout.
- **Accessibility.** Each card is one link with the name above. The picture
  is decorative (`alt=""`), so its words are not read twice. Enter opens the
  card's page, and keyboard focus shows a 3 px indigo ring.
- **Hover.** A 1.5 % zoom of the picture, a 1 px lift with a soft shadow and
  a faint gold edge.

### No cropping into the words, buttons or products

Each picture has a recorded safe area: its words, button, products and (on
Live Auction) the red live dot. The card fits the picture around that area
with a 12 px margin, in CSS (`.vd-mode` in
`styles/r3-visual-discovery.css`, container query units). It fills the card
like "cover" wherever that keeps the safe area inside. Otherwise it is drawn
slightly smaller and sits at the top of the card. Below it the card is a
clean, plain background matched to the picture's own bottom edge: ivory and
warm cream, or a soft warm tan under Buy Now, whose picture ends in that
tone (`floor` in `HERO_CARDS`, eight measured tones per picture, lined up
with it). There is no repeated or blurred copy of the picture. That happens
only at the narrowest three-column widths, and only below the picture:
1200–1282 px in English, and 1200–1313 px in Arabic, where the Arabic hero
text makes that row up to 22 px taller. The floor is up to 34 px under the
English Auction card (its bottom edge is already plain cream, so the join
does not show) and up to 22 px under Buy Now and Live Auction. The Arabic
Auction card never needs it. Pictures are never stretched or squashed.

Layouts:
- **1200 px and wider:** the approved three-column mosaic, unchanged (copy ·
  Auction · Buy Now over Live Auction, 520 px high).
- **1000–1199 px:** copy beside a square Auction card, Buy Now and Live
  Auction side by side below.
- **640–999 px:** copy across the top, then Auction beside Buy Now over Live
  Auction.
- **Phones:** copy, Auction, Buy Now and Live Auction stacked.

Below 1200 px the cards follow the pictures' own proportions. The old
tablet tiles were 190 px tall strips, which would have cut the artwork.

Measured on the real page at 1920, 1440, 1366, 1280, 1200, 1100, 1024, 900,
768, 640, 430, 375 and 320 px, in both languages: every safe area stays at
least 12 px inside its card, and the page never scrolls sideways.

**Final visual review, 1200–1279 px.** The approved version filled that
leftover space with a softly blurred repeat of the picture's own top or
bottom edge. Reviewed at 1200, 1216, 1240, 1260 and 1279 px in English and
Arabic for all three cards (at 2× zoom), it looked artificial: smeared
leaves and stretched streaks on Buy Now and Live Auction, and a visible
seam. It was replaced by the plain matched background described above and
checked again at the same widths, plus Arabic 1280–1313 px. That was a
presentation-only change (`.vd-mode` in `styles/r3-visual-discovery.css`,
`floor` in `HERO_CARDS`). The artwork, routes, card sizes and layout are
unchanged, and at every width where the picture already filled its card
nothing moved.

The concept selector's Option 3 preview images
(`public/images/concepts/c-*.webp`) were recaptured so they show the new
cards. The previous hero photographs (A5, B5, B6) stay in the asset library
but are no longer used on this page.

---

## Change 2 — Auction winner celebration

### Where it plays

Option 3 only:

- **Auction Detail** (`/auction`, `/auction/[slug]`): when a timed lot
  closes while the page is open.
- **Live Auction** (`/live-auction`): when the hammer falls on a lot sold to
  the viewer.

### What it uses (the existing result, nothing new)

The preview has no backend; its simulated engines stand in for the real
one, and the existing pages already show their result. The celebration only
reads that result. It does not decide who won.

| Page | Closing | "You won" | Public winner name |
|---|---|---|---|
| Auction Detail | the engine's own phase turning `ended` (`lib/useAuction.js`) | the engine's bidder state `won` | the winning row the closed bid card already shows (`useWinner` in `components/shared/auction/hooks.js`, e.g. "Bidder K27") |
| Live Auction | the hammer (`lastHammer` from `lib/useLiveEvent.js`, through `useLiveRoom`) | hammer `kind: "won"` (lot sold to you) | none: the live result carries no public name |

The winner is greeted by the first name the header already shows them
("Hello, Faisal"). Other viewers see only the masked public label the page
already shows. The lot title and winning bid come from the same page data,
so the celebration makes no extra requests.

Unchanged and checked with `git diff`: `lib/useAuction.js`,
`lib/useLiveEvent.js`, `components/shared/auction/hooks.js`,
`components/shared/live/*`, `data/*`, `app/*`.

### When it plays, and when it never does

- It plays only for a closing the page saw happen (open → ended). Lots that
  were already closed when the page opened never play it (sold lots,
  reloads, coming back to a closed lot).
- It never plays for Buy Now (that is a purchase, not an auction win), for
  lots without a winner, or for scheduled lots.
- **Live room, other viewers.** The existing Sold card already tells every
  viewer the result. The live engine gives no public winner name, and a lot
  is hammered about once a minute, so other viewers get no overlay, only the
  existing Sold state. The moment is the winner's alone. This was confirmed as
  the final behaviour in the final visual review.
- **Once only.** One play per closing. Re-renders (the page ticks every
  second), repeated or stale updates, time passing, focus or visibility
  changes, resizing, and leaving and coming back never replay it. No backend
  state is used to track this. Each live lot you win plays once.

### Messages

| Viewer | English | Arabic |
|---|---|---|
| Winner | AUCTION WON · Congratulations, {first name}! · You're the winner! | تم الفوز بالمزاد · مبروك، {first name}! · أنت الفائز بالمزاد! |
| Other viewers (timed lots) | AUCTION COMPLETED · Congratulations to {public label} | انتهى المزاد · مبروك لـ {public label} |
| No public name (fallback) | Auction Completed | انتهى المزاد |

Under the message: the lot title and "Winning bid" with the amount. Names
are isolated with `<bdi>`, Arabic is set right-to-left with Arabic type, and
the spaced capitals are English only.

### Privacy

Shown: the winner's own first name, only to the winner, and the masked public
bidder label the page already showed to everyone. Never shown: the full or
legal name, email, phone, account id, initials or any other profile data. The
existing masking is kept as it is.

Production note: the real API exposes the result safely through the masked
labels: `highest_bidder` and `latest_bid.bidder_label` in the timed
`auction_state` broadcast, `bidder_label` / `is_own_bid` / `is_winning` in bid
history, and `highest_bidder_label` / `current_user_is_highest_bidder` in the
live event state. The sale-lot detail serializer also lists raw `winner` and
`highest_bidder` fields, which are user ids. Those must not be used to drive
or label this moment. No backend or API change is needed for the
celebration.

### Design (Option 3 language: deep navy, warm ivory, restrained gold)

3.5 s over the page, then gone; the closed lot stays as it was:

| Time | What happens |
|---|---|
| 0–0.5 s | navy veil with a soft blur over the page, navy-and-gold radial glow |
| 0.5–1.2 s | trophy medallion in burnished gold with gold flecks bursting from behind it (other viewers: an ivory gavel medallion, no flecks) |
| 1.2–2.8 s | the message on a navy card with a gold hairline |
| 2.8–3.5 s | everything fades |

- Non-blocking: nothing on it can be focused or clicked, it ignores the
  pointer, and focus stays where it was.
- The greeting is announced once to screen readers, politely, alongside the
  existing status announcements.
- **Reduced motion:** no flecks and no animation. The veil and card show,
  still, for the same 3.5 s.
- Phones: the card fits the screen with 16 px margins and safe areas, and the
  page never scrolls sideways.

### Files

| File | Change |
|---|---|
| `design-preview/components/shared/auction/celebration.js` | new: when to play, and the words (EN/AR) |
| `design-preview/components/concept-c/visual-discovery/WinnerCelebration.jsx` | new: the Option 3 celebration |
| `design-preview/styles/r3-visual-discovery.css` | the celebration's styles and timeline |
| `design-preview/components/concept-c/visual-discovery/auction/AuctionView.jsx` | mounts it on Auction Detail |
| `design-preview/components/concept-c/visual-discovery/live/LiveView.jsx` | mounts it on Live Auction |
| `design-preview/scripts/verify-option3.mjs`, `design-preview/package.json` | the check below (`npm run verify:option3`) |
| `design-preview/README.md` | how to see it, how to check it |

Change 1 files: `components/concept-c/visual-discovery/Hero.jsx` (the cards
and the hero layout), `…/data.js` (`HERO_CARDS`: pictures, routes, safe
areas), `…/copy.js` (link names; the old tile words removed),
`styles/r3-visual-discovery.css` (`.vd-mode`), `assets-src/option3-cards/`,
`public/images/work/option3-cards/`, `scripts/process-option3-cards.mjs`,
`public/images/concepts/c-*.webp`.

### How to see it in the preview

- **Live Auction:** bid on the lot on the block and stay highest until the
  hammer (under a minute).
- **Auction Detail:** open `/auction/seat-covers` (it closes about 9 minutes
  after the page opens), set a maximum bid well above the price, and wait. Do
  not bid to see the other-viewer version.

---

## Design preview and production

Both changes are the design-preview implementation: `design-preview/`, whose
simulated engines stand in for the real backend. No production integration
change was made. When the winner moment moves to the production website, it
must:

- use the authoritative auction result from the backend (the closing, the
  winner and the winning bid);
- never calculate the winner in the browser;
- show only approved public or masked winner display data, such as the
  masked bidder labels listed under Privacy, plus the winner's own first
  name, shown only to the winner;
- never expose raw winner user ids, such as the sale-lot detail
  serializer's `winner` and `highest_bidder`;
- never expose the legal name, email, phone or any other private profile
  data.

The hero cards need no backend change: they use existing routes and the
supplied artwork.

---

## Checks (both changes)

- `npm run verify:option3`: 238 checks on the real pages, all passing.
  - 122 for the hero cards: each language's three pictures, routes, link
    names, Enter on each card, the focus ring, the old tile labels gone.
    Plus, at 13 widths from 1920 to 320 px in both languages: every safe
    area inside its card, no stretching, no sideways scroll.
  - 116 for the winner moment: Auction Detail EN, AR, 375 px, reduced
    motion, other viewer EN and AR, leave and return; open, already-closed
    and Buy Now lots; a live lot sold to someone else; live winner EN, AR,
    375 px.
- `scripts/verify.mjs`, the five review pages (Home, Browse, Auction
  Detail, Live Auction, Product Detail) of all four options, EN and AR, at
  1440, 1024, 768 and 390: 160 checks, 0 issues. It covers console errors,
  failed requests, broken images, sideways scroll and serious or critical
  axe findings. Option 3's sold, upcoming and pallet lots, with
  interactions: 20 checks, 0 issues.
- Axe while the celebration is on screen (timed winner EN and AR, other
  viewer, live winner EN 1440 and AR 390): no serious or critical findings
  from the celebration.
- `npm run lint`, `npm run build` and the static export (`npm run export`)
  all succeed.
- `git diff` confirms that the auction engines, shared auction and live
  hooks, data and routes are unchanged.

Screenshots are kept locally, not committed.
