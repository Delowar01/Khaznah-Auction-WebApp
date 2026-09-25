# Customer Redesign File Map — Khazna

> **Planning document — no production files were modified.**

> **Round 2.** After the first review the client kept **Modern Commerce** and replaced the other three directions with new alternatives in the same commercial family. The internal route slots were reused, so the preview references below are unchanged; only the client-facing labels and the visual layer changed. Current mapping: **Option 1 — Modern Commerce** (`concept-b`, retained), **Option 2 — Premium Commerce** (`concept-a`), **Option 3 — Saudi Modern Commerce** (`concept-c`), **Option 4 — Auction-Forward Commerce** (`concept-d`); the retired first-round directions remain in git history at tag `round1-concepts`. This map's file-level substance is concept-independent — it describes the shared behaviour layer and production endpoints — so it applies to whichever option is approved.

This map names the real production files involved in applying the approved design concept to the customer-facing website. For each file it says whether the redesign keeps it as it is, refactors it first, or replaces its visual layer, and which new shared components should take over duplicated code.

The acceptance baseline for every change is `CURRENT_CUSTOMER_FRONTEND_INVENTORY.md`, section B. Existing behaviour stays unless a functional change is approved separately.

**Conventions**

- **Paths:**
  - Production paths are relative to the reference package root: `frontend/…`, `backend-reference/…`.
  - Preview paths are relative to `design-preview/` and start with `app/`, `components/`, `lib/`, `data/` or `styles/`.
- **Line counts** come from the package snapshot.
- **Preview references** cite concept A (`components/concept-a/…`) as the worked example. Concepts B–D have equivalent components in their own folders (`components/concept-b/…` etc.) and share `components/shared`, `lib` and `data`. When a concept is approved, use its equivalent files.
- **Proposed new locations** (planning only; follows the existing `frontend/src/features/dashboard/` pattern):

  | What | Location |
  |---|---|
  | Customer UI primitives | `frontend/src/components/customer/ui/` |
  | Domain UI | `frontend/src/components/customer/<domain>/` |
  | Hooks and services | `frontend/src/features/<domain>/` |

- **Out of scope:**
  - backend changes;
  - `/dashboard/**` and `/warehouse/**`;
  - the dashboard, seller-auth and admin-login rules in `frontend/src/app/globals.css`;
  - seller-portal restyling.

---

## A. Keep mostly unchanged

These files hold the business, session, real-time and payment logic. The new UI calls them; it does not rewrite them.

| File | Lines | Why it stays | Change allowed during the redesign |
|---|---|---|---|
| `frontend/src/lib/api.js` | 2,175 | Single API client: refresh once and retry on 401, CSRF on session calls, cross-tab refresh lock (`navigator.locks`, localStorage mutex, `khaznah-token-refresh` channel), 15 s default timeout, `withCountryParam`, `getCustomerApiErrorMessage` code mapping, `newIdempotencyKey`, every endpoint wrapper. Also used by the dashboard. | Route `CUSTOMER_ERROR_MESSAGES` (currently English only) through the new i18n layer, with the same codes and fallbacks. |
| `frontend/src/lib/authSession.js` | 68 | In-memory access token, CSRF, session version and expiry reason. | None. |
| `frontend/src/components/providers/AuthProvider.jsx` | 357 | Session bootstrap, `login`, `logout`, `hydrateSession`, `refreshSession`, `updateUser`, role flags (`isBuyer` …), expiry redirect to `/login?next=…&expired=1`, `khaznah-auth` cross-tab sync. | None. |
| `frontend/src/lib/portalRoles.js`, `frontend/src/lib/safeRedirect.js` | 40, 11 | Role groups and the open-redirect guard. | None. |
| `frontend/src/components/providers/CartProvider.jsx` | 313 | Owner-keyed cart query, optimistic add/update/remove with rollback, `pendingAdds` coordination, merge once per user, `replaceWithItem` (clears the server cart first), `clearCart`, `refreshCart`. | None. The new UI consumes `useCart()`. |
| `frontend/src/lib/cart.js` | 89 | Maps server cart rows to the UI shape (`full_stock_required`, `can_checkout`, `unavailable_reason`) and holds the full-stock fallback. | May become the single source for the full-stock rule, replacing the copy in `BuyNowCard.jsx:104-113`. |
| `frontend/src/components/providers/ReactQueryProvider.jsx`, `frontend/src/lib/queryKeys.js` | 35, 24 | Query defaults and the cache-key contract shared with the dashboard. | Add new keys only. |
| `frontend/src/components/providers/LangProvider.jsx` | 130 | Language state, localStorage, `khaznah-locale` channel, profile sync (`customer_language`), `<html>` and `<body>` `dir`. Exposes `useLang()` → `{lang, dir, isRTL, setLang, toggle}`. | Keep the API. The SSR wrapper `div` starts as `dir="ltr"`, which may flash LTR (not verified in a browser). Fixing it is a small functional change; confirm first. |
| `frontend/src/components/providers/CountryProvider.jsx` | 207 | Country detection (stored → headers → GPS → default), storage, full reload, `selectCountry`. | Restyle the two notice banners (the JSX after line ~130) only. |
| `frontend/src/lib/country.js`, `frontend/src/app/country-pref/route.js` | 60, 21 | `khaznah-country` localStorage and cookie; `?country=` scoping of public feeds. | None. |
| `frontend/src/lib/ws.js` | 51 | WebSocket URL builder: forces `wss:` on HTTPS (WebKit mixed-content crash), adds the ticket param. | None. |
| `frontend/src/lib/useReconnectingSocket.js` | 68 | Used by the operator console and `lib/useLiveAuctionSubscriptions.js`. | May absorb the live viewer's local copy (see B.7). Keep the existing signature. |
| `frontend/src/lib/useCountdown.js`, `frontend/src/lib/youtube.js` | 28, 33 | Shared with the operator console. `youtube.js` validates video ids; this is a security boundary. | None. A new shared clock may wrap `useCountdown`. |
| `frontend/src/lib/push.js`, `frontend/public/sw.js` | 65, 38 | Push subscribe/unsubscribe and service-worker display/click. | `sw.js`: replace the `/next.svg` icon with a brand icon (asset only). |
| `frontend/src/lib/marketplaceAdapters.js` | 202 | API → card and detail view models, `KHAZNA` alias (`sellerCodeForLot`), `isBuyNowAvailableForLot`, server-decided market comparison, pallet images in the gallery. | Extend with new fields only. Card components should consume these models. |
| `frontend/src/lib/auctionBidState.js` | 18 | `authoritativeBidFromEvent` (never decrease), `normalizeMoneyInput`, `nextMinimumBid`. | None. |
| `frontend/src/lib/gradeInfo.js` | 75 | Grade keys, EN/AR labels and descriptions, the electronics/non-electronics matrix. Also used by the dashboard. | None. Colours may be mapped to tokens by the consumer. |
| `frontend/src/lib/currency.js` | 24 | `formatSAR`: U+20C1, LTR isolates, `en-SA` digits. Also used by the dashboard. | None. The new `Money` component wraps it. |
| `frontend/src/lib/saleLotMetadata.js` | 81 | Metadata that shares the page fetch (same URL, 15 s revalidate). | Adding JSON-LD or hreflang needs approval (SEO change). |
| `frontend/src/lib/attachmentImages.js`, `frontend/src/lib/useCountries.js` | 43, 30 | Dispute upload refs; seller-register country list. Both are also used by the dashboard. | None. |
| `frontend/src/app/(main)/page.js` | 51 | Homepage SSR snapshot (country cookie, 20 s ISR, 2.5 s timeout). | None. |
| `frontend/src/app/(main)/auction/[slug]/page.js`, `frontend/src/app/(main)/auction/[slug]/layout.js` | 63, 10 | By-slug fetch, `redirect_slug` and numeric-id redirects, metadata. | None. |
| `frontend/src/app/(main)/shop/[id]/layout.js` | 10 | Metadata. | None. |
| `frontend/src/app/(main)/seller/[code]/page.js` | 42 | Seller lookup, `notFound()`, `revalidate = 60`. | Update the import if `BrowseContent` moves (B.4). |
| `frontend/src/app/(main)/live/page.js`, `frontend/src/app/(main)/account/watchlist/page.js` | 5, 15 | Legacy redirects. | Copy only. |
| `frontend/src/app/layout.js` | 77 | Pre-paint `lang`/`dir` script, riyal font preload, provider order. | Add font variables and the customer token stylesheet. Do not touch the dashboard-theme script. |
| `frontend/src/app/(main)/layout.js`, `frontend/src/app/(auth)/layout.js`, `frontend/src/app/payment/layout.js` | 25, 12, 7 | Provider composition and chrome. | Add a customer theme root and a toaster. `(main)` also wraps pages in a `<main>`, which pages duplicate; decide which one keeps it. |
| `frontend/next.config.mjs` | 188 | CSP (Moyasar on jsDelivr, YouTube `frame-src`), image `remotePatterns`, qualities 65/75, `standalone`. | Change only if a new third-party origin is introduced. `next/font` self-hosts, so it is compatible with `font-src 'self'`. |
| `frontend/src/features/dashboard/useSharedDashboardData.js` | 35 | `useNotificationSummaryQuery`, used by the customer Navbar. | Keep; optionally re-export from a customer module. |
| `frontend/public/robots.txt`, `frontend/public/fonts/riyal-regular.woff2` | — | Crawl rules and the riyal glyph. | None. |
| `frontend/public/llms.txt` | — | Crawler guidance. | Claims JSON-LD exists on `/shop/{id}` and `/auction/{id}`; it does not. Correct the text or implement JSON-LD (approval). |
| `backend-reference/**` | — | API, WebSocket, payment and business rules. | **No changes** in this programme. |

---

## B. Refactor during redesign

These files mix UI with business logic. For each one:

1. **Move the logic out verbatim** into hooks or pure functions, with no behaviour change. Verify against the inventory baseline.
2. **Then reskin** by composing the new components.

Line ranges refer to the snapshot.

### B.1 `frontend/src/app/(main)/account/page.js`

About 28% logic, 64% UI, and about 440 dead lines.

