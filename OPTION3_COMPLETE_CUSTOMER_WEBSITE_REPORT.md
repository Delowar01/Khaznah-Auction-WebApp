# Option 3 — complete customer website

Option 3 (Visual Discovery Marketplace, preview slot `concept-c`) is the
selected master design. This report covers the master build: every
customer-facing page of the Khaznah website in Option 3, in English and
Arabic, on desktop and phones, built as a design preview on top of the
frozen approved pages (HEAD `0309b53`).

- Branch: `claude/magical-faraday-fne4kq` (not merged to main; nothing
  deployed to production).
- **Design approved and frozen** at
  `892dd183b4481f1f3fef021d7f84ba69fbf9e7cd` (see "Design freeze"). Any
  later work is production integration, not design.
- **Preview addresses are not production routes.** The design preview
  serves every page at `/{en|ar}/concept-c/…` (the preview's
  ConceptProvider and LangProvider). The production website does **not**
  use language-prefixed customer URLs: language stays with production's
  customer language provider (the `khaznah-customer-language` preference,
  synced to the profile) and its RTL handling on `<html>`. No production
  route migration is approved. Production routes come from
  CURRENT_CUSTOMER_FRONTEND_INVENTORY.md (section A), the source of truth;
  where a preview address differs (Buy Now detail, live auction viewer, the
  preview-only `/seller` stand-in), the "Option 3 → production route
  integration map" below is authoritative.
- No backend, database, API contract, authentication, payment, auction,
  pricing, VAT, wallet, shipping or WebSocket behaviour was changed. All
  data in the preview is sample data shaped like the production API.
- Options 1, 2 and 4 were not redesigned. Admin, `/dashboard/**` and
  `/warehouse/**` were not touched.

Verdict and the open items are at the end ("Status").

## How to review

- Open Option 3 and use the dark bar's **page picker**: the pages are
  grouped as Approved review pages · Shopping · Account · Sign in and sign
  up · Company and help · States and system.
- Each page's documented states (empty, loading, errors, signed out, a step
  of a flow…) are in the bar's **Preview state** picker (`?state=` in the
  address; the list is in `design-preview/lib/previewStates.js`).
- The preview simulates a session: the demo buyer is signed in. **Logout**
  (header account menu or phone menu) signs out for the browser tab;
  account and checkout then behave as production does for a visitor.
  Signing in on `/login` (any email and password) signs in again.
- CLIENT_PREVIEW_GUIDE.md is the reviewer-facing guide.

## Route checklist

✓ = done and checked. a11y = no serious or critical axe findings, one h1,
landmarks, keyboard (see Accessibility). "Frozen" = approved page, not
redesigned (see "The approved five").