| Line count | 5,465 |
|---|---|
| **Extract first** | **URL sync:** `useAccountTab` (tab sync, aliases `deposits→wallet` and `bids→watchlist`, `popstate`, `replaceState`; 4381-4399, 4517-4531). **Query hooks:** `useAccountOrders` (8 per page with "load more"), `useInvoices`, `usePaymentRecords`, `useFulfillments`, `useWallet` + `useWalletLedger` + `useSavedMethods`, `useBidsAndWatchlist`, `useDisputes`, `useNotificationsList` (10 per page, mark read, mark all read, `khaznah-notifications-updated`), `useAddresses` (CRUD), `useAppeals`, `useProfile`. **Action hooks:** `usePayAuctionOrder` (PayNowModal pipeline: auction delivery address → discount → apply wallet → create payment → redirect; 2346-2653, 5216-5252), `usePayGroup` (5193-5214), `useInvoiceDownload` (5254-5276), `useTrackOrder` (5278-5293), `useQuickBid` (1766-1819), `useWalletTopUp` (5106-5140, dispatches `khaznah-wallet-updated`), `useCreateDispute` (attachment upload plus create; 5050-5091), `useEmailVerification`, `usePushToggle` (653-734). **Pure helpers:** status copy maps (465-502) and `invoiceForOrder` go to `features/account/status.js`. `mapBackendOrder` / `mapBackendPayment` (136, 154) should return objects instead of positional arrays. |
| **Then split UI** | Shell: `Hero` 207, `Sidebar` 296, `AccountTabHeader` 612, `AlertBar` 386, `SuspensionBanner` 4287. One container per tab (section E.10). Drawers and modals on the shared `Modal`/`Drawer`: `OrderDrawer` 2006, `AuctionDrawer` 3732, `PayNowModal` 2346, `QuickAddAddressPopup` 2268, `DisputeModal` 4012. |
| **Delete (dead)** | `ActiveBids` 1612 (references undefined variables and would crash), `DepositsPanel` 2793 plus `handleCreateDeposit` 5022, `BidTableRow` 3571, `BidRow` 3618, `OrderSmall` 3639, `Toggle` 3991, `Logo` 187, `useCountdown` 164, and the unreachable `deposits` branch of `AccountContent`. |
| **Risks** | `AccountContent` (1400-1598) is prop-drilled with about 55 props. `refreshKey` drives every cache key. The Won tab only sees orders already loaded. The Disputes modal only lists loaded orders. `actionMessage` is rendered on the Orders tab only. There are four address-form variants. Most copy is English only. The PayNowModal pay button must stay disabled until delivery pricing resolves. |

### B.2 `frontend/src/app/(main)/page-client.jsx`

| Line count | 2,964 |
|---|---|
| **Extract first** | `useHomepageData`: query `["homepage"]`, SSR `initialData`, 30 s `refetchInterval`, no background refetch, `normalizeHomepageData` and its filters (57-170, 2405-2424). Move the shared countdown clock (186-254) to a lib module and use it app-wide. `useWatchToggle` (2437-2479). Move `PrefetchAuctionLink` (2941-2964) and `CountryEmptyState` (2210-2245) to shared components. |
| **Then split UI** | One component per section: ticker, hero, featured, Live Now, ending soon, hot, Buy Now, empty state, mobile action bar. Remove or park the unused `StatsBar`, `CategoryBar`, `MarketplaceNotificationSlider`, `HowItWorks`, `CTABanner`, `DemoAuctionCard`/`DemoTimer`, `Logo`, `EmptySection`, `Reveal` and `fetchMarketplaceNotificationControl`. |
| **Risks** | **LCP choices:** hero `priority`; no `Reveal` on rail cards (984-990); SSR seeding. **Backend-driven section rules:** the backend `buy_now` limit is 4 while the client caps at 8; Hot re-sorts to the top 3 by total bids; the empty state ignores live events. **Motion:** rails, typewriter and TextType lack reduced-motion handling, and duplicated rail DOM repeats links for assistive tech. |

### B.3 `frontend/src/app/(main)/auction/[slug]/AuctionDetailClient.jsx`

About 1,160 logic lines.

| Line count | 2,961 |
|---|---|
| **Extract first (verbatim)** | `useAuctionDetail`: state and refs (400-465), `applyBidderState` (511-539), `applyBidEligibility` (541-549), `applySaleLotState` (632-675), `refreshAuctionState` (677-727), slug fallback (895-919), load effect (921-996), focus/visibility refresh (998-1023), derived view state (1466-1531) as a selector. `useAuctionRealtime`: polling at 7 s / 45 s (1025-1052), socket plus backoff plus snapshot on reconnect (1054-1148), `applyAuctionSocketState` (743-889) with the `bid_version` guard and the never-decrease rule. `useBidActions`: `handlePlaceBid` → `confirmBid` → `handleSetMaxBid` (POST vs PATCH) → `handleClearMaxBid` (1150-1357). `useWatch` (1359-1376). `useDepositReady` (1381-1388). `useAuctionBuyNow` (551-630). Move the YouTube parsers (129-180) into `lib/youtube.js` only after reconciling the two. The page parser checks the host (`youtu.be`, `youtube.com`, `m.youtube.com`) and accepts any last path segment (e.g. `/shorts/…`, `/live/…`). The lib regex ignores the host and only accepts `v=`, `youtu.be/` and `embed/`. A merged version should keep both checks. |
| **Then split UI** | Gallery, lot heading/info, pallet manifest, bid panel (price, timer, bidder-state pill, eligibility/deposit block, bid form, proxy, Buy Now box), bid history, pickup card, mobile bid bar, confirm-bid and Buy Now review modals. |
| **Risks** | **Bidding logic:** keep the `bidInputDirtyRef` rules and the handler check order (leading → ended → deposit → amount → confirm), and keep the eligibility refetch on every frame. `replaceWithItem` clears the cart, and the deposit `returnTo` must be preserved. **Data and caching:** metadata and page fetch deduplication (same URL and `revalidate`); the `["sale-lot", id]` key is shared with `/shop/[id]`. **Known issues to decide on:** no double-submit guard, and the gallery resets on every poll. |

### B.4 `frontend/src/app/(main)/browse/page.js`

About 670 logic lines. This file is also the seller storefront.

| Line count | 2,421 |
|---|---|
| **Extract first** | `useBrowseState`: `readBrowseState` (160-190), URL sync in (1358-1406), write-back (1419-1480), 350 ms search debounce (1338-1345), `khaznah-marketplace-search` listener, entitlement clamp (1218-1239). `useBrowseListings`: params builder (1482-1543), query plus accumulation plus prefetch (1549-1619), observer and pager (1706-1775). `useFilterOptions` (1284-1336, including the `khaznah-marketplace` BroadcastChannel refresh). `useWatchToggle` (1647-1704). Move `BrowseContent` out of the page module to `features/browse/`, because `/seller/[code]` imports it from `../../browse/page`. |
| **Then split UI** | Header/hero, tabs, toolbar (search, sort, view, filter button), a single filter model with two renderers (sidebar or popovers, and a sheet), active-filter chips, results (grid/list), cards, pagination, empty/error/skeleton, Buy Now category rail, Live tab (`LiveAuctionsGrid`). |
| **Risks** | **Inbound URL contract:** English category names and `__uncategorized__` in `category`. **Seller mode:** `warehouse_code`, hidden location filter, entitlements. **Known issues:** SSR renders the empty state first; infinite scroll and numbered pages conflict (choosing one is a functional change); a 1 s page-level ticker re-renders every card; the Live tab ignores filters. |

### B.5 `frontend/src/app/(main)/checkout/page.js` and `frontend/src/app/(main)/checkout/checkout.css`

About 47% logic.

| Line count | 1,783 + 180 CSS |
|---|---|
| **Extract first** | **Hooks:** `useCheckoutGuard` (576-579), `useActiveCheckout` (probe, resume, edit, cancel; 439-487), `useCheckoutAddresses` (581-602, 679-729), `useWalletBalance` (604-628, up to 3 attempts), `usePickupLocations` (630-677), `useSellerGroups` + group totals (511-574), `useDeliveryQuote` (731-784: debounce, request-id guard, signature), `useCartPricingPreview` (786-826: automatic removal of invalid coupons), `useCheckoutTotals` (828-853: wallet allocation, `gatewayDue`, disabled reasons, button label), `useCheckoutSubmit` (886-1098) and retry (1100-1146). **Pure functions** in `features/checkout/`: `buildCheckoutPayload`, `resolveBackendPaymentMethod`. |
| **Then split UI** | Delivery method picker, address picker and modal, pickup location picker, seller order card (lines, COD choice, totals), payment card with wallet, order summary (applied discounts, coupon, totals, payable box, error panel), pay button, mobile pay bar (replaces `checkout.css`), pending-session screen, empty and skeleton states, processing overlay. |
| **Risks** | **Payment safety:** keep the `client_token` idempotency key (reused while the payload is unchanged), `defer_until_paid:true`, the `expected_total` "checkout total changed" recovery, group-payment branches and pickup eligibility (platform-only single group). The Pay button stays gated on the quote signature. **Decide:** `PaymentMethodDrawer` (258-318) is dead code, so cash on pickup is unreachable; making it reachable is a functional change. The placeholder "Order Created" screen (1209-1319) links to the non-existent `/orders/1`. |

### B.6 `frontend/src/components/layouts/Navbar.jsx`

| Line count | 1,096 |
|---|---|
| **Extract first** | `useNotificationFeed`: summary query, ticketed `/ws/notifications/` with 1–30 s backoff, list of 50, mark read / mark all read, `khaznah-notifications-updated` (363-522). `useWalletChip` (370-401, listens for `khaznah-wallet-updated`). `useHeaderSearch` (84-108: pushes `/browse?tab=…&search=` and dispatches `khaznah-marketplace-search`). `useHideOnScroll` (319-362). |
| **Then split UI** | Header, search, primary nav, language toggle, `CountrySwitcher`, cart button, wallet chip, notification popover, account menu, mobile menu (as a `Drawer`). |
| **Risks** | Role-dependent links: admin "Dashboard"; `accountHref` and `ordersHref` switch to `/dashboard…` for non-buyers. The Live link points to `/live`. Link prefetch is deliberately disabled. The mobile menu must keep parity: 6 info links, cart, account/login/register/"Join as Seller", country and language. |

### B.7 `frontend/src/app/(main)/live/[slug]/page.js`

| Line count | 990 |
|---|---|
| **Extract first** | `useLiveEventState`: slug resolution and redirects (272-309), ticketed socket (345-380), the local reconnecting hook (63-122; merge into `lib/useReconnectingSocket.js` only if its async `resolveUrl` and `everConnected` behaviour is kept), `state_version` guard, 8 s notice (382-393). `useLiveWallet` (311-336, refresh on focus). `useLiveBid` (395-427, deposit keyword → modal → one retry). `useLiveMaxBid` (473-540). Current/next lot selection (429-471) as a pure selector. Move the 1 s countdown into leaf components. |
| **Then split UI** | Stage (stream), lot console (current lot, clock, status, stats, bid form), mobile bid bar and proxy sheet, lot sequence gallery, bid history, wins banner, connection pill, loading, not-found and ended states. |
| **Risks** | A signed-in user needs a fresh ticket per connect and must never fall back to an anonymous socket. De-duplicate frames by `state_version`. **Decide:** the proxy minimum differs between the UI and the server; an unknown slug spins forever; the max-bid GET runs on every new bid. |

### B.8 Smaller mixed files

| File | Lines | Extract before reskin | Risk notes |
|---|---|---|---|
| `frontend/src/app/(main)/shop/[id]/page.js` | 515 | `useBuyNowProduct`: query `select` with the sale-type guard and availability rule (79-120) and the wallet query (122-132). `useCartLineForLot`: cart-bound vs local quantity, full-stock lock (134-181). | Shares `["sale-lot", id]` with the auction page. "Buy Now" goes to `/cart`; sending it to `/checkout` needs approval. |
| `frontend/src/app/(main)/cart/page.js` | 569 | `useCartTotals` (352-370). Delete the dead `CartHero` (254-336). | Locked rows have no trash button. Minimum quantity is 1. Keep the remove confirmation and the invalid-stock gate on "Proceed to Checkout". |
| `frontend/src/components/marketplace/BuyNowCard.jsx` | 411 | Use server `full_stock_required` via `lib/cart.js` instead of the local derivation (104-113). Use the shared stepper. | Label rules: "Add Full Pallet", "Buy Full Lot", "Out of stock". |
| `frontend/src/app/payment/result/page.js` | 117 | `usePaymentVerification` (POST with gateway id, else poll 8 × 1.5 s). Pure `resolvePaymentReturnHref` (see E.9). | Destination order and automatic redirect when paid. The page is English only. |
| `frontend/src/app/payment/moyasar/[id]/page.js` | 92 | `useMoyasarForm`: loads the script and CSS, calls `Moyasar.init` with `form_config`, and posts attach-gateway `on_completed`. | The script origin is bound by the CSP (`cdn.jsdelivr.net`), and the form version (2.2.10) is pinned. |
| `frontend/src/app/seller/register/page.js` | 420 | Move `SellerRegisterPage` to a component module. `/register` imports the page file directly (`register/page.js:11`). | Seller onboarding: coordinate with the seller-portal redesign. Uses the dashboard theme. |
| `frontend/src/app/globals.css` | 3,863 | Split the customer rules into their own stylesheet, plus the new tokens. They are interleaved in three places: about lines 1–420 (font stacks, Arabic/bidi rules, customer animations such as `kz-*` and `countdown-pulse`), about 3138–3215 (`.khaznah-footer*`, `.mobile-nav-link`, `.browse-filter-*`, `.browse-price-slider*`, `.live-auction-layout`) and about 3808–3863 (`.khaznah-commerce-*`, cart and checkout). Everything else is dashboard theme, seller-auth and admin-login styling. | The non-customer rules must stay byte-for-byte equivalent. `.kz-shine-btn` is defined twice (here and in `page-client.jsx`). |
| `frontend/src/components/marketplace/FloatingCardRail.jsx` | 306 | Decide: keep it and add reduced-motion, focus pause and RTL, or replace it with a scroll-snap rail. | Deliberate performance choices: rAF with `translate3d`, no React re-render per frame. |

---

## C. Replace visual layer

The markup and styles of these files can be replaced substantially. The listed wiring must be kept.

| File | Lines | What stays wired |
|---|---|---|
| `frontend/src/components/layouts/Footer.jsx` (+ `PaymentLogos.jsx`, `SocialIcons.jsx`) | 416 (+53, 67) | Link targets (`/browse?tab=auction`, `/browse`, `/how-it-works`, `/seller/register`, `/about`, `/contact`, `/faq`, `/terms`), the "Grade guide" trigger for `GradeInfoModal`, copyright line. The newsletter is a local stub; decide whether to remove it or approve a backend. Replace the generic social URLs and typographic payment marks with confirmed brand assets. |
| `frontend/src/components/layouts/CountrySwitcher.jsx` | 37 | The `useCountry()` contract (`countries`, `country`, `selectCountry` → full reload). Hidden when there are fewer than 2 countries. |
| `frontend/src/components/marketplace/LiveEventCard.jsx` | 150 | Target `/live/{slug\|\|id}`. Status mapping: live/paused → LIVE, ended → Completed, else "Starting soon". Lots remaining (staged + countdown), viewer count, YouTube poster via `lib/youtube.js`. Replace the `div role=link` with a real link. |
| `frontend/src/components/marketplace/LiveAuctionsGrid.jsx` | 114 | Infinite query params (`directory=current`, `compact=grid`, `page_size=12`, `warehouse_code`, `search`), 15 s stale time, loading, error, empty and end states. |
| `frontend/src/components/marketplace/LiveNowSection.jsx` | 110 | Query `directory=current&page_size=12` and the live/paused/staged filter. Switching to `compact=grid` would reduce the payload; confirm it still includes what the card needs. |
| `frontend/src/components/marketplace/GradeBadge.jsx`, `frontend/src/components/marketplace/GradeInfoModal.jsx` | 72, 182 | `lib/gradeInfo.js` content and matrix, `normalizeGradeKey`, hidden for `ungraded`, stop-propagation inside cards, dialog focus trap, Escape, scroll lock, focus restore. **`GradeBadge` is also used by `app/dashboard/ecommerce/page.js`:** add a customer variant rather than restyling the shared file. |
| `frontend/src/components/marketplace/ProductImagePlaceholder.jsx` | 23 | None beyond its props. It is replaced by the new image component's fallback. |
| `frontend/src/components/marketplace/WalletDepositModal.jsx` | 242 | Props `requiredAmount`, `walletBalance`, `returnTo`, `onReady`, `onClose`. Wallet refetch on open. "Covered" path calls `onReady`. `paymentsApi.walletTopUp({amount, return_to, description})`, then redirect to `payment_page_url \|\| transaction_url`. Validation "Enter at least X". Close is blocked while busy. |
| `frontend/src/components/marketplace/ShareProductModal.js` | 101 | Share URL (defaults to `location.href`), share text, Copy, `wa.me`, X intent, `navigator.share` fallback. |
| `frontend/src/components/marketplace/PushPrompt.jsx` | 103 | Gating (signed in, supported, permission `default`, not subscribed), 14-day dismissal key `khazna_push_prompt_dismissed_until`, `subscribeToPush`. |
| `frontend/src/components/marketplace/CheckoutControls.jsx` | 53 | `OrderCoupon` and `CheckoutWallet` props (codes, available coupons, status, wallet modes and amount). |
| `frontend/src/components/account/AddressSelector.jsx` | 100 | Callbacks for select, edit, add, delete and set-default, and the default marker. Needs translation. |
| `frontend/src/components/auth/LoginLanguageToggle.jsx` | 21 | Also used by the dashboard and warehouse logins: create a customer version instead of editing it. |
| `frontend/src/app/(auth)/login/page.js` | 178 | `login()` → buyer-role check → profile language PATCH (fire and forget) → `sanitizeNextPath(next)`. `registered` and `expired` banners. Portal switch links. Currently styled with `--dashboard-*` tokens and `DashboardThemeSelector`; move it to customer tokens. |
| `frontend/src/app/(auth)/register/page.js` | 304 | Register → send OTP → verify → `/login?registered=1&verified=1`. 60 s resend cooldown. `debug_otp` in test mode. Terms checkbox. Seller-registration swap. |
| `frontend/src/app/(main)/about/page.js`, `frontend/src/app/(main)/how-it-works/page.js`, `frontend/src/app/(main)/faq/page.js`, `frontend/src/app/(main)/privacy/page.js`, `frontend/src/app/(main)/terms/page.js` | 351, 324, 216, 294, 302 | Content only, plus the CTA links (`/register`, `/browse`, `/contact`). The FAQ has one entry, and About and How it works carry hard-coded stats and claims that need content review. Remove each file's local `Toast` and `window.__*` timers. |
| `frontend/src/app/(main)/contact/page.js` | 309 | `supportContact()` (email, phone, WhatsApp CTA via `wa.me`) and `sendSupportMessage({name, email, subject, message})` with error fallback. |
| `frontend/src/app/(main)/loading.js`, `frontend/src/app/(main)/auction/[slug]/loading.js`, `frontend/src/app/(main)/auction/[slug]/error.js`, `frontend/src/app/(main)/seller/[code]/error.js` | 19, 25, 36, 41 | `reset()` retry and the fallback links (`/browse?tab=auction`, `/browse`). Translate the auction route screens, which are English only. |
| `frontend/src/components/reactbits/ShinyText.jsx`, `frontend/src/components/reactbits/TextType.jsx` (and the unused `Shuffle.jsx`, `SplitText.jsx`, `TrueFocus.jsx`, `frontend/src/components/ui/RotatingText.jsx`) | 123, 210 | Nothing functional. Remove once the homepage sections are replaced; only `page-client.jsx` and `LiveNowSection.jsx` import them. |
| `frontend/public/images/*` (hero and footer art) | — | Replace per concept. Referenced by browse, account, cart/checkout (`khaznah-cart-hero.webp`), static-page heroes, footer artwork and `checkout-product-placeholder.svg`. Unreferenced today: `khaznah-account-hero.png`, `khaznah-browse-hero.png`, `khaznah-browse-hero.webp`, `khaznah-checkout-hero.webp`, `public/static/hero-about.webp`. |
| `frontend/src/components/seller/PlanCard.jsx` | 134 | Leave for the seller-portal phase; `app/dashboard/warehouses/page.js` also uses it. |

---

## D. New shared components to introduce

Each row names the design-system piece, the existing duplication it replaces, and the preview file that demonstrates it (paths relative to `design-preview/`). Preview state models, such as `lib/useAuction.js`, document behaviour only. In production, components must be driven by the extracted hooks from section B.