| Production route | Preview route (design review only) | EN | AR | Desktop | Mobile | a11y | Interaction | Quirks kept | Decision / blocker |
|---|---|---|---|---|---|---|---|---|---|
| `/` | `/{lang}/concept-c` | ✓ | ✓ | ✓ | ✓ | ✓ | Frozen; footer links now open the new pages | — | Frozen (approved) |
| `/browse` | `/{lang}/concept-c/browse` | ✓ | ✓ | ✓ | ✓ | ✓ | Frozen | Browse quirks as approved | Frozen |
| `/auction/[slug]` | `/{lang}/concept-c/auction`, `/{lang}/concept-c/auction/{slug}` | ✓ | ✓ | ✓ | ✓ | ✓ | Frozen; winner celebration unchanged | as approved | Frozen |
| `/shop/[id]` — Buy Now / `both` lot detail, numeric sale-lot id | `/{lang}/concept-c/product`, `/{lang}/concept-c/product/{slug}` (design-review abstraction, not a production route) | ✓ | ✓ | ✓ | ✓ | ✓ | Frozen; cart drawer now links to Cart and Checkout | as approved | Frozen |
| `/live` — legacy index, redirects to `/browse?tab=live` | `/{lang}/concept-c/live` (redirects to the preview's Browse live tab) | — | — | — | — | — | redirect only | — | as production |
| `/live/[slug]` — live-auction viewer | `/{lang}/concept-c/live-auction` (design-review abstraction: one sample event; not a production route) | ✓ | ✓ | ✓ | ✓ | ✓ | Frozen; winner-only celebration | as approved | Frozen |
| `/seller/[code]` | `/{lang}/concept-c/seller/{CODE}`, e.g. `REDSEA` (+ `?state=error`) | ✓ | ✓ | ✓ | ✓ | ✓ | Browse's pill bar, filters, sort, Load more, scoped to the seller | Live row for every seller (Live-tab field mismatch); only lookup fields | — |
| none — production has no `/seller` | `/{lang}/concept-c/seller` — **preview-only** stand-in (the featured seller's storefront, as at the frozen commit) | ✓ | ✓ | ✓ | ✓ | ✓ | opened by the approved header's "Sellers" mode | — | Preview-only; not a production route or requirement |
| `/cart` | `/{lang}/concept-c/cart` (7 states) | ✓ | ✓ | ✓ | ✓ + phone bar | ✓ | quantity, remove (confirm), locks, blocked checkout | "Only N left" always; no grouping in production | Seller grouping is presentation (F) |
| `/checkout` | `/{lang}/concept-c/checkout` (15 states) | ✓ | ✓ | ✓ | ✓ + phone pay bar | ✓ | delivery/pickup, addresses, quote, coupons, wallet, COD, Pay gating, cancel | ~25 (see Quirks) | "Order Created" placeholder kept for the owner to replace |
| `/payment/moyasar/[id]` | `/{lang}/concept-c/payment/moyasar/9051` (4 states) | ✓ | ✓ new Arabic | ✓ | ✓ | ✓ | card-form container (no fake card fields), return | Return always to /checkout | Production page English-only: translation sign-off |
| `/payment/result` | `/{lang}/concept-c/payment/result?payment_record_id=9051` (6 states) | ✓ | ✓ new Arabic | ✓ | ✓ | ✓ | verify → paid → redirect; next actions | raw status token; signed-out "View orders" → staff dashboard | Production page English-only: translation sign-off |
| `/account` (shell) | `/{lang}/concept-c/account` (6 states) | ✓ | ✓ | ✓ side list | ✓ section pill row | ✓ | guard, `?tab=` + aliases, Refresh | Q4 (no `next`), Q5, Q33–Q35 | Suspension banner unreachable in production (Q33) |
| `/account?tab=overview` | `/{lang}/concept-c/account` | ✓ | ✓ | ✓ | ✓ | ✓ | Open wallet, View orders | Q5 figures from this visit | — |
| `/account?tab=watchlist` (`bids`) | `/{lang}/concept-c/account?tab=watchlist` | ✓ | ✓ | ✓ | ✓ | ✓ | quick bid, auction panel | Q30–Q32 | Buy Now saves get no quick bid (preview data) |
| `/account?tab=won` | `/{lang}/concept-c/account?tab=won` | ✓ | ✓ | ✓ | ✓ | ✓ | Pay now (pricing, coupons, wallet, address) | Q9–Q14 incl. Q11 lines not adding up | — |
| `/account?tab=orders` | `/{lang}/concept-c/account?tab=orders` | ✓ | ✓ | ✓ | ✓ | ✓ | details drawer, Track, Invoice, Pay, load more | Q8, Q16–Q21, Q25, Q29 | Empty-list state added |
| `/account?tab=wallet` (`deposits`) | `/{lang}/concept-c/account?tab=wallet` | ✓ | ✓ | ✓ | ✓ | ✓ | top-up, cards | no client validation; no remove confirm | Remove-card confirmation: owner |
| `/account?tab=payments` | `/{lang}/concept-c/account?tab=payments` | ✓ | ✓ | ✓ table | ✓ cards | ✓ | gateway link, invoice | gateway link rule | — |
| `/account?tab=disputes` | `/{lang}/concept-c/account?tab=disputes` | ✓ | ✓ | ✓ table | ✓ cards | ✓ | new dispute (rules, files), cancel | direct visit loads no orders | Owner: load orders on a direct visit |
| `/account?tab=notifications` | `/{lang}/concept-c/account?tab=notifications` | ✓ | ✓ | ✓ | ✓ | ✓ | filters, Load 10 more (All only), mark read | links to `/account/orders/{id}` (404) | — |
| `/account?tab=profile` | `/{lang}/concept-c/account?tab=profile` | ✓ | ✓ | ✓ | ✓ | ✓ | photo, save, password, addresses | email/mobile look editable but are not saved | Owner decision |
| `/account/watchlist` | `/{lang}/concept-c/account/watchlist` | ✓ | ✓ | — | — | ✓ | redirects to `?tab=watchlist` | — | — |
| `/login` | `/{lang}/concept-c/login` (5 states) | ✓ | ✓ | ✓ | ✓ | ✓ | buyer-only, `next` cleaned, banners | `verified=1` unread; `next` lost to register; English server text | Theme toggle not shown (Option 3 light-only) |
| `/register` | `/{lang}/concept-c/register` (6 states) | ✓ | ✓ | ✓ | ✓ | ✓ | two steps, email code, 60 s resend, seller swap | no change-email; Latin "s" in Arabic countdown | Test-mode code only in its preview state |
| `/seller/register` | `/{lang}/concept-c/seller/register` (5 states) | ✓ | ✓ | ✓ | ✓ plan rail | ✓ | plans, monthly/annual, validation, success hand-off | fixed "-20%", middle card "Popular" | Plan catalogue values are samples (owner) |
| `/about` | `/{lang}/concept-c/about` | ✓ verbatim | ✓ verbatim | ✓ | ✓ | ✓ | links | production claims kept word for word | Claims for owner review |
| `/how-it-works` | `/{lang}/concept-c/how-it-works` | ✓ | ✓ | ✓ | ✓ | ✓ | links | claims kept | Approved Khaznah photos, not hot-linked stock |
| `/faq` | `/{lang}/concept-c/faq` (2 states) | ✓ | ✓ | ✓ | ✓ | ✓ | search, accordion (keyboard) | one entry; hero copied from Contact | FAQ content needed (owner) |
| `/contact` | `/{lang}/concept-c/contact` (4 states) | ✓ | ✓ | ✓ | ✓ | ✓ | form rules, sent, error (5/min, 503) | English server messages; phone fallback chain | Contact values are samples |
| `/privacy` | `/{lang}/concept-c/privacy` | ✓ verbatim | ✓ verbatim | ✓ section list | ✓ | ✓ | section list, print | "Last updated: January 2025" | LEGAL: text untouched |
| `/terms` | `/{lang}/concept-c/terms` | ✓ verbatim | ✓ verbatim | ✓ | ✓ | ✓ | section list, print | §5 vs §7 contradiction kept | LEGAL: text untouched |
| unknown / 404 — production shows Next's default 404 | any unknown `/{lang}/concept-c/…` address, e.g. `/{lang}/concept-c/orders/1` | ✓ | ✓ | ✓ | ✓ | ✓ | home, Browse, shopping modes, Contact | production shows Next's plain English 404 | Branded 404; unsupported routes stay unsupported |
| error — production has `auction/[slug]/error.js` and `seller/[code]/error.js` only | any Option 3 page (`/{lang}/concept-c/system?state=crash`), auction, seller | ✓ | ✓ | ✓ | ✓ | ✓ | Try again (reset), way out | auction error "live view" wording | — |
| loading — production has `(main)/loading.js` and `auction/[slug]/loading.js` | shown on `/{lang}/concept-c/system` | ✓ | ✓ | ✓ | ✓ | ✓ | — | English-only labels in production | Not wired as `loading.js` in the preview (see 404/error/loading) |
| none | `/{lang}/concept-c/system` — **preview-only** Components & states page | ✓ | ✓ | ✓ | ✓ | ✓ | dialogs, side panels, state index | — | Reviewer page; not a production route |

Not built, as the brief requires, and absent from production:
`/account/orders/[id]`, `/orders/[id]` and a `/seller` index. Production's
own links to the first two (backend notification links, the checkout
placeholder's Track Order) are kept and land on the branded 404. No
production page links to `/seller`; in the preview only, the approved
header's "Sellers" mode opens the preview-only stand-in above.

`{lang}` is `en` or `ar`. Preview states are chosen with `?state=` (see
"How to review").

## Option 3 → production route integration map

This table is the authoritative hand-off for production integration. The
production route list is CURRENT_CUSTOMER_FRONTEND_INVENTORY.md
(section A). Component paths are under
`design-preview/components/concept-c/visual-discovery/`. "Production-
authoritative" behaviour stays exactly as it is in production; the
Option 3 screen replaces presentation only.

| Production route | Preview / design route | Selected Option 3 screen / component | Integration notes | Behaviour that must remain production-authoritative |
|---|---|---|---|---|
| `/` | `/{lang}/concept-c` | `VisualDiscoveryHome.jsx` (`Hero.jsx`, `sections.jsx`, `Header.jsx`, `Footer.jsx`, `Layers.jsx`) | Presentation over the existing homepage data; keep the server entry and client component split. | ISR `revalidate = 20`; `khaznah-country` cookie; `GET marketplace/homepage/?country=` (2.5 s timeout, `null` on failure); 30 s client refresh; watch needs sign-in; guest cart. |
| `/browse` | `/{lang}/concept-c/browse` | `browse/VisualDiscoveryBrowse.jsx` (`BrowseView.jsx`, `Controls.jsx`, `Filters.jsx`, `Cards.jsx`) | Presentation over the existing `BrowseContent` queries and URL state. | The URL contract (`tab`, `search`, `category` English names, `condition`, `location`, `item_type`, `min_price`/`max_price`, `ending`, `in_stock`, `has_discount`, `sort`, `page`) written with `history.replaceState`; tab rules; inbound links from the Navbar search and the homepage. |
| `/auction/[slug]` | `/{lang}/concept-c/auction`, `/{lang}/concept-c/auction/{slug}` | `auction/VisualDiscoveryAuction.jsx` (`AuctionView.jsx`, `Gallery.jsx`, `Bidding.jsx`, `Dialogs.jsx`, `LotSections.jsx`), `WinnerCelebration.jsx` | Presentation over `AuctionDetailClient`'s data and actions; keep the route's `layout.js` (metadata), `loading.js` and `error.js` (restyle only). | ISR `revalidate = 15`; by-slug fetch, `redirect_slug`, numeric-id fallback, no `notFound()`; minimum bid, proxy bid, deposits, extensions and closing as the backend decides; WebSocket updates; the winner comes from the authoritative result — the celebration (about 3.5 s) is for the winner only, everyone else sees the public masked identity. |
| `/shop/[id]` | `/{lang}/concept-c/product`, `/{lang}/concept-c/product/{slug}` (design-review abstraction) | `product/VisualDiscoveryProduct.jsx` (`ProductView.jsx`, `Gallery.jsx`, `PriceCard.jsx`, `Story.jsx`) | Keep `/shop/[id]` with the numeric sale-lot id (Buy Now and `both` lots). Do **not** introduce `/product/[slug]`. | Numeric id only; "This listing is not available as a Buy Now product." unless `sale_type` is `buy_now` or `both`; canonical `/shop/{id}`; availability (`status`, `quantity_available`, `both`: current bid below the Buy Now price); full-stock lock; cart-bound quantity; Buy Now = add then `/cart`; wallet line when signed in; Arabic title and description from `extra_data`. |
| `/live` | `/{lang}/concept-c/live` | none (redirect) | Keep as is. | Server `redirect("/browse?tab=live")`; the Navbar "Live" link points here. |
| `/live/[slug]` | `/{lang}/concept-c/live-auction` (design-review abstraction: one sample event) | `live/VisualDiscoveryLive.jsx` (`LiveView.jsx`, `Stage.jsx`, `BidCard.jsx`, `Lists.jsx`, `Upcoming.jsx`, `PhoneBar.jsx`), `WinnerCelebration.jsx` | Keep `/live/[slug]`. Do **not** introduce `/live-auction`. Presentation over the existing viewer's state. | Slug resolution (`by-slug`, `redirect_slug`, numeric fallback, the unknown-slug spinner); WebSocket `/ws/live-auctions/{id}/` with single-use tickets, `state_version` and backoff; operator-controlled lots (no auto-advance, no automatic anti-sniping); bid and max-bid endpoints and the deposit retry; the full-screen moment for the winner only — non-winners see the Sold state. |
| `/seller/[code]` | `/{lang}/concept-c/seller/{CODE}` | `seller/SellerView.jsx` (reuses Browse's results and drawers) | Presentation over `BrowseContent` with `warehouse_code`. | ISR `revalidate = 60`; upper-cased code; `GET marketplace/sellers/{CODE}/`; 404 → `notFound()`; the seller error boundary; `KHAZNA` alias; `REGISTER` shadowed by `/seller/register`; entitlement tabs including the Live-tab quirk; only lookup fields shown. |
| `/cart` | `/{lang}/concept-c/cart` | `cart/CartPage.jsx`, `kit/Quantity.jsx` | Presentation over `CartProvider`. Grouping lines by seller is presentation only. | Guest-cart cookie and the one-time merge after login; optimistic updates with rollback; line rules (minimum 1, maximum stock, locked full-stock and `both` lines, "Remove Item?"); checkout blocking; totals; Proceed → `/checkout`. |
| `/checkout` | `/{lang}/concept-c/checkout` | `checkout/CheckoutPage.jsx` (`Delivery.jsx`, `Orders.jsx`, `Payment.jsx`, `Screens.jsx`) | Presentation over the existing checkout page's flow. | Buyer-only guard → `/login?next=/cart`; deferred-session resume; delivery quote and pricing preview gate Pay; coupons; wallet modes; COD rules; one order per seller; redirect to the backend's `payment_page_url` / `transaction_url`; VAT and totals from the server. |
| `/payment/moyasar/[id]` | `/{lang}/concept-c/payment/moyasar/9051` | `payment/MoyasarPage.jsx`, `kit/AuthShell.jsx` (payment variant) | Moyasar's hosted form mounts where the preview shows the labelled container. The preview's "Preview only" buttons are not ported. | The Moyasar form (`moyasar-payment-form@2.2.10` from jsDelivr, allowed by the CSP), the payment record, amount and callback; no Navbar or Footer (payment layout). |
| `/payment/result` | `/{lang}/concept-c/payment/result?payment_record_id=9051` | `payment/ResultPage.jsx` | Presentation over the verification flow. | Params `payment_record_id` and `id` / `payment_id`; the verify call, then status polling; automatic redirect only when paid, in production's destination order; the signed-out message; staff → `/dashboard/orders`. |
| `/account` | `/{lang}/concept-c/account?tab=…` | `account/AccountPage.jsx` (`Overview.jsx`, `Watchlist.jsx`, `Won.jsx`, `Orders.jsx`, `WalletTab.jsx`, `Payments.jsx`, `Disputes.jsx`, `Notifications.jsx`, `Profile.jsx`, `Appeal.jsx`) | Presentation over the existing account page's data and actions. | Buyer-only; signed out → `/login` with no `next`; staff and warehouse users → `/dashboard`; `?tab=` values and the aliases `deposits` and `bids`; `replaceState`; backend links `/account?tab=orders&order={id}` and `/account?tab=notifications` keep working; wallet, payment, dispute and notification rules. |
| `/account/watchlist` | `/{lang}/concept-c/account/watchlist` | `account/AccountPage.jsx` (`WatchlistRedirect`) | Keep the legacy redirect. | `window.location.replace("/account?tab=watchlist")`. |
| `/login` | `/{lang}/concept-c/login` | `auth/LoginPage.jsx`, `kit/AuthShell.jsx` | Presentation over the existing sign-in flow. | Buyer-only; `next` cleaned by `lib/safeRedirect.js`; `registered` and `expired`; the profile language update after sign-in; portal links to `/warehouse/login` and `/dashboard/login`; the session (in-memory JWT, refresh cookie, CSRF). |
| `/register` | `/{lang}/concept-c/register` | `auth/RegisterPage.jsx` | Presentation over the existing two-step flow. | `POST accounts/register/` (role `buyer`), send and verify OTP (6 digits, 60 s resend); success → `/login?registered=1&verified=1`; the in-place switch to seller sign-up. |
| `/seller/register` | `/{lang}/concept-c/seller/register` | `auth/SellerRegister.jsx` | Presentation over the existing seller signup. | The plan catalogue from `billing/packages/public`; the signup call; auto-login; hand-off to `/dashboard` (out of scope). |
| `/about` | `/{lang}/concept-c/about` | `content/AboutPage.jsx`, `content/ContentKit.jsx` | Static content, copy word for word. | Production's claims stay as they are until the owner reviews them. |
| `/how-it-works` | `/{lang}/concept-c/how-it-works` | `content/HowItWorksPage.jsx` | Uses approved Khaznah photography from the repository instead of hot-linked stock. | Copy word for word; claims pending owner review. |
| `/faq` | `/{lang}/concept-c/faq` | `content/FaqPage.jsx` | One real entry today; more content is an owner decision. | Production's search matching. |
| `/contact` | `/{lang}/concept-c/contact` | `content/ContactPage.jsx` | Presentation over the API calls. The preview's sample values and simulated sending are not ported. | `GET notifications/support/contact/`, `POST notifications/support/message/` (5 a minute, English server messages); WhatsApp only when configured. |
| `/privacy` | `/{lang}/concept-c/privacy` | `content/PolicyPage.jsx` | Presentation only. | Legal text and "Last updated: January 2025" unchanged. |
| `/terms` | `/{lang}/concept-c/terms` | `content/PolicyPage.jsx` | Presentation only. | Legal text and "Last updated: January 2025" unchanged. |
| unknown / 404 | any unknown `/{lang}/concept-c/…` address | `content/NotFoundPage.jsx` (`Option3NotFound.jsx` is only the preview's switch for unmatched addresses) | Production has no `not-found.js` today; adding the branded page is a presentation change. | Unknown addresses keep the 404 status; `/seller/[code]`'s `notFound()`; no route is added to make a 404 go away. |

**These routes do not exist — do not create them during integration:**

- `/account/orders/[id]` — does not exist. Backend notification links point
  to it and reach the 404; that stays a documented quirk until the owner
  decides otherwise.
- `/orders/[id]` — does not exist. Only checkout's placeholder Track Order
  links to `/orders/1`.
- `/seller` (index) — does not exist. No production page links to it and
  there is no public seller-list endpoint. The preview's
  `/{lang}/concept-c/seller` stand-in is preview-only and is not a
  production requirement.

**Preview-only — not to be ported:** the `/{en|ar}/concept-c` prefix and
the concept selector; the presentation bar with its page and Preview state
pickers (`?state=`, `StateRoute`); the simulated session (`PreviewStore`
`signedIn`, `kit/session.js`) — production keeps its `AuthProvider`; all
sample data (`data/*Samples.js`, `data/support.js`, `data/sellerPlans.js`);
the card page's "Preview only" buttons and the sample contact-link notes;
the `/{lang}/concept-c/seller` stand-in and `/{lang}/concept-c/system`;
the `/{lang}/concept-c/product/{slug}` and `/{lang}/concept-c/live-auction`
addresses (abstractions of `/shop/[id]` and `/live/[slug]`).

**Language in production:** customer URLs stay without a language prefix.
Language keeps working as it does today — the customer language provider
(`khaznah-customer-language`, synced across tabs and to the profile's
`customer_language`), the pre-paint `<html lang/dir>` script and RTL.
Option 3's English and Arabic copy is applied within that provider. No
production route migration is approved.

## What was built

### Shared foundation (Phases 23–25)

`design-preview/components/concept-c/visual-discovery/kit/` — the Option 3
customer primitives, used by every new page:

- `Page.jsx` — `VDPage`: the approved header, footer, phone menu, cart
  drawer and skip link around a page.
- `Blocks.jsx` — Breadcrumbs, PageHeader, Panel, Tile, PanelHead,
  StatusPill (tones with an icon, never colour alone), Notice, EmptyState,
  ErrorState, Spinner, Placeholder/LoadingPanel, SummaryRow, Facts,
  IconDisk.
- `Form.jsx` — Field (label, hint, error wired with aria-describedby and
  aria-invalid), TextInput, TextArea, Select, PasswordInput, CodeInput,
  Checkbox, RadioCard, PillChoice.
- `Overlay.jsx` — Dialog and SidePanel on the shared Modal/Drawer (focus
  trap, Escape, focus return, scroll lock).
- `Quantity.jsx` — the product page's quantity pill, with production's
  typing rules; LockedQuantity for full-lot lines.
- `AuthShell.jsx` — the simplified branded shell for sign-in and payment
  pages.
- `session.js` — the simulated session (production's auth "loading" while
  unknown).

Also: the presentation bar's grouped page picker and **Preview state**
picker; the simulated session in the preview store (sessionStorage, per
tab); the header account menu with production's links (signed in: My
Account, Orders, Profile, My Bids, Watchlist, Logout — My Bids opens the
Watchlist tab, as in production; signed out: Sign in, Create Account,
Join as Seller); footer links to the new pages; the cart drawer's Cart and
Checkout buttons.

Existing approved components were reused where they already fit (Money,
Img, Toaster, Modal/Drawer, Browse's results and drawers, the seller and
product cards). No generic abstraction was added for its own sake.

### Seller storefront (Phase 1)

Production route `/seller/[code]`. Production's storefront is Browse scoped to one seller's warehouse, and so
is this one: the approved Browse pill bar, filters and sort drawers,
image-led cards and Load more, under a navy seller hero. The hero keeps
production's headline and "Seller · CODE" chip and shows only fields of the
public seller lookup (name, city, member since, listing counts, live now).
No ratings, reviews, followers, badges, cover photos or profile text. Sale
modes follow the seller's package entitlements. Error state: production's
"We couldn't load this seller catalogue" (no unfiltered fallback). Unknown
codes 404. The old Round 2 seller design is removed.

### Cart (Phase 2)

Lines with production's quantity rules (typing commits whole numbers,
clamps to stock on blur, never removes a line), packed-pallet and
auction full-stock locks with production's wording, remove with "Remove
Item?", unavailable and over-stock lines blocking checkout, order summary,
guest cart, a sticky navy phone bar, and the empty, loading and error
states. Lines are grouped by seller (presentation only; checkout places
one order per seller).

### Checkout (Phase 3)

Signed-in buyer; signed out → production's sign-in redirect
(`/login?next=/cart`). Delivery and warehouse pickup, one order per seller,
saved addresses and the address dialog, delivery pricing (quoting, quote
error), coupons per order, wallet modes (Moyasar only / Wallet + Moyasar /
Wallet only), cash on delivery where the seller allows it, order summary,
deferred and resumed checkout ("session"), submitting, redirecting to the
secure payment page, "total changed" recovery, error, the "Order Created"
placeholder, empty and loading. **Pay stays disabled until the delivery
quote and the pricing preview are current.**

### Payment (Phase 4)

- Card payment page: the record, the amount, a clearly labelled container
  where Moyasar's own secure card form appears (no imitation card fields),
  accepted cards, reassurance, Return to checkout, loading, form
  unavailable and record not found. Two "Preview only" buttons stand in
  for the provider (completed / declined).
- Result page: verifying, paid (redirects to the order or order group),
  still processing, failed, signed out, verification failed, each with its
  next action.
- **Both pages are English-only in production.** The Arabic here is new
  (marked `arNew`) and needs translation sign-off.

### Buyer account (Phases 5–14)

The account hub (navy hero, figures, side list on desktop and a section
pill row on phones, alert bar, suspension banner and appeal) and nine
sections: Overview, Watchlist, Won, Orders, Wallet, Payments, Disputes,
Notifications and Profile, with their panels and dialogs (auction panel and
quick bid, Pay now with delivery pricing and coupons, order details and
tracking, invoices, top-up and saved cards, the dispute form with evidence
rules, notification filters and Load 10 more, profile, password and
addresses). `?tab=` and production's aliases (`bids`, `deposits`) and the
legacy `/account/watchlist` redirect. States: default, empty, suspended,
appeal, loading, error.

### Sign in, register and seller registration (Phases 15–17)

- Sign in: buyer-only, `next` cleaned to same-site paths, registered and
  expired banners, wrong credentials, non-buyer accounts refused, links to
  register and to the seller and staff portals.
- Register: two steps — details (with terms) then the 6-digit email code
  (60-second resend, attempt limit, wrong-code message); success goes to
  sign in with the registered banner; the in-place switch to seller sign-up.
- Seller registration: plan picker (monthly/annual), fields, countries,
  validation, duplicate email, success with the warehouse code and the
  hand-off to the seller dashboard (outside the preview).

### Content, support and legal (Phases 18–22)

About, How it works, FAQ, Contact, Privacy and Terms, with production's
copy word for word (generated from the source by script), a shared help
navigation across the six pages and in the phone menu. FAQ keeps its one
real entry with a search and an accessible accordion. Contact reads
support details shaped like the API and keeps production's form rules and
server answers. Privacy and Terms: presentation only — the legal text and
its "Last updated" dates are untouched; a section list and a print view
were added. How it works uses approved Khaznah photography instead of
production's hot-linked stock photos.

### 404, error and loading (Phases 23–24)

- Branded Option 3 404 for every unknown Option 3 preview address (status
  404; the static export does the same). Other options keep the preview's
  own 404. Production today shows Next's default 404 (it has no
  `not-found.js`).
- Error pages: general, auction and seller catalogue, each with Try again
  and production's way out.
- Loading screens (production's main and auction loaders) are shown on the
  Components & states page. They are **not** wired as route `loading.js`
  files: Next would then pre-render every Option 3 page — the approved five
  included — loading-first, and turn the 404s and the `/live` redirect into
  200 responses. In production they belong in `(main)/loading.js` and
  `auction/[slug]/loading.js`.
- Components & states (`/{lang}/concept-c/system`, preview-only): the
  kit, one example of each kind of page state in its own page's words (no
  business states collapsed into a generic message), and an index of every
  preview state.

## Design consistency (Phase 29)

Every new page uses the approved Option 3 vocabulary: the approved header
and footer (or the branded auth/payment shell), `--vd-*` colour tokens,
the `vd-*` type scale, pill buttons, white 24 px-radius panels, blue-grey
tiles, ivory empty states, navy heroes and phone bars with the gold
action. There is no Round 2, dashboard, Admin or generic-template styling
on any customer page. The old Round 2 seller and system pages were removed.

## English and Arabic (Phase 26)

Every page works in English (LTR) and Arabic (RTL), mirrored with logical
properties. Production's Arabic is used word for word; where production
shows English only, real Arabic was written and marked `arNew` (owner
sign-off); wording production does not have is marked `copyNew`. Amounts,
numbers, order and record numbers, dates, emails, phones, codes and card
digits are isolated (`dir="ltr"` / `<bdi>`); server and seller-entered
text that production keeps in English (server messages, coupon and
discount names) stays English with `dir="auto"`.

## Responsive (Phase 27)

Checked at 1920, 1440, 1280, 1024, 768, 430, 390, 375 and 320 px in both
languages: no page-level sideways scroll. Phones get their own layouts
(stacked summaries, card lists instead of tables, a section pill row in
the account, a plan rail in seller registration) and sticky action bars
where production's flow has a primary action (cart, checkout).

## Accessibility (Phase 28)

One h1 per page, landmarks (header, nav, main, footer) and a skip link
that is the first Tab stop; labelled fields with errors announced
(aria-invalid, aria-describedby) and focus moved to the first problem;
dialogs and side panels trap focus, close on Escape and return focus;
async results in status/alert live regions; status shown with words and
icons, not colour alone; 44 px touch targets; decorative images marked
decorative; reduced motion respected; zero serious or critical axe
findings on every page and state checked.

## The approved five (Phase 30)

Home (`/`), Browse (`/browse`), Timed Auction Detail (`/auction/[slug]`),
Live Auction (`/live/[slug]`; preview `/{lang}/concept-c/live-auction`) and
Buy Now Product Detail (`/shop/[id]`; preview `/{lang}/concept-c/product`)
were not redesigned. Their shared chrome changed only where the
brief required it: the footer's placeholder links now open the new pages
(How it works, Contact, About, Sell on Khaznah, Terms, Privacy; Delivery &
pickup goes to Contact, as production's Shipping link does; Condition
grades goes to the home section), the header account menu (only when
opened) carries production's account links, and the cart drawer (only when
opened) links to the cart and checkout. Regression results are under
Tests.

## Tests (Phases 26–30)

- `npm run verify:option3` — kept as it was (hero cards and the winner
  moment). Result: **238 passed, 0 failed**.
- `npm run verify:option3-complete` — new. One module per area in
  `design-preview/scripts/option3/` (global, discovery, cart, checkout,
  payment, account, auth, content, regression). Results:

| Area | What it covers | Checks | Result |
|---|---|---|---|
| global | 23 preview routes × EN/AR × 9 widths (1920–320): status, lang/dir, one h1, one main, skip link (first Tab stop, Enter → content), no broken images, no sideways scroll, no console errors; axe at 1440 and 390; presentation-bar page list; account menu and the session across a reload | 3,464 | all passed |
| discovery | auction-first header on the approved pages; product → cart drawer → cart/checkout; seller storefront (chip, headline, no invented fields, listings, live row, error, 404, phones) | 71 | all passed |
| cart | empty, sample, attention, guest, signed out, loading, error; quantity rules; locks; remove with confirmation; phone bar | 119 | all passed |
| checkout | delivery, pickup, address, multi-seller, coupons, wallet, COD, Pay gating, every state, phones | 193 | all passed |
| payment | card page states, result states, redirects, next actions | 193 | all passed |
| account | guard, 9 sections × EN/AR, aliases, legacy redirect, shell states, panels and dialogs (focus return), wallet, payments, disputes, notifications, profile/addresses, phones | 329 | all passed |
| auth | sign in, register and email code, seller registration, every state, `next` handling, phones | 392 | all passed |
| content | six pages, FAQ search and accordion, contact rules and states, legal text and dates, help navigation, 404s, error page, `/live`, `/system`, phones | 542 | all passed |
| regression | the approved five vs the frozen commit, EN/AR × 9 widths: pixels, landmarks, headings, links, buttons, footer | 630 | all passed |
| **Total** | | **5,933** | **0 failed** |

All runs were against the production build (`next build && next start`).

- Regression of the approved five against the frozen commit (`--baseline`,
  the frozen build on another port): full page, pixel by pixel, at all nine
  widths in English and Arabic, plus structure (landmarks, headings, links,
  buttons) and the footer's labels and destinations. Photos and ticking
  countdowns are masked as boxes: the frozen commit compared with itself
  differs in photo sharpness (cached image sizes), never in layout.
  Result: **630 passed, 0 failed** — the five pages are pixel-identical to
  the frozen commit at every width in both languages, and their structure
  is unchanged except the footer's new destinations.
- Options 1, 2 and 4 (evidence run, not part of the suite): their review
  pages, seller and system pages at 1440 and 390 px in EN and AR — 82 of 84
  captures pixel-identical to the frozen commit; the other two (Options 2
  and 4 live auction on phones) differ only in the live lot's ticking
  progress bar and are identical on repeat runs. No Option 1, 2 or 4 file
  was changed.
- Lint, build and static export: `eslint` clean on the whole preview;
  `next build` clean; `STATIC_EXPORT=1 next build` succeeds — 367 pages
  (114 of them Option 3, every route in both languages) and the 404 page,
  which shows the branded Option 3 404 for unknown Option 3 addresses.

## Production quirks kept

The redesign does not fix production behaviour. Quirks found in the
source and kept (references are to the source specs used for this build):

- **Seller storefront:** the Live tab shows for every seller (the
  frontend reads a field the lookup never sends); only code, name and tabs
  come from the lookup.
- **Cart:** "Only N left" at every stock level (English only in
  production); locked lines have no remove; a failed cart load looks like
  an empty cart in production; production's cart is not grouped by seller.
- **Checkout:** the payment-method drawer never opens, so Cash on Pickup
  is unreachable; the "Order Created" placeholder (fake timeline, invoice
  button with no action, Track Order → `/orders/1`, mismatched Arabic);
  fake processing steps; overlay Cancel only hides the overlay; probe
  failure takes over the page; pickup header always "Pickup from Selected
  warehouse"; raw warehouse code until the quote's label arrives; saving an
  address appends the building to the street line and relabels it; the
  edit dialog title for both add and edit; coupon entry only inside an
  order's coupon box; locked lines look editable; per-order totals hidden
  on phones; the phone bar's "Due now" before the wallet share; Products
  already discounted while Discount also shows the automatic saving;
  sign-in returns to the cart, not checkout; COD dead end once an order
  stops qualifying.
- **Payment pages:** English only; Return to checkout always to
  `/checkout`; the raw status word in the result sentence; refunded shown
  as "being verified"; signed out, "View orders" goes to the staff
  dashboard and there is no sign-in link; failed payments are not
  redirected.
- **Account:** signed-out visits go to sign in without `next` (Q4);
  figures and badges only from data loaded in the visit (Q5); Pay from
  Orders sends no address (Q8); closing Pay now refreshes (Q9); the panel
  closes before the payment is created (Q10); "Winning bid" and "Subtotal"
  show the already-discounted figure next to the coupon line (Q11);
  coupon chips "10.00% off" (Q12); Won only among loaded orders (Q14); the
  group chip always "1-seller checkout" (Q16); the invoice slot prints the
  payment status (Q17); "Order status" shows the fulfilment status (Q19);
  "Fulfilled by: Admin / Main" (Q20); "Payment pending" unless paid (Q21);
  "Keep order selected" only changes the address (Q29); the watchlist's
  page-1-only list without remove and its bid wordings (Q30–Q32); one
  appeal only and the unreachable suspension banner (Q33); "Verified buyer"
  always (Q34); the address label required by the server but shown as
  optional (Q37); wallet: no client validation, no remove-card
  confirmation, "1 records"; Disputes opened directly loads no orders;
  notification links to `/account/orders/{id}` (404); Load 10 more under
  "All" only; profile email and mobile look editable but are not saved,
  and the address form clears on submit.
- **Sign in and register:** `verified=1` never read; `?registered=0` still
  shows the banner; `next` lost between sign in and register; non-buyer
  sign-in signs out again; English server messages in both languages;
  resend has no success message; no way back to change the email; the
  Arabic countdown keeps the Latin "s"; fixed "-20%" badge; "Popular" is
  the middle card; annual shown as the yearly total; "seller code" vs
  "Warehouse code" wording; package names not translated.
- **Content:** one FAQ entry, and the FAQ hero copied from Contact;
  English server messages on Contact; the phone card's fallback chain;
  "Last updated: January 2025" on both policies; the Terms §5 / §7
  contradiction; the support email printed as plain text.

Not reproduced, because the preview has no real network (documented for
production): the stuck delivery-fee spinner, the coupon list vanishing
after a failed Pay, the pickup city mismatch, and the account's stale
tracking data after Track (Q22–Q24).

## Deliberate presentation decisions (for owner review)

Presentation or accessibility only, no business rule changed:

- Header account menu carries production's dropdown links; footer
  placeholders open the new pages. In the preview only, the approved
  header's "Sellers" mode opens `/{lang}/concept-c/seller`, a stand-in (the
  featured seller's storefront, unchanged from the frozen commit).
  Production has no `/seller` page and none is to be created.
- Cart lines grouped by seller.
- Native browser confirms and validation bubbles became accessible dialogs
  and inline messages with the same rules and questions.
- Account: action feedback also shown in the section where it happened
  (production shows it on Orders only — Q7); status values shown with
  their label and a matching tone (production: raw text in amber); an
  empty state for the Orders list; the load-error text production computes
  but never shows appears in the error state (Q6); header account links
  switch the section in place; dates shown in Riyadh time.
- FAQ and Contact accessibility fixes (labels, accordion semantics, result
  in a live region instead of an unannounced toast).
- How it works gains a short "three ways to buy" section describing only
  existing behaviour (new copy).
- Branded 404 instead of Next's plain English page.
- Preview-only conveniences: sample contact links show a note instead of
  opening mail, phone or WhatsApp; the card page's "Preview only" buttons;
  the test-mode email code shown only in its own preview state.

## Business, API and legal items

**Business (B) — owner decisions:**

1. FAQ content (one question today).
2. Replace checkout's "Order Created" placeholder, its fake processing
   steps and the dead payment-method drawer.
3. Translation sign-off for everything marked `arNew`, including both
   payment pages (English-only in production).
4. The real seller plan catalogue (names, prices, trials, quotas): the
   preview uses samples.
5. Account: remove-card confirmation; email/mobile fields that look
   editable; loading orders when Disputes is opened directly; a
   notification-preferences screen (the API exists, production has none —
   not built).
6. Cash on delivery is off platform-wide by default; the sample turns it
   on for one seller to show the per-order choice.
7. The approved header's "Sellers" mode has no production destination:
   production has no `/seller` page and none is to be created. Before
   integration the owner decides which existing route it uses.
8. Whether to fix the documented production bugs (above) in production.
9. A forgot-password flow does not exist in production (no endpoint) — not
   designed.

**API — not faked:**

- Server text (errors, notifications, Moyasar verification) is English
  only (no locale middleware).
- Coupon and automatic-discount names, product titles in cart/checkout
  payloads: no Arabic fields.
- The order list has no sibling order numbers (Q16); tracking nests events
  per fulfilment (Q23–Q24); suspension fields live on the user, not the
  profile (Q33).
- Support details and the contact form: production reads
  `notifications/support/contact/` and posts `support/message/`; the
  preview shows a sample response and simulates the backend's rules.

**Legal — wording untouched, flagged:**

- "Last updated: January 2025" on Privacy and Terms; the support email
  printed in the text versus the configured address; the privacy promises;
  the 24-hour payment window and methods; "Condition grades are
  guaranteed" and the 24-hour dispute window versus Terms §7; account and
  cancellation clauses.
- Claims kept word for word on About, How it works and FAQ for review:
  founding year, buyer and lot counts, warehouses, "single-seller",
  ZATCA, Apple Pay / STC Pay / Maroof marks, SMS alerts, "thousands",
  "based in Saudi Arabia", contact address/hours and the 24-hour reply.
- Checkout placeholder's Arabic says a ZATCA invoice was emailed and its
  timeline starts at "Paid".

## Copy provenance

Production copy is used word for word (EN and AR). Flags in the source
(`design-preview/components/shared/commerce/flags.js`):

- `arNew` — production shows English only; the Arabic is new: **454
  strings** (account 395, payment 24, checkout 23, content 7, cart 3,
  sign-in 2). Most of the account and both payment pages are English-only
  in production; all of this Arabic needs translation sign-off.
- `copyNew` — wording production does not have (labels for screen readers,
  empty and error states production lacks, preview notes): **147 strings**
  (content 81, account 13, cart 13, checkout 12, sign-in 11, seller 9,
  payment 8).

Server text that production keeps in English (API errors, notifications,
coupon and discount names) is shown in English in both languages, as
production does.

## Screenshots

Local only (not committed), captured from the production build:

- Final set, 88 files — `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/final/`
  - desktop (1440 px), English and Arabic, every major route:
    `{home, browse, auction, live, product, seller, cart, checkout, payment,
    payment-result, account, login, register, seller-register, about,
    how-it-works, faq, contact, privacy, terms, 404, system}-{en,ar}-desktop.png`
  - phone (390 px), English and Arabic: `{home, browse, auction, product,
    live, seller, cart, checkout, account, login, register, contact,
    404}-{en,ar}-mobile.png`
  - states, English and Arabic: `state-cart-empty`,
    `state-checkout-payment-step`, `state-payment-success`,
    `state-account-orders`, `state-account-wallet`,
    `state-account-dispute-modal`, `state-account-notifications`,
    `state-seller-registration` (`-{en,ar}-desktop.png`), and
    `winner-celebration-{en,ar}-desktop.png`
- Contact sheet of the desktop pages: `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/montage-en-desktop.png`
- Per-area evidence from the builds (more states):
  `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/shots/checkout/`, `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/shots/account/` (28, incl. the dispute
  form with orders loaded), `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/shots/auth/` (16),
  `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/shots/content/` (21)
- Regression diff images (written only when a page differs):
  `/tmp/claude-0/-home-user-Khaznah-Auction-WebApp/cfeda0a7-7448-5cb9-860d-3a06cf41ea45/scratchpad/c/regress/`

## Files by phase

All paths are under `design-preview/`.

- **Foundation:** `components/concept-c/visual-discovery/kit/` (Page,
  Blocks, Form, Overlay, Quantity, AuthShell, session);
  `components/shared/preview/StateRoute.jsx`; `lib/previewStates.js`;
  `components/shared/commerce/flags.js`; changed: Header, Layers (phone
  menu), Footer, copy.js, ui.jsx, `browse/BrowseView.jsx` and
  `browse/Controls.jsx` (exports for the storefront, no visual change),
  PresentationBar, PreviewStore, `r3/drawers.jsx`, `ui/Modal.jsx`,
  `lib/routes.js`, `lib/meta.js`, `app/[lang]/layout.js` (pre-paint),
  `styles/r3-visual-discovery.css`.
- **Phase 1 seller:** `app/[lang]/concept-c/seller/{page.js,[code]/page.js}`,
  `visual-discovery/seller/SellerView.jsx`, `shared/commerce/sellerCopy.js`;
  removed the Round 2 `(round2)` route group.
- **Phase 2 cart:** `app/[lang]/concept-c/cart/`, `visual-discovery/cart/`,
  `shared/commerce/cartCopy.js`, `data/cartSamples.js`, `lib/cart.js`.
- **Phase 3 checkout:** `app/[lang]/concept-c/checkout/`,
  `visual-discovery/checkout/` (CheckoutPage, Delivery, Orders, Payment,
  Screens), `shared/commerce/checkoutCopy.js`, `data/checkoutSamples.js`,
  `lib/checkout.js`.
- **Phase 4 payment:** `app/[lang]/concept-c/payment/{moyasar/[id],result}/`,
  `visual-discovery/payment/` (MoyasarPage, ResultPage),
  `shared/commerce/paymentCopy.js`.
- **Phases 5–14 account:** `app/[lang]/concept-c/account/{page.js,watchlist/}`,
  `visual-discovery/account/` (AccountPage, Overview, Watchlist, Won,
  Orders, WalletTab, Payments, Disputes, Notifications, Profile, Appeal,
  parts, copy, status), `data/accountSamples.js`.
- **Phases 15–17 sign-in and seller onboarding:**
  `app/[lang]/concept-c/{login,register,seller/register}/`,
  `visual-discovery/auth/` (LoginPage, RegisterPage, SellerRegister,
  AuthParts), `shared/commerce/authCopy.js`, `data/authSamples.js`,
  `data/sellerPlans.js`, `lib/auth.js`.
- **Phases 18–22 content:** `app/[lang]/concept-c/{about,how-it-works,faq,contact,privacy,terms}/`,
  `visual-discovery/content/` (AboutPage, HowItWorksPage, FaqPage,
  ContactPage, PolicyPage, ContentKit), `shared/commerce/contentCopy.js`,
  `data/contentPages.js` (generated from the production source),
  `data/support.js`.
- **Phases 23–24 404, error, states:** `app/[lang]/concept-c/{not-found.js,error.js,auction/error.js,seller/[code]/error.js,live/,system/}`,
  `visual-discovery/content/` (NotFoundPage, Option3NotFound, Boundaries,
  SystemPage), `app/global-not-found.js`,
  `shared/presentation/GlobalNotFoundSwitch.jsx`.
- **Tests:** `scripts/verify-option3-complete.mjs`, `scripts/option3/`
  (harness, global, discovery, cart, checkout, payment, account, auth,
  content, regression), `package.json` (the new script).
- **Docs:** this report and `CLIENT_PREVIEW_GUIDE.md` (repository root).

## Design freeze

OPTION 3 COMPLETE CUSTOMER WEBSITE:
`892dd183b4481f1f3fef021d7f84ba69fbf9e7cd`

The complete Option 3 customer website design is approved and frozen at
this commit. Later commits on this branch change documentation only; the
preview's code, styles and tests are identical to the frozen commit. Any
subsequent work belongs to production integration, not further design.

## Status

**OPTION 3 DESIGN COMPLETE — READY FOR PRODUCTION INTEGRATION.**

The build itself was reported as "OPTION 3 CUSTOMER WEBSITE COMPLETE".

Every customer route in the brief is built in Option 3, in English and
Arabic, on desktop and phones, with its documented states, and verified
(5,933 checks in `verify:option3-complete`, 238 in `verify:option3`, all
passing; the approved five unchanged). The business, API and legal items
above are decisions for the owner before production integration; none of
them blocks the design.

Not done, by design: nothing is merged to main, nothing is integrated into
the production source, and nothing is deployed to production. Production
integration starts from the integration map above, outside this design
preview.