| Component / module | Purpose | Replaces (production) | Preview reference |
|---|---|---|---|
| Customer design tokens (semantic colours, grade colours, radii, shadows; light and optional dark) | One theme layer via Tailwind v4 `@theme inline` and CSS variables, scoped to customer layouts. | Hard-coded hex (205 literals in `page-client.jsx`; `#0B101F`, `#D8A535`, `#2A3A8F` … across pages). There are no customer tokens today. | `app/globals.css` (the `@theme inline` block), `styles/concept-a.css` |
| Brand fonts | Self-hosted Latin and Arabic families. | System-font stack (Inter, Noto Sans Arabic and Tajawal are named but never loaded). | `app/fonts.js` |
| `Logo` | Official 2026 vector: mark, wordmark and lockup, coloured via CSS variables. | Navbar text mark (`Navbar.jsx:59-76`), Footer "خ" hexagon, three unused `Logo` components (account, auction, homepage), `/next.svg` push icon. | `components/shared/brand/Logo.jsx`, `components/shared/brand/logo-paths.js` |
| `Money` | Riyal sign plus figure, LTR, with a screen-reader phrase. Wrap production `formatSAR`. | Ad-hoc amount markup and "SAR" strings (`WalletDepositModal.jsx`, `aria-label="Saudi Riyal"`). | `components/shared/ui/Money.jsx`, `lib/format.js` |
| i18n layer (bilingual content objects, `t`/`ui` lookups, Arabic plurals) | One customer string catalogue on top of the existing `LangProvider`. | 28 local `t()` helpers; English-only strings (payment pages, `AddressSelector`, account, deposit block, API error messages). | `lib/i18n.js`, `components/shared/providers/LangProvider.jsx`, `data/ui.js` |
| `DirIcon` | Directional icons that mirror automatically in RTL. | Manual `lang === "ar"` arrow swaps and `rtl:rotate-180` (homepage, browse pagination, `LiveAuctionsGrid`, `LiveNowSection`); unmirrored chevrons (auction and shop galleries). | `components/shared/ui/DirIcon.jsx` |
| `Modal` + `useOverlay` | Dialog or bottom sheet with focus trap, Escape, scroll lock and focus restore. | Checkout `Modal`, auction confirm and Buy Now modals (no dialog role), `WalletDepositModal`, `ShareProductModal`, `GradeInfoModal`, `PayNowModal`, `QuickAddAddressPopup`, `DisputeModal`, live proxy sheet. | `components/shared/ui/Modal.jsx`, `components/shared/ui/useOverlay.js`, `components/concept-a/auction/ConfirmModals.jsx` |
| `Drawer` | Off-canvas panel with a logical side (RTL-aware) or bottom sheet. | Browse `FilterDrawer` (no Escape or dialog role), account `AccountDrawer`/`OrderDrawer`/`AuctionDrawer`, Navbar mobile popover. | `components/shared/ui/Drawer.jsx`, `components/concept-a/browse/FilterSheet.jsx`, `components/concept-a/layout/MobileMenu.jsx`, `components/concept-a/layout/Drawers.jsx` |
| `Toaster` + toast API | One live-region toast stack. | 13 local toast implementations and the account `actionMessage` banner. | `components/shared/ui/Toaster.jsx` (the toast API modelled in `components/shared/providers/PreviewStore.jsx`) |
| `Listbox` | Accessible single-select (keyboard, `aria-activedescendant`). | Native sort `<select>` and `<details>` filter popovers (`CompactBrowseFilters`). | `components/shared/ui/Listbox.jsx`, `components/concept-a/browse/Toolbar.jsx` (`SortMenu`) |
| `PriceRange` | Dual native range inputs, RTL-safe. | `PriceRangeSlider` (`browse/page.js:63-108`). Keep production bounds of 0–100,000, step 500. | `components/shared/ui/PriceRange.jsx` |
| `LotImage` (image with fallback) | Responsive image with a neutral fallback. In production, build it on `next/image`. | `ProductImagePlaceholder`, inline "No image" blocks, checkout placeholder SVG. | `components/shared/ui/Img.jsx` (a plain `<img>` with a local `srcset`; do not port as-is), `components/concept-a/cards/CardImage.jsx` |
| `Skeleton` / `SkeletonCard` | One skeleton primitive. | `(main)/loading.js`, homepage `SkeletonCard`, browse `ListingSkeleton`, `LiveAuctionsGrid`, `AccountLoading`, cart/checkout/shop pulse blocks. | `components/shared/ui/Skeleton.jsx`, `components/concept-a/cards/SkeletonCard.jsx` |
| `Reveal` | Scroll reveal that stays visible without JavaScript and respects reduced motion. | Three local `Reveal` copies; the auction one hides content until JavaScript runs. | `components/shared/ui/Reveal.jsx` |
| `MotionRoot` | Global reduced-motion policy for `motion`. | Unguarded motion (TextType, ShinyText, rails, hero autoplay, pulses). | `components/shared/providers/MotionRoot.jsx` |
| Shared clock + `Countdown` (text and blocks, with days) | One 1 s clock (`useSyncExternalStore`, hydration-safe) plus urgency states. | Five countdown implementations (auction, homepage, browse, account, `lib/useCountdown.js`) and uncapped-hours formats. In production, feed absolute ISO `end_time`/`deadline_at`, not relative `endsIn`. | `lib/clock.js`, `components/concept-a/ui/Countdown.jsx`, `lib/format.js` (`formatDuration`) |
| `useGallery` + `Gallery` | Keyboard, swipe and lightbox, direction-aware. | Inline galleries in auction (`AuctionDetailClient.jsx` about 1552-1765) and shop (about 213-257). Must keep YouTube video and pallet images. | `components/shared/ui/hooks.js` (`useGallery`), `components/concept-a/detail/Gallery.jsx` |
| `useDismiss`, `useMediaQuery`, `useReducedMotion`, `useHydrated` | Behaviour hooks for popovers, breakpoints and hydration. | Ad-hoc outside-click and Escape handlers (Navbar `Dropdown`, `NotificationDrawer`, browse menus). | `components/shared/ui/hooks.js` |
| `QuantityStepper` (with a locked mode) | One stepper with min, max and lock for full-stock lots, plus labelled buttons. | Six steppers: cart, `BuyNowCard`, `BuyNowListRow`, shop, homepage `DemoBuyNowCard`, checkout lines. | `components/concept-a/ui/QuantityStepper.jsx` |
| Card set (`AuctionCard`, `ProductCard`, `ListRow`, `LotCard`, `CategoryTile`) | Consistent lot cards for every state (live, ending, upcoming, sold, out of stock). Driven by `marketplaceAdapters.js`. | `AuctionCardBody`, `EndingSoonCard`, `HotNowCard`, `FeaturedAuctionCard`, hero slides, `BuyNowCard`, `BuyNowListRow`, `DemoBuyNowCard`. | `components/concept-a/cards/*` |
| `LiveEventCard` / live band | Live event tile as a real link. | `LiveEventCard.jsx` (`div role=link`). | `components/concept-a/home/LiveBand.jsx`, `components/concept-a/live/ComingUp.jsx` |
| `SellerCard`, `SellerRow`, `Monogram` | Seller identity on lot pages and lists. New: production has no seller card. Data comes from `GET marketplace/sellers/{code}/`. | Seller code chips (`Seller {code}` / `KHAZNA`). | `components/concept-a/detail/SellerCard.jsx`, `components/concept-a/cards/SellerRow.jsx`, `components/concept-a/ui/Monogram.jsx` |
| `GradeChip` + `GradeGuideModal` | Grade chip and guide on tokens, using production `gradeInfo.js`. | `GradeBadge` / `GradeInfoModal` visuals (keep a separate dashboard version). | `components/concept-a/ui/GradeChip.jsx`, `components/concept-a/detail/GradeGuideModal.jsx`, `data/grades.js` |
| `StatusLabel` | Status dot and label (live pulse). | Live `StatusPill`, account `Badge`, `LiveEventCard` pills. | `components/concept-a/ui/Status.jsx` |
| `Pagination` + progressive "load more" | One agreed paging model. | Browse infinite scroll mixed with numbered pages, account "Load 8/10 more", `LiveAuctionsGrid` sentinel. | `components/concept-a/ui/Pagination.jsx`, `lib/useBrowse.js` (both modes) |
| Browse kit (`FilterPanel`, `FilterSheet`, `ActiveFilters`, `SearchField`, `SortMenu`, `ViewToggle`, `Results`/`EmptyState`, `BrowseHeader`) | One filter model with two renderers; removable filter chips; 350 ms debounced search. | `FilterPanel`, `CompactBrowseFilters`, `FilterDrawer`, browse toolbar and empty state. | `components/concept-a/browse/*`, `lib/useBrowse.js` (mirrors the production URL params) |
| `StickyBar` / `useOffscreen`, `MobileBidBar`, `MobileBuyBar` | Mobile action bars that appear when the main CTA scrolls away. | Auction mobile bar (scroll only), live fixed bar, checkout mobile pay bar, homepage `FloatingMobileActionBar`; the shop page has none. | `components/concept-a/ui/StickyBar.jsx`, `components/concept-a/auction/MobileBidBar.jsx`, `components/concept-a/product/MobileBuyBar.jsx` |
| Bidding kit (`LiveBidBox`, `BidForm`, `MaxBid`, `BuyNowBox`, `BidHistory`, `BidStateBanner`, `ClosesAt`, `AuctionOutcome`/`UpcomingBox`) | Timed-auction panel for every phase. | The bid panel, proxy form, history and status pill inside `AuctionDetailClient.jsx`. | `components/concept-a/auction/*` (behaviour model `lib/useAuction.js`) |
| Live kit (`Stage`, `LotConsole`, `LotSequence`, `ActivityFeed`, `ComingUp`) | Live viewer panels. | Inline sections of `live/[slug]/page.js`. | `components/concept-a/live/*` (behaviour model `lib/useLiveEvent.js`) |
| Detail kit (`LotHeading`, `LotStory`/`StoryBlock`, `Specs`, `Manifest`, `Services`, `RelatedRail`) | Lot identity, description, specs, pallet manifest, delivery/pickup/returns rows, related lots. | Auction info card, dead specs accordion, pallet grid, pickup card; shop accordions. | `components/concept-a/detail/*` |
| Buy Now purchase panel | Price, stock, quantity, add to cart, Buy Now, wallet line. | Shop purchase panel (`shop/[id]/page.js` about 354-474). | `components/concept-a/product/PurchasePanel.jsx` |
| Seller storefront kit (`StoreHero`, `StoreFacts`, `StoreInventory`) | Storefront masthead, facts and scoped inventory. | Browse seller hero (fixed headline and code chip). | `components/concept-a/seller/*` |
| Chrome (`Header`, `Footer`, `MobileMenu`, `SearchOverlay`, `UtilityBar`, `BagDrawer`, `WatchlistDrawer`, `LangLink`) | Header, footer, navigation, search, mini-cart. | `Navbar.jsx` (see B.6), `Footer.jsx`. | `components/concept-a/layout/*` |
| Primitives (`Button`/`IconButton`, `SectionHead`/`Eyebrow`, `Breadcrumbs`, `WatchButton` (`aria-pressed`), `ShareButton`) | Buttons, headings, breadcrumbs, watch toggle. | Ad-hoc buttons; `SectionHeader` (TextType `h2`); watch buttons without a pressed state. | `components/concept-a/ui/*` |
| Component-state reference | Palette, type, button/input/card states, feedback, overlays. | No production equivalent. | `components/concept-a/pages/SystemPage.jsx`, `components/concept-a/system/*` |

**Preview code that must not be ported as logic**

| Preview code | Why | Production source instead |
|---|---|---|
| `components/shared/presentation/*` | Selector, presentation bar and device preview. | — |
| `components/shared/providers/PreviewStore.jsx` | Mock cart, watchlist and toasts. | `CartProvider`, watch APIs, the new `Toaster` |
| `components/shared/providers/ConceptProvider.jsx` | Concept switching. | — |
| `lib/useAuction.js`, `lib/useLiveEvent.js` | Simulated rivals and relative clocks. | Hooks extracted in B.3 and B.7 |
| `lib/catalog.js`, `data/*` | Mock catalogue. | API data via `marketplaceAdapters.js` |
| `lib/routes.js`, `lib/meta.js`, `app/[lang]/…` | Locale-in-URL routing. | Production keeps its routes and localStorage/profile locale |
| `scripts/*` | Preview tooling. | — |

---

## E. Route-by-route plan

### E.0 Global chrome (every `(main)` route)

| | |
|---|---|
| **Files** | `frontend/src/app/(main)/layout.js`, `frontend/src/components/layouts/Navbar.jsx`, `frontend/src/components/layouts/Footer.jsx`, `frontend/src/components/layouts/CountrySwitcher.jsx`, `frontend/src/components/providers/CountryProvider.jsx` (notices) |
| **Dependencies** | `AuthProvider` (role flags, logout), `CartProvider` (`itemCount`), `LangProvider` (toggle), `CountryProvider`, `features/dashboard/useSharedDashboardData.js`, `lib/ws.js`, `lib/currency.js` |
| **APIs** | `POST accounts/session/ws-ticket/`, `GET payments/wallet/me/`, `GET notifications/summary/`, `GET notifications/notifications/?page_size=50`, `PATCH notifications/notifications/{id}/`, `POST notifications/notifications/mark-all-read/`, `GET operations/countries/public/`, `GET operations/countries/detect/` |
| **Auth** | Optional. Bell and wallet chip for signed-in buyers; Dashboard links for staff. |
| **WebSocket** | `/ws/notifications/?ticket=` (signed in only), message type `notification_summary` |
| **Must not lose** | Header search contract (`/browse?tab=…&search=` plus `khaznah-marketplace-search`); cart badge; wallet chip linked to `/account?tab=wallet`; notification bell with unread count, mark read / all read, action links and "View all"; account menu (My Account, Orders, Profile, My Bids, Watchlist, Logout; Sign in / Create account / Join as Seller for guests); country switcher and first-visit notices; EN/AR toggle; About menu links; mobile menu parity; footer grade guide. |
| **Strategy** | Extract the hooks in B.6. Build the header from `components/concept-a/layout/Header.jsx`, `components/concept-a/layout/MobileMenu.jsx`, `components/concept-a/layout/SearchOverlay.jsx` and `components/concept-a/layout/UtilityBar.jsx`. **Add the country switcher and notification bell**, which concept A's header lacks. Build the footer from `components/concept-a/layout/Footer.jsx`. `BagDrawer` (mini-cart via `useCart()`) is an optional addition. Ship the chrome before any page, because every page renders inside it. |

### E.1 Home `/`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/page.js` → `frontend/src/app/(main)/page-client.jsx` |
| **Major components** | `HeroCarousel`, `LiveMarketTicker`, `FeaturedItemsSection`/`FeaturedAuctionCard`, `LiveNowSection` → `LiveEventCard`, `EndingSoonSection`/`EndingSoonCard`, `HotRightNow`/`HotNowCard`, Buy Now section/`DemoBuyNowCard`, `CountryEmptyState`, `FloatingMobileActionBar`, `SectionHeader`, `FloatingCardRail`, `GradeBadge`, reactbits `ShinyText`/`TextType` |
| **Dependencies** | `CartProvider` (`addItem`, `adjustQuantity`), `AuthProvider`, `CountryProvider` (cookie-scoped SSR; empty-state country buttons), `lib/marketplaceAdapters.js`, `lib/currency.js`, `lib/queryKeys.js` |
| **APIs** | `GET marketplace/homepage/?country=` (SSR and client, 30 s), `GET live-auctions/public/events/?directory=current&page_size=12`, `GET marketplace/sale-lots/{id}/` (hover prefetch), `POST marketplace/sale-lots/{id}/watch/`, cart endpoints |
| **Auth** | Optional. Watch needs sign-in; a 401 shows "Please sign in to use the watchlist." |
| **WebSocket** | None (30 s polling by design) |
| **Must not lose** | SSR first paint. All five backend sections: hero ≤ 5, **featured ≤ 8 (seller-requested placements after moderation, via `request-feature`)**, ending soon ≤ 5, hot ≤ 6, Buy Now ≤ 4. Buy Now cart controls with full-lot labels. Live Now rail. Country empty state with country buttons. Urgency styling. Prefetch on intent. Arabic titles (`extra_data.title_ar`). |
| **Strategy** | Map to `components/concept-a/pages/HomePage.jsx` and `components/concept-a/home/*` (see the table below). Order of work: 1. Extract `useHomepageData`. 2. Rebuild the sections one at a time on the same data. 3. Swap the render tree. 4. Remove the unused components. |

Homepage section mapping:

| Preview section | Data source |
|---|---|
| `Hero` | `homepage.hero` |
| `ClosingSoon` | `homepage.ending_soon` |
| `LiveBand` | Live events |
| `ReadyToOwn` | `homepage.buy_now` |
| `Departments` | `marketplace/categories/options/` (counts reflect Buy Now stock only) |
| `PalletsFeature` | Existing filter `sale-lots/?status=live&stock_item__item_type=pallet` |
| `GradeFeature`, `HowItWorks` | Static (fix the copy, see G) |
| `NumbersBand`, `SellersFeature`, `Newsletter` | No data source (G) |
| **Missing from concept A** | Featured and Hot rails, ticker, country empty state, mobile bar. Keep **Featured** at minimum. |

### E.2 Browse `/browse`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/browse/page.js` (`BrowseContent`) |
| **Major components** | In-file: `FilterPanel`, `FilterDrawer`, `CompactBrowseFilters`, `BuyNowCategoryRail`, `PriceRangeSlider`, `AuctionCardBody`, `BuyNowListRow`, `ListingSkeleton`, `Toast`. External: `BuyNowCard.jsx`, `LiveAuctionsGrid.jsx`, `CountrySwitcher.jsx`, `GradeBadge.jsx`, `ProductImagePlaceholder.jsx` |
| **Dependencies** | `CartProvider`, `LangProvider`, `lib/marketplaceAdapters.js`, `lib/gradeInfo.js` (grade order), `lib/queryKeys.js`, `lib/country.js` (auto `country=`) |
| **APIs** | `GET marketplace/sale-lots/?…` (anonymous; params in the inventory, B.1), `GET marketplace/categories/options/`, `GET operations/warehouses/public-options/`, `GET live-auctions/public/events/?directory=current&compact=grid&page_size=12`, `POST\|DELETE marketplace/sale-lots/{id}/watch/`, cart endpoints |
| **Auth** | Optional (watch) |
| **WebSocket** | None |
| **Must not lose** | Full URL contract (inbound links, `replaceState`, `popstate`); three tabs; all filters including ending time and discount; sort mapping; grid/list; page size 20 with prefetch; category rail; seller-mode behaviour; country scoping; `categories-updated` refresh; empty, error and retry states. |
| **Strategy** | Extract `useBrowseState`, `useBrowseListings`, `useFilterOptions` and `useWatchToggle` (B.4). Then compose `components/concept-a/pages/BrowsePage.jsx` from `components/concept-a/browse/*` and `components/concept-a/cards/*`. Wire `lib/useBrowse.js`-style state to the production hook, not to the mock catalogue. Reconcile the preview-only "All" tab, sorts, slug categories and price bounds (G) before building. Ship together with E.3, since both use the same code. |

### E.3 Seller storefront `/seller/[code]`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/seller/[code]/page.js` (server) → `BrowseContent`; `frontend/src/app/(main)/seller/[code]/error.js` |
| **Major components** | Same as browse, plus the seller hero branch inside `BrowseContent` (`browse/page.js:1787-1850`) |
| **Dependencies** | As browse, with `sellerCode`, `sellerLabel` and `sellerInfo` props |
| **APIs** | `GET marketplace/sellers/{CODE}/` (SSR, 60 s), plus the browse set with `warehouse_code=CODE` and `categories/options/?seller=CODE` |
| **Auth** | None |
| **WebSocket** | None |
| **Must not lose** | 404 for unknown codes (never unfiltered results); `KHAZNA` alias; entitlement-based tabs (fix the `live_auctions` → `live` key mismatch only with approval); hidden location filter; error page wording. |
| **Strategy** | Map to `components/concept-a/pages/SellerPage.jsx` → `components/concept-a/seller/StoreHero.jsx`, `components/concept-a/seller/StoreFacts.jsx`, `components/concept-a/seller/StoreInventory.jsx`. Only `name`, `city`, `member_since`, the counts, `live_now` and `entitlements` exist. Tagline, description, cover and pickup address/hours have no source, and there is no "verified" flag (G, row 2). Build after E.2. |

### E.4 Auction detail `/auction/[slug]`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/auction/[slug]/page.js` → `frontend/src/app/(main)/auction/[slug]/AuctionDetailClient.jsx`; `layout.js`, `loading.js` and `error.js` in the same folder |
| **Major components** | In-file: gallery, info, pallet manifest, bid history, bid panel, mobile bar, confirm and Buy Now modals, `CompactAuctionTimer`. External: `WalletDepositModal.jsx`, `ShareProductModal.js` (dynamic), `PushPrompt.jsx`, `GradeBadge.jsx` |
| **Dependencies** | `AuthProvider`, `CartProvider` (`addItem`, `replaceWithItem`), `lib/marketplaceAdapters.js` (`mapSaleLotForDetail`, `mapBidHistory`), `lib/auctionBidState.js`, `lib/ws.js`, `lib/queryKeys.js`, `lib/saleLotMetadata.js`, `lib/push.js` |
| **APIs** | `GET marketplace/sale-lots/by-slug/{slug}/`, `GET marketplace/sale-lots/{id}/`, `GET …/bids/?page_size=8`, `GET …/bid-eligibility/`, `POST …/bid/`, `GET\|POST\|PATCH\|DELETE …/max-bid/`, `POST\|DELETE …/watch/`, `GET payments/wallet/me/`, `POST payments/wallet/top-up/`, `DELETE orders/cart/` + `POST orders/cart/items/`, push endpoints |
| **Auth** | Viewing is public. Bidding, proxy, watch and deposit need a signed-in buyer; guests see sign-in prompts with `next`. |
| **WebSocket** | `/ws/auctions/{id}/` (anonymous), `auction_state` only, plus 7 s / 45 s polling |
| **Must not lose** | Every rule in inventory B.3: minimums, deposit eligibility and top-up return, proxy POST/PATCH/DELETE, anti-snipe via `end_time`, error-code handling with `auction_state` reconciliation, bidder-state pill, "You're leading", ended handling, `both` Buy Now (clears the cart, full stock, `/checkout`), market comparison, pallet manifest, YouTube video, bid-history paging, watchers, share, push prompt, ISR and redirects, metadata. |
| **Strategy** | Extract `useAuctionDetail`, `useAuctionRealtime`, `useBidActions`, `useWatch` and `useAuctionBuyNow` (B.3) and cover them with regression tests. Then compose `components/concept-a/pages/AuctionPage.jsx` from `components/concept-a/auction/*` and `components/concept-a/detail/*`. Render the upcoming state (`UpcomingBox`) from `status=scheduled`. Show the sold/ended outcome only from client state or bid-eligibility, because the public API 404s after the end (G). Order of work: data hooks → bid panel → gallery and info → history → mobile bar and modals. |

### E.5 Buy Now detail `/shop/[id]`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/shop/[id]/page.js`; `frontend/src/app/(main)/shop/[id]/layout.js` |
| **Major components** | In-file: gallery, info card, `AccordionSection` (specs, shipping and pickup, returns), purchase panel, `Reveal`, `Toast`. External: `ShareProductModal.js`, `GradeBadge.jsx` |
| **Dependencies** | `CartProvider`, `AuthProvider` (wallet), `lib/marketplaceAdapters.js` (`isBuyNowAvailableForLot`), `lib/queryKeys.js` (`["sale-lot", id]`), `lib/saleLotMetadata.js` |
| **APIs** | `GET marketplace/sale-lots/{id}/`, `GET payments/wallet/me/`, cart endpoints |
| **Auth** | Optional (wallet line) |
| **WebSocket** | None |
| **Must not lose** | Sale-type guard; availability rule; discount display; low-stock line (≤ 3); cart-bound vs local quantity; `both` full-stock lock; "Buy-now closed" state; Buy Now → add → `/cart`; share; specs from `extra_data.specs`; Arabic title and description from `extra_data`; "Back to Buy Now" (`/browse?tab=buy_now`) on error. |
| **Strategy** | Extract `useBuyNowProduct` and `useCartLineForLot` (B.8). Compose `components/concept-a/pages/ProductPage.jsx` from `components/concept-a/detail/Gallery.jsx`, `components/concept-a/detail/LotStory.jsx`, `components/concept-a/detail/Specs.jsx`, `components/concept-a/detail/Services.jsx`, `components/concept-a/product/PurchasePanel.jsx` and `components/concept-a/product/MobileBuyBar.jsx`. Keep the `/shop/[id]` route: the preview's `/product/[slug]` is not a production route. This is the lowest-risk detail page, so do it first. |

### E.6 Live index and live viewer

| | |
|---|---|
| **Current page files** | Index: `frontend/src/app/(main)/live/page.js` (redirect) → `/browse?tab=live` → `frontend/src/components/marketplace/LiveAuctionsGrid.jsx`. Viewer: `frontend/src/app/(main)/live/[slug]/page.js`. |
| **Major components** | `LiveEventCard.jsx`, `LiveNowSection.jsx` (homepage); in the viewer: `StatusPill`, `GalleryCard`, `BidHistoryPanel`, local `useReconnectingSocket`, `Toast`. `WalletDepositModal.jsx`, `PushPrompt.jsx`. |
| **Dependencies** | `AuthProvider`, `lib/ws.js`, `lib/useCountdown.js`, `lib/youtube.js`, `lib/currency.js`, `lib/queryKeys.js` (`liveEvents`) |
| **APIs** | `GET live-auctions/public/events/?…` (grid), `GET …/public/events/by-slug/{slug}/`, `POST accounts/session/ws-ticket/`, `POST live-auctions/events/{id}/bid/`, `GET\|POST\|DELETE live-auctions/events/{id}/items/{itemId}/max-bid/`, `GET payments/wallet/me/`, `POST payments/wallet/top-up/` |
| **Auth** | Watching is public. Bid and proxy need a signed-in buyer; the ticket personalises the state. |
| **WebSocket** | `/ws/live-auctions/{id}/?ticket=` with `live_event_state` (`state_version`), `ping`, and close code 4403 |
| **Must not lose** | Slug and legacy-id redirects; ticket per connect; current-lot selection; statuses and labels; countdown and pause states; operator-driven advance ("Waiting for the next lot"); manual bid (desktop and mobile); proxy that can only be raised; deposit chip, modal and retry; wins banner; bid history ≤ 20 with YOU and AUTO; viewer count; connection pill; YouTube stream within the CSP. |
| **Strategy** | Index: restyle `LiveAuctionsGrid` and the card with `components/concept-a/home/LiveBand.jsx` and `components/concept-a/live/ComingUp.jsx`. Staged events have no start time (G). Viewer: extract the hooks in B.7, then compose `components/concept-a/pages/LivePage.jsx` from `components/concept-a/live/Stage.jsx`, `components/concept-a/live/LotConsole.jsx`, `components/concept-a/live/LotSequence.jsx` and `components/concept-a/live/ActivityFeed.jsx`, with `components/concept-a/ui/StickyBar.jsx` for mobile. Do not reproduce the preview's automatic next-lot or late-bid extension behaviour (G). Build after E.4, reusing its bidding UI parts. |

### E.7 Cart `/cart`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/cart/page.js` |
| **Major components** | In-file `CartItem` (row, stepper, remove confirmation), `CartContent`, `Toast`. External: `GradeBadge.jsx` |
| **Dependencies** | `CartProvider` (all mutations), `lib/cart.js` (unit and original price helpers) |
| **APIs** | Via `CartProvider`: `GET orders/cart/`, `POST orders/cart/items/`, `PATCH\|DELETE orders/cart/items/{id}/`, `DELETE orders/cart/`, `POST orders/cart/merge/` |
| **Auth** | None (guest cart; merged on login) |
| **WebSocket** | None |
| **Must not lose** | Optimistic edits with rollback; min 1 / max stock; locked rows (no stepper, no trash, lock message); remove confirmation; stock notes; invalid-stock gate on checkout; VAT-inclusive totals with an informational discount line; empty state; link to `/checkout`. |
| **Strategy** | There is no preview screen. Use the concept tokens plus `QuantityStepper` (locked mode), `Modal` (remove confirmation), `Money`, `Skeleton` and `Toaster`. `components/concept-a/layout/Drawers.jsx` (`BagDrawer`) can serve as the mini-cart pattern. Extract `useCartTotals` first. Showing server `can_checkout` / `unavailable_reason` is a functional change and needs approval. |

### E.8 Checkout `/checkout`

| | |
|---|---|
| **Current page file** | `frontend/src/app/(main)/checkout/page.js`, `frontend/src/app/(main)/checkout/checkout.css` |
| **Major components** | In-file `AddressModal`, `Modal`, `PaymentProcessing`, `CheckoutContent` (and the dead `PaymentMethodDrawer`). External: `frontend/src/components/account/AddressSelector.jsx`, `frontend/src/components/marketplace/CheckoutControls.jsx` (`OrderCoupon`, `CheckoutWallet`), `GradeBadge.jsx` |
| **Dependencies** | `AuthProvider` (buyer guard), `CartProvider` (`refreshCart`, `updateQuantity`, `removeItem`, `clearCart`), `lib/cart.js`, `lib/api.js` (`getCustomerApiErrorMessage`) |
| **APIs** | `GET\|PATCH orders/checkout/active/`, `GET accounts/addresses/?is_active=true`, `POST accounts/addresses/`, `PATCH accounts/addresses/{id}/`, `GET payments/wallet/me/`, `GET orders/pickup-locations/`, `POST orders/delivery/quote/`, `POST marketplace/cart/validate/`, `POST orders/checkout/`, `POST payments/groups/{ref}/create-payment/`, `POST payments/orders/{id}/create-payment/`, `DELETE orders/cart/` |
| **Auth** | Buyer required; anyone else → `/login?next=/cart` |
| **WebSocket** | None |
| **Must not lose** | Everything in inventory B.8: delivery vs pickup rules, address flow, debounced quote and signature gate, per-seller orders with COD eligibility, coupons per seller with automatic removal, wallet modes, submit pipeline (idempotency, deferred session, branches, recovery, retry), active-session resume/edit/cancel, cancel-and-clear, mobile pay bar. |
| **Strategy** | There is no preview screen; it needs a design extension using the concept's tokens and primitives. Extract all hooks and pure functions first (B.5). Then rebuild the UI component by component while keeping the pipeline untouched. Test every payment branch: single seller, multi-seller group, wallet-only, partial wallet, COD, deferred session, total changed, coupon removed. Make no decision on the dead drawer or the placeholder success screen without approval. |

### E.9 Payment pages `/payment/moyasar/[id]` and `/payment/result`

| | |
|---|---|
| **Current page files** | `frontend/src/app/payment/moyasar/[id]/page.js`, `frontend/src/app/payment/result/page.js`, `frontend/src/app/payment/layout.js` |
| **Major components** | In-file only |
| **Dependencies** | `AuthProvider` (`isBuyer`), `lib/api.js`, `lib/safeRedirect.js`, the Moyasar form script (CSP-allowed origin) |
| **APIs** | `GET payments/payment-records/{id}/status/`, `POST payments/payment-records/{id}/status/`, `POST payments/payment-records/{id}/attach-gateway/` |
| **Auth** | Session required (soft) |
| **WebSocket** | None |
| **Must not lose** | Moyasar `form_config` (amount in minor units, publishable key, `callback_url`, methods and networks, metadata, language from `<html lang>`); attach-gateway on completion; verification (POST with the gateway id, else 8 polls); status states; destination order (`return_to` → `checkout_credited` → `checkout_reference` → group → order → orders; staff → `/dashboard/orders`); automatic redirect when paid. The backend hard-codes these URLs. |
| **Strategy** | There is no preview screen. Extract `useMoyasarForm`, `usePaymentVerification` and `resolvePaymentReturnHref` (B.8). Restyle with a minimal branded layout (no Navbar, as today) and translate the copy. Keep the pinned form version and the Moyasar-owned card-field styling within what Moyasar allows (not verified). |

### E.10 Account `/account` (per tab)

**Common to every tab**

| | |
|---|---|
| **Page file** | `frontend/src/app/(main)/account/page.js` (shell: `AccountPageInner` 4366, `AccountContent` 1400, `Hero` 207, `Sidebar` 296, `AccountTabHeader` 612, `AlertBar` 386, `SuspensionBanner` 4287, `AccountLoading` 4264) |
| **Dependencies** | `AuthProvider` (buyer guard, `updateUser`, `refreshSession`), `lib/push.js`, `lib/attachmentImages.js`, `lib/currency.js`, `components/account/AddressSelector.jsx`, window events for the Navbar |
| **Auth** | Buyer required. Anonymous → `/login` (no `next`; adding it is a functional change). Staff → `/dashboard`. |
| **WebSocket** | None in the page; the Navbar socket reflects notification changes through `khaznah-notifications-updated`. |
| **Strategy** | There is no preview screen. Build the shell and tabs from concept primitives (`Drawer`, `Modal`, `Toaster`, `StatusLabel`, `Pagination`, `Money`, `Countdown`, `ListRow`/cards, `QuantityStepper`). Move each tab to its own container with its own hooks (B.1), one tab at a time, keeping the `?tab=` contract and its aliases. |

**Per tab**

| Tab | Current components (line) | APIs | Must not lose |
|---|---|---|---|
| `overview` | `RealOverview` 520 | `GET orders/orders/`, `GET payments/invoices/`, `GET payments/wallet/me/`, `GET accounts/addresses/`, then `GET marketplace/my-bids/`, `GET marketplace/watchlist/` | Tiles and wallet/orders cards; "N need payment" CTA. |
| `watchlist` (alias `bids`) | `Watchlist` 1839, `QuickBidAction` 1766, `TimeRemaining` 1821, `AuctionDrawer` 3732 | `GET marketplace/my-bids/`, `GET marketplace/watchlist/`, `POST marketplace/sale-lots/{id}/bid/`, `GET marketplace/sale-lots/{id}/` (authenticated), `GET …/bids/` | Merge of saved and bid lots; Winning/Outbid badges; live time left; QuickBid (min = current or start + increment); drawer bid log; "Open auction". There is no remove action; adding one would need approval. |
| `won` | `WonItems` 2655, `PayNowModal` 2346, `QuickAddAddressPopup` 2268 | `POST orders/orders/{id}/auction-delivery-address/`, `GET …/available-discounts/`, `POST …/apply-discount/`, `GET payments/wallet/me/`, `POST payments/orders/{id}/apply-wallet/`, `POST payments/orders/{id}/create-payment/`, `POST accounts/addresses/`, `GET payments/invoices/{id}/pdf/` | Pay-now pipeline and gating; coupon chips; partial wallet; invoice download; the empty state linking to `/browse`. |
| `orders` | `Orders` 2897, `OrderDrawer` 2006, `Delivery` 3923 | `GET orders/orders/` (8 per page, load more), `GET payments/invoices/`, `GET payments/payment-records/`, `GET orders/fulfillments/`, `GET orders/orders/{id}/`, `GET orders/orders/{id}/tracking/`, `POST payments/orders/{id}/create-payment/`, `POST payments/groups/{ref}/create-payment/`, invoice PDF | Status and fulfilment badges; multi-seller group pay banner and filter chip; drawer breakdown (VAT included); tracking with courier, AWB and map link; pickup code; `actionMessage` (move to toasts). |
| `wallet` (alias `deposits`) | `WalletPanel` 3211 | `GET payments/wallet/me/`, `GET payments/wallet/transactions/`, `GET\|PATCH\|DELETE payments/saved-methods/…`, `GET payments/payment-records/`, `POST payments/wallet/top-up/` | Top-up with quick amounts and redirect plus `khaznah-wallet-updated`; saved cards (default, auto-charge consent, remove); ledger; deposits list; load-error retry. |
| `payments` | `Payments` 3053 | `GET payments/payment-records/`, `GET payments/invoices/`, `GET payments/saved-methods/`, invoice PDF | Status tiles; history with the gateway link; invoice centre. |
| `disputes` | `Disputes` 3467, `DisputeModal` 4012 | `GET\|POST orders/disputes/`, `PATCH orders/disputes/{id}/`, `POST backend/attachments/` | Six dispute types; 10–2000 character description; evidence uploads (`attachment:<id>`, ≤ 12); cancel open disputes; the modal should load its own orders (functional fix, approval). |
| `notifications` | `NotificationsPanel` 1132 | `GET notifications/notifications/?page_size=10`, `GET notifications/summary/`, `PATCH notifications/notifications/{id}/`, `POST notifications/notifications/mark-all-read/` | Category filters; bidding payload details; action link marks the item read; load more; Navbar sync event. |
| `profile` | `RealProfile` 736, `PushNotificationsPanel` 653, `ProfileAvatar` 637 | `PATCH accounts/profile/` (JSON and multipart avatar), `POST accounts/password/change/`, `POST accounts/send-otp/`, `POST accounts/verify-otp/`, `GET accounts/session/`, addresses CRUD, push VAPID/subscribe/unsubscribe | Avatar upload; name and language; password change; email OTP verification; push toggle states; addresses with set-default and confirm-delete. The email and mobile fields are display-only today. |
| Shell | `SuspensionBanner` 4287 | `GET\|POST accounts/appeals/` | Suspension reason, block message, appeal status or form. |

### E.11 Login `/login` and Register `/register`

| | |
|---|---|
| **Current page files** | `frontend/src/app/(auth)/login/page.js`, `frontend/src/app/(auth)/register/page.js`, `frontend/src/app/(auth)/layout.js` |
| **Major components** | `LoginLanguageToggle.jsx` (shared with dashboard logins), `DashboardThemeSelector` (from `components/providers/DashboardThemeProvider.jsx`), in-file portal switches, `SellerRegisterPage` (imported from `app/seller/register/page.js`) |
| **Dependencies** | `AuthProvider` (`login`), `lib/safeRedirect.js`, `LangProvider` |
| **APIs** | `GET accounts/session/`, `POST accounts/session/login/`, `PATCH accounts/profile/`, `POST accounts/register/`, `POST accounts/send-otp/`, `POST accounts/verify-otp/` |
| **Auth** | Public. Login rejects non-buyer roles. |
| **WebSocket** | None |
| **Must not lose** | `next` handling and sanitisation; `registered` and `expired` banners; buyer-only rejection message; portal links to `/warehouse/login` and `/dashboard/login`; two-step registration with OTP resend cooldown and debug OTP; terms checkbox; seller registration entry. |
| **Strategy** | There is no preview screen. Build a customer auth shell on concept tokens and decouple it from `--dashboard-*` tokens and the dashboard theme selector. Leave the shared `LoginLanguageToggle` and `DashboardThemeProvider` untouched for the dashboard. `/seller/register` stays with the seller-portal phase; only move `SellerRegisterPage` out of the route file (B.8). Guest-cart merge after login is automatic via `CartProvider`. |

### E.12 Static pages, errors and 404

| | |
|---|---|
| **Current page files** | `frontend/src/app/(main)/{about,how-it-works,faq,contact,privacy,terms}/page.js`, `frontend/src/app/(main)/loading.js`, `frontend/src/app/(main)/auction/[slug]/error.js`, `frontend/src/app/(main)/seller/[code]/error.js`. There is no `not-found.js`. |
| **Major components** | All in-file: hero sections, FAQ search and single-open accordion, contact info cards and form, policy sections, and a local `Toast`/`showToast` (with `window.__*` timers) in each file. Images come from `frontend/public/images/khaznah-*-hero.webp`; How it works hot-links Unsplash and CloudFront images. |
| **Dependencies** | `LangProvider` (`t()` per file), `lib/api.js` (`notificationsApi` on contact only), `lucide-react` icons |
| **APIs** | Contact only: `GET notifications/support/contact/`, `POST notifications/support/message/` |
| **Auth / WebSocket** | None |
| **Must not lose** | Contact WhatsApp, email and phone links with the form and its error fallback; FAQ search and accordion; privacy and terms content; the `robots.txt` exclusions. |
| **Strategy** | There is no preview screen. Rebuild with `components/concept-a/ui/Type.jsx` (`SectionHead`), `components/concept-a/home/HowItWorks.jsx` and `components/concept-a/home/GradeFeature.jsx` patterns. Content needs owner review (the FAQ has one entry; stats and claims are hard-coded). Adding a branded `not-found.js` and an app-level `error.js` is additive and recommended. Per-page `metadata` requires a server wrapper, because these pages are client components. |

---

## F. Recommended phased implementation order

Rules for every phase:

- The acceptance baseline is inventory B.
- Check EN and AR (RTL) at 390, 768 and 1440 px.
- Check keyboard and screen-reader use.
- No console errors.
- No backend change.
- `/dashboard/**` and `/warehouse/**` stay visually and functionally unchanged.

1. **Phase 0: Preconditions (no UI change).**
   - The client approves one concept, and the decisions in section G are recorded.
   - `package.json` references Playwright (`e2e/critical.spec.js`), which is **not in the package (not verified)**. Confirm or write end-to-end coverage for:
     - guest cart → login merge → checkout (single and multi-seller) → Moyasar return;
     - bid, proxy, deposit top-up return and anti-snipe;
     - live bid over the ticketed socket;
     - PayNow for an auction win;
     - an RTL smoke test.
   - Capture baseline screenshots.
2. **Phase 1: Foundation.**
   - Customer token layer and fonts, scoped to customer layouts, after splitting `globals.css` (B.8).
   - Shared components:
     - `Logo`, `Money` (wrapping `formatSAR`), `DirIcon`
     - the customer i18n catalogue on the existing `LangProvider`
     - `Toaster`
     - `Modal`/`Drawer`/`useOverlay`, `Skeleton`, `Reveal`, `MotionRoot`
     - the shared clock and `Countdown`
     - `Button`, `StatusLabel`, `GradeChip`, `QuantityStepper`, `LotImage` (on `next/image`)
   - No page changes yet.
3. **Phase 2: Global chrome.**
   - Extract the Navbar hooks, then ship the new header, mobile menu and footer, with the country switcher and notification bell kept.
4. **Phase 3: Discovery.**
   1. The card set, driven by `marketplaceAdapters.js`.
   2. Browse and the seller storefront together, after the `useBrowse*` extraction.
   3. The live index grid and card.
   4. The homepage, after `useHomepageData`.
5. **Phase 4: Detail pages.**
   1. Shop detail (lowest risk).
   2. Auction detail, after the hook extraction and full B.3 regression.
   3. The live viewer, after the hook extraction, reusing the bidding UI.
6. **Phase 5: Transactions.**
   1. Cart.
   2. Checkout, with hooks first and every payment branch tested.
   3. The Moyasar page and payment result.
7. **Phase 6: Account and auth.**
   1. The account shell.
   2. Tabs in this order: orders and won (payments), then wallet and payments, disputes, notifications, profile, watchlist and overview.
   3. Login and register (decoupled from the dashboard theme).
8. **Phase 7: Content, errors, SEO, cleanup.**
   - Static pages; branded 404 and error pages.
   - Page metadata. JSON-LD and hreflang only with approval, and correct `llms.txt`.
   - Delete dead code: account dead components, `CartHero`, the unused homepage components and reactbits.
   - Remove the old `components/marketplace/*` visuals that have been replaced.

---

## G. Known gaps between the preview and production

Each production-side statement below was verified in the reference source. For each gap: reconcile it before implementation, or approve it as a functional change. **Nothing in this table is decided by this document** — rows marked B or LEGAL need the product owner's or legal team's decision, not an assumption.

**Classification (Phase 1B).** Every row has exactly one primary class; secondary considerations are named in the last column.

| Class | Meaning | Rows | Count |
|---|---|---|---|
| **P** | Presentation only — visual or demo behaviour; no production functionality change | 1, 11, 13, 20 | 4 |
| **F** | Future frontend implementation decision — decided while implementing the selected concept | 6, 7, 8, 9, 10, 17, 19, 22, 24, 25, 27, 28 | 12 |
| **B** | Business decision required — product owner / client decides | 5, 16, 18, 23, 26 | 5 |
| **API** | Backend/API enhancement required — cannot be built accurately on the current API | 2, 3, 4, 12, 14, 15, 29, 30 | 8 |
| **LEGAL** | Legal/compliance wording approval required — do not implement automatically | 21, 31 | 2 |
| | **Total** (27 from Phase 1 + 4 added during the Phase 1B claims audit) | | **31** |

Of the original 27 rows: P 4, F 11, B 5, API 6, LEGAL 1. Rows 28–31 were added in Phase 1B.

"Preview shows" describes the preview **after** the Phase 1B corrections (see the Phase 1B section of `DESIGN_CONCEPT_IMPLEMENTATION_READINESS.md`).

| # | Area | Class | Preview shows | Production (verified) | Reconcile by |
|---|---|---|---|---|---|
| 1 | Seller ratings, reviews, follow | **P** | Not shown | No model fields or endpoints exist (`marketplace`, `operations`, `accounts`). | Keep them out. |
| 2 | Seller profile content | **API** | Tagline, description, cover, monogram colour, pickup address and hours, and a neutral "Seller warehouse" label (`components/concept-a/seller/*`, `components/concept-a/detail/SellerCard.jsx`). The Phase 1 "Verified warehouse" badge and verification ticks were removed in Phase 1B. | `GET marketplace/sellers/{code}/` returns only `code, name, city, member_since, active_auction_count, buy_now_count, live_now, entitlements`. `orders/pickup-locations/` requires authentication. There is no "verified" flag; public sellers are active, subscription-eligible warehouses. | New fields or endpoint (API), or a static content map keyed by seller code (B: who owns that content). Any future trust badge needs a real data source and LEGAL sign-off. |
| 3 | Seller directory | **API** | "Sellers" nav → `/seller`; `SellersFeature` lists all sellers; Concept C's "Across the Kingdom" city index | No public seller-list endpoint and no `/seller` index route. | Approve an endpoint, or use a curated code list with per-code lookups (B). |
| 4 | Location on cards and detail | **API** | Seller or warehouse city | The public serializer emits only `warehouse.code` to anonymous and `buyer` users (`backend-reference/marketplace/serializers.py:228-254`). `trade_buyer` is treated as an operator and gets city and region. The seller endpoint does expose `city`. Consequence: `sellerCodeForLot` can't see `warehouse_type`, so Main-warehouse lots show their real code instead of `KHAZNA`. | Serializer change (API), or take the city from the seller lookup. Decide the `KHAZNA` display rule (B). |
| 5 | Finished auctions and sold-out items | **B** | Sold and ended lot pages (`AuctionOutcome`), sold cards, sold lots in browse; a sold-out Buy Now page (`/product/tyre-inflator`) that links to similar items | List, detail and by-slug return 404 once `end_time` passes (`filter_public_sale_lots`), including for the winner. Browse requests `status=live` only. A Buy Now lot that sells out becomes `SOLD` and inactive (`orders/views.py` ~2124), so it disappears. | Decide whether results or sold-out items are ever shown publicly (B). If yes, API changes follow; if no, show outcomes only to users already on the page, or in the account area. |
| 6 | Upcoming lots | **F** | An upcoming state whose action is now **Watch** (adds the lot to the watchlist); the Phase 1 "Remind me … we'll remind you" promise was removed in Phase 1B | Scheduled lots are public and watchable, and `featured` includes them, but the current detail page has no upcoming UI. No start notification exists; watching only triggers "Auction activity" on bids, at most once per 15 min. | Build the upcoming state (the data exists). Keep the Watch wording; a start reminder would be new API scope (see row 29). |
| 7 | Anti-snipe wording | **F** | "Bids in the last 5 minutes extend the auction by 5 minutes" | Backend defaults are a 300 s window and 300 s extension (`backend-reference/marketplace/models.py:148-150`). The current production UI says "2 minutes" (`AuctionDetailClient.jsx:2161`). | Render the wording from `anti_snipe_enabled`, `anti_snipe_window_seconds` and `anti_snipe_extend_seconds` in the detail payload. |
| 8 | First-bid minimum and quick bids | **F** | First bid = starting bid; quick-bid chips from there (timed and live) | REST requires `starting_bid + 0.01` for the first timed bid; the WebSocket reports `starting_bid`. Live auctions use `starting_bid`. Production has no quick-bid chips. | Base chips on bid-eligibility `minimum_next_bid` or `next_valid_bid`. Chips are an additive UI change and still go through confirm and REST. |
| 9 | Bidder states | **F** | `neutral, highest, outbid, won, lost` | `neutral, highest, outbid, winner, ended_outbid, ended` (`views.py` `auction_bidder_state`). | Map the states, and add an "ended, no bid" state. |
| 10 | Urgency and countdown | **F** | Urgent < 1 h, critical < 10 min; days shown | Production: urgent < 10 min, critical < 3 min (browse, auction, homepage); hours uncapped; live `m:ss`. | Pick one set of thresholds. Adopting days is display-only. |
| 11 | Live sequencing | **P** | "Waiting for the next lot" between lots (production wording since Phase 1B), but the demo still advances to the next lot by itself and a late bid resets the clock to 12 s, so the live room keeps moving during a presentation | The operator starts each lot; there is no automatic advance and no automatic live anti-sniping (the operator may extend). | Demo behaviour only: keep the operator-driven flow. Don't imply automatic extension. "Going once" may stay as a pure time cue. |
| 12 | Live schedule metadata | **API** | "Coming up" events with countdowns and a presenter name | Events have no scheduled-start or presenter field (`started_at`, `ended_at`, `created_at` only). `status_group=upcoming` lists staged events without a time. | Add fields (API), or show "Starting soon" with no clock and drop the presenter. |
| 13 | Reserve | **P** | No reserve UI; live `reserve_not_met` shown as "Passed"/"Not sold" (Concept D's "Reserve not met" label was changed in Phase 1B) | The reserve price is deactivated system-wide (`views.py:1251`). Live `reserve_not_met` means no bids. | Never show "reserve" wording; label the outcome "Unsold". |
| 14 | Watch state | **API** | Watched state on cards; header watchlist drawer | Listings are anonymous with no per-user flag. The watchlist API allows at most 8 per page, and a `?sale_lot=` filter exists. | Detail page: check `watchlist/?sale_lot={id}` (F), which also fixes the never-loaded state. Card-level state needs several pages or an approved backend change (API). |
| 15 | Product content | **API** | Bilingual title and description, highlights, specs, condition note, lot number | Single-language `title` and `description`. Arabic only via free-form `extra_data.title_ar`/`description_ar`. The auction adapter hard-codes `specs: []`. No highlights or condition-note fields. Identity is SKU or slug. | Structured fields need backend work (API). Until then the design must degrade gracefully when Arabic, specs or highlights are missing (F). |
| 16 | Browse contract | **B** | Default "All" tab; sorts recommended, newest, most bids; category slugs (`?category=bulk-pallets`); price 0–10,000 step 50 | Tabs auction, buy_now, live; sorts `ending`, `price_low`, `price_high`. The backend can order by `bid_count` and `created_at`, but has no "recommended". Categories are filtered by English name (`category_name`) with no slug filter. Price 0–100,000 step 500. | Keep the production URL contract (inbound links). Any new tab or sort needs approval (B) and a semantic definition; "recommended" would also need API work. |
| 17 | Paging | **F** | Numbered pages or "load more" | Infinite scroll mixed with numbered pages (browse), "load more" elsewhere. | Choose one model (functional decision). |
| 18 | Homepage sections | **B** | No Featured, Hot, ticker, country empty state or mobile ending-soon bar; adds a stats band (figures from the current About page) and a newsletter sign-up | Featured shows seller-requested placements after moderation (`featured_status=approved`, `is_featured_on_homepage`). Hot, ticker, empty state and mobile bar exist. There is no stats endpoint (About hard-codes other numbers) and no newsletter backend. | Keep Featured; decide on the rest (B). Live stats or a newsletter need a data source or backend (API). |
| 19 | Header | **F** | No country switcher, no notification bell; Concept B shows a "Deliver to" city picker (concept idea) | Both exist and carry logic (country scoping; ticketed notification socket). Production scopes by country, not city. | Add both to the approved header. A city picker must not imply city-level filtering (B if kept). |
| 20 | Onboarding and sign-in copy | **P** | "Create your account with your email and confirm it with a one-time code"; Concept B's sign-in dialog uses email and password (changed from mobile number in Phase 1B) | Email and password with an email OTP. Phone is optional and never verified. There is no password reset. | Keep the copy aligned; do not promise phone verification or password reset. |
| 21 | Payment and deposit claims | **LEGAL** | mada, Visa, Mastercard and the Khazna wallet only; "refundable bidding deposit" covered by the wallet balance; "pay within 24 hours" for timed-auction wins only (Phase 1B removed STC Pay, "held … released", "never charged unless you win" and the 24-hour promise after Buy Now and in the live room) | Moyasar defaults are `creditcard` with the mada, visa and mastercard networks (env-configurable; production values not verified). Timed-auction eligibility comes from wallet coverage (not debited) or a paid deposit; top-ups are real charges; wins are charged automatically from the wallet, then from a consented saved card. The 24 h window applies to timed wins only; live wins have no deadline. Production's own footer and legal pages list STC Pay and Apple Pay. | Legal and business review of all payment, deposit and refund copy. Show only the methods that are actually enabled. |
| 22 | Locale and routes | **F** | `/en\|ar/concept-x/…`; `/product/[slug]`, `/live-auction` | Locale lives in localStorage and the profile with fixed URLs; the routes are `/shop/[id]` (numeric) and `/live/[slug]`. The backend hard-codes several customer URLs (inventory A.3). | Port components and strings, not routing. |
| 23 | Theme, fonts and brand | **B** | Light/dark switch; next/font brand families; "Khazna" | The customer site has no dark mode (dashboard theme only on the auth pages). Only the riyal glyph font is loaded. The UI and metadata say "Khaznah" (52 occurrences), while the backend names the Main seller "Khazna" (`KHAZNA`). | Dark mode is new scope (B). Add fonts through `next/font` (F). Decide one brand spelling (B). |
| 24 | Images | **F** | Plain `<img>` with local srcsets | `next/image` with `remotePatterns` (S3, API host, `i.ytimg.com`), qualities 65/75, WebP. | Build `LotImage` on `next/image`. |
| 25 | Screens not designed | **F** | — | Cart, checkout, payment, account (9 tabs), login/register, static pages and 404 have no preview screens. | Extend the approved concept before phases 5–7. |
| 26 | Additive features | **B** | Mini-cart drawer, live search suggestions, gallery lightbox and swipe, quick bids | None exist in production. Each can be built without backend changes: `useCart()`; `sale-lots/?search=&status=live` (anonymous, 10 s server cache, anonymous throttle 200/min); client-only gallery; eligibility-based chips. | Confirm each addition with the client (B); then F. |
| 27 | Existing broken or missing links | **F** | — | `/account/orders/{id}` (backend notification links) and `/orders/1` (checkout placeholder) have no route. `llms.txt` claims JSON-LD that doesn't exist. | Adding routes or JSON-LD is a functional change; approve separately. |
| 28 | Buy Now on auction lots ("both") | **F** | A confirm step that completes the purchase and closes the auction at once (A, B, D); Concept C adds the full lot to the cart | Buy Now on a "both" lot goes through the cart for the full quantity and is refused once bidding reaches the Buy Now price; "the buy-now purchase will close the auction" (`orders/views.py` ~690-710). The current page clears the cart first (`replaceWithItem`). | Keep production's cart → checkout flow behind whichever confirm step the concept uses. |
| 29 | Live-event reminders | **API** | "Remind me" on upcoming live events with a "Reminder set" confirmation (kept as a concept idea) | No reminder, subscription or scheduled notification exists for live events (`liveauctions`, `notifications`). | New backend scope (API) plus a decision on channels (B); until then, hide the control or link to the event. |
| 30 | Marketplace bid ticker (Concept D) | **API** | A home "Live bids" ticker, built from the sample bid history | Bid history is paged at 8 per request (`sale-lots/{id}/bids/`); there is no cross-lot activity feed or aggregate endpoint. | A real marketplace-wide bid ticker needs an aggregate bid feed (API); until then, feed it from the homepage sections and the sockets of lots already on screen, or hide it. |
| 31 | Brand promise wording | **LEGAL** | The brand tagline "Safe deals, smart choices" and the seven K-H-A-Z-N-A-H values from the 2026 brand guideline (e.g. "Zero risk — minimising fraud and ensuring secure user experiences", "Assurance") | Brand content, not platform behaviour. | Legal/compliance approval of promise-style wording before launch. |
