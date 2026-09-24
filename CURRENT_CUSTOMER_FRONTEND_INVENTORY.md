# Current Customer Frontend Inventory — Khazna

Inventory of the existing customer-facing system, verified against the reduced production reference package (`khazna-claude-customer-redesign`). Production code was not modified.

**Architecture in brief**

- **Frontend:** Next.js 16 App Router, React 19, Tailwind CSS v4, TanStack Query v5, `lucide-react`, `motion` and GSAP.
- **Rendering:** Almost every customer page is a client component. The homepage, auction detail and seller storefront have thin server entries that fetch a first snapshot (ISR for 20 s, 15 s and 60 s respectively).
- **Backend:** Django REST (`/api/v1/`) with Django Channels WebSockets. Auth is an in-memory JWT access token plus an HttpOnly refresh cookie. Guest carts use an HttpOnly cookie. Payments go through a Moyasar hosted form plus a buyer wallet.
- **Provider tree:** `app/layout.js` wraps everything in `ReactQueryProvider` → `AuthProvider`. The `(main)` group adds `CustomerLocaleProvider` → `CountryProvider` → `CartProvider` around `Navbar` / `<main>` / `Footer`.
- **Language and direction:** EN/AR is a client-side preference (localStorage plus the profile), not part of the URL. RTL is applied to `<html>`.
- **Very large page files:**

  | File | Lines |
  |---|---|
  | `frontend/src/app/(main)/account/page.js` | 5,465 |
  | `frontend/src/app/(main)/page-client.jsx` | 2,964 |
  | `frontend/src/app/(main)/auction/[slug]/AuctionDetailClient.jsx` | 2,961 |
  | `frontend/src/app/(main)/browse/page.js` | 2,421 |
  | `frontend/src/app/(main)/checkout/page.js` | 1,783 |

**How to read this document**

- **Paths** are relative to the package root (`frontend/…`, `backend-reference/…`).
- **Line numbers** refer to this package snapshot.
- **API paths** are relative to `/api/v1/`.
- **"Buyer"** means the role `buyer` or `trade_buyer`.
- **Verification:** claims come from reading the source. Anything the package cannot prove is marked **not verified**. Nothing here was checked in a running browser.

---

## A. Public/customer routes

### A.1 Page routes

| Route | Page file(s) | Purpose | Auth required? | Notes (params, redirects, rendering) |
|---|---|---|---|---|
| `/` | `frontend/src/app/(main)/page.js` → `frontend/src/app/(main)/page-client.jsx` | Homepage: live ticker, hero carousel, featured, Live Now, ending soon, hot, Buy Now, country empty state | No. Watch needs sign-in; cart works for guests. | Server entry uses `revalidate = 20` and reads the `khaznah-country` cookie. It calls `GET marketplace/homepage/?country=XX` with tag `marketplace-homepage` and a 2.5 s timeout, passing `null` on failure. The client re-queries every 30 s. |
| `/browse` | `frontend/src/app/(main)/browse/page.js` (`BrowsePage` renders the named export `BrowseContent`) | Unified catalogue with tabs Auctions / Buy now / Live | No. Watch needs sign-in. | Client page. State is read on mount and on `popstate`, and written with `history.replaceState` (see B.1 for the params). No page metadata. |
| `/auction/[slug]` | `frontend/src/app/(main)/auction/[slug]/page.js` (server) → `AuctionDetailClient.jsx`, plus `layout.js` (metadata), `loading.js` and `error.js` in the same folder | Timed-auction lot detail, bidding, proxy bid, Buy Now on `both` lots | Viewing: no. Bid, proxy, watch, deposit: signed-in buyer. | Uses `revalidate = 15` and fetches `GET marketplace/sale-lots/by-slug/{slug}/`. `redirect_slug` redirects to the canonical slug. An all-digit slug falls back to `sale-lots/{id}/` and then redirects to the slug. There is no `notFound()`, so unknown or ended lots render the client error card. |
| `/shop/[id]` | `frontend/src/app/(main)/shop/[id]/page.js` (client), `frontend/src/app/(main)/shop/[id]/layout.js` (metadata) | Buy Now product detail | No. A wallet line shows when signed in. | Numeric sale-lot id only (no slug). Throws "This listing is not available as a Buy Now product." unless `sale_type` is `buy_now` or `both`. The canonical URL is `/shop/{id}`. |
| `/live` | `frontend/src/app/(main)/live/page.js` | Legacy live index | No | Server `redirect("/browse?tab=live")`. The Navbar "Live" link points here. |
| `/live/[slug]` | `frontend/src/app/(main)/live/[slug]/page.js` (client, 990 lines) | Presenter-led live auction viewer | Watching: no. Bid and proxy: signed-in buyer. | Resolves the slug via `live-auctions/public/events/by-slug/{slug}/`. `redirect_slug` triggers `router.replace`. A numeric slug uses a `publicEvents({id})` fallback. An unknown slug never leaves the spinner; after 8 s it reads "Could not reach the live event. Retrying…". |
| `/seller/[code]` | `frontend/src/app/(main)/seller/[code]/page.js` (server) → `BrowseContent`, plus `frontend/src/app/(main)/seller/[code]/error.js` | Public seller storefront (browse scoped to one warehouse) | No | Uses `revalidate = 60`. The code is upper-cased and looked up via `GET marketplace/sellers/{CODE}/`. A 404 calls `notFound()`, which shows the default Next 404 because there is no custom page. Other failures go to the error boundary. `KHAZNA` is the platform alias. The code `REGISTER` is shadowed by `/seller/register`. |
| `/cart` | `frontend/src/app/(main)/cart/page.js` | Cart | No. Guest carts are supported. | "Proceed to Checkout" links to `/checkout`. |
| `/checkout` | `frontend/src/app/(main)/checkout/page.js`, `frontend/src/app/(main)/checkout/checkout.css` | Checkout: delivery/pickup, one order per seller, coupons, wallet, COD | **Yes, buyer only.** Anyone else gets `router.replace("/login?next=/cart")`. | Resumes an active deferred checkout session. Redirects the browser to the backend's `payment_page_url` or `transaction_url`. |
| `/payment/moyasar/[id]` | `frontend/src/app/payment/moyasar/[id]/page.js` (layout `frontend/src/app/payment/layout.js`) | Moyasar card form for a payment record | No client guard. API calls use the session, and failures show an error. | Loads `moyasar-payment-form@2.2.10` JS and CSS from cdn.jsdelivr.net. No Navbar or Footer. English only. |
| `/payment/result` | `frontend/src/app/payment/result/page.js` | Gateway return and payment verification | Soft. Anonymous users see "Please log in again to verify this payment." | Params: `payment_record_id` (required), `id` or `payment_id` (gateway id). Redirects automatically once paid (see B.8). English only. |
| `/account` | `frontend/src/app/(main)/account/page.js` | Buyer hub with 9 tabs | **Yes, buyer only.** Anonymous → `/login` (no `next`). Staff and warehouse users → `/dashboard`. | `?tab=overview\|watchlist\|won\|orders\|wallet\|payments\|disputes\|notifications\|profile`. Aliases: `deposits→wallet`, `bids→watchlist`. Unknown values fall back to overview. Tab changes use `replaceState`. `order`, `group` and `case` params are generated elsewhere but ignored here. |
| `/account/watchlist` | `frontend/src/app/(main)/account/watchlist/page.js` | Legacy alias | No | Client `window.location.replace("/account?tab=watchlist")`. |
| `/login` | `frontend/src/app/(auth)/login/page.js` (layout `frontend/src/app/(auth)/layout.js`) | Buyer sign-in | No | `next` (sanitised by `lib/safeRedirect.js`), `registered=1`, `expired=1`. The `verified=1` param is sent by register but never read. Non-buyer roles are rejected. Portal switch links to `/warehouse/login` and `/dashboard/login`. No Navbar or Footer. Uses the dashboard theme tokens and selector. |
| `/register` | `frontend/src/app/(auth)/register/page.js` | Buyer registration with an email OTP step | No | Success → `/login?registered=1&verified=1`. `next` is not carried through. "Seller" swaps in `SellerRegisterPage` in place. |
| `/seller/register` | `frontend/src/app/seller/register/page.js` (layout `frontend/src/app/seller/layout.js`) | Public seller (warehouse) signup with plan picker | No | Auto-login on success, then "Go to my dashboard" (`/dashboard`). This is seller onboarding and borderline in scope (see the file map). |
| `/about` | `frontend/src/app/(main)/about/page.js` | About page | No | Client component with no API calls and hard-coded stats. |
| `/how-it-works` | `frontend/src/app/(main)/how-it-works/page.js` | Steps and features | No | Images are hot-linked from Unsplash and CloudFront. |
| `/faq` | `frontend/src/app/(main)/faq/page.js` | Searchable FAQ accordion | No | Only one Q&A exists (placeholder comments at `faq/page.js:55,63`). |
| `/contact` | `frontend/src/app/(main)/contact/page.js` | Support contacts and message form | No | `GET notifications/support/contact/` and `POST notifications/support/message/` (both unauthenticated). |
| `/privacy` | `frontend/src/app/(main)/privacy/page.js` | Privacy policy | No | Static text, "Last updated: January 2025". |
| `/terms` | `frontend/src/app/(main)/terms/page.js` | Terms and conditions | No | Static text, "Last updated: January 2025". |

### A.2 Route infrastructure

| Item | File | Notes |
|---|---|---|
| Root layout | `frontend/src/app/layout.js` | Metadata: title "Khaznah - Auction House", `/icon.svg`. A pre-paint inline script sets `<html lang/dir>` from `khaznah-customer-language` or `khaznah-dashboard-language`. Also a dashboard-theme pre-paint script, a riyal font preload and an API preconnect. |
| `(main)` layout | `frontend/src/app/(main)/layout.js` | Server component that composes the locale, country and cart providers plus `Navbar`, `<main>` and `Footer`. Pages also render their own `<main>`, so `<main>` elements are nested. |
| `(main)` loading | `frontend/src/app/(main)/loading.js` | A 430 px dark block plus 8 skeleton cards. |
| `(auth)` layout | `frontend/src/app/(auth)/layout.js` | `CustomerLocaleProvider` + `DashboardThemeProvider`. No chrome. |
| Payment layout | `frontend/src/app/payment/layout.js` | `CustomerLocaleProvider` only. |
| Seller layout | `frontend/src/app/seller/layout.js` | `CustomerLocaleProvider` + `DashboardThemeProvider`. |
| Error boundaries | `frontend/src/app/(main)/auction/[slug]/error.js`, `frontend/src/app/(main)/seller/[code]/error.js` | These are the only ones. There is no app-level `error.js`, `global-error.js` or `not-found.js`. |
| Route handler `/country-pref` | `frontend/src/app/country-pref/route.js` | `POST {code}` sets the HttpOnly `khaznah-country` cookie (1 year, Lax). |
| Route handler `/health` | `frontend/src/app/health/route.js` | `GET` returns `{status:"ok"}` with `no-store`. |
| Static files | `frontend/public/robots.txt`, `frontend/public/llms.txt`, `frontend/public/sw.js`, `frontend/public/fonts/riyal-regular.woff2`, `frontend/public/images/*`, `frontend/src/app/icon.svg`, `frontend/src/app/favicon.ico` | `robots.txt` disallows `/account/`, `/checkout/`, `/payment/`, `/dashboard/`, `/warehouse/`. `sw.js` is the push service worker; it uses `/next.svg` as the notification icon. |
| Security headers | `frontend/next.config.mjs` | CSP allows script and style from `cdn.jsdelivr.net` (Moyasar), `frame-src` YouTube / youtube-nocookie, and `font-src 'self' data:`. Also `X-Frame-Options: DENY` and `output: "standalone"`. `images.remotePatterns` covers S3, the API host, `i.ytimg.com`, Unsplash and CloudFront. |

### A.3 Routes referenced but not implemented

| Referenced URL | Referenced by | Result today |
|---|---|---|
| `/account/orders/{id}` | Backend notification `action_url` for order events (`backend-reference/orders/views.py:629`) and "Auction won" (`backend-reference/backend/celery_jobs.py:155`) | No such route exists; the default Next 404. |
| `/orders/1` | Checkout placeholder success screen, "Track Order" (`checkout/page.js:1309`) | No such route exists; 404. |
| `/seller` (index) | No production link found | No such route. There is also no public seller-list endpoint. |

Backend-generated links that do resolve:

- `/auction/{sale_lot_id}` (numeric; redirected to the slug)
- `/live/{slug|id}`
- `/payment/moyasar/{id}`
- `/payment/result?payment_record_id=…`
- `/account?tab=orders&order={id}`
- `/account?tab=notifications`

These must keep working.

### A.4 Out of scope (exist; noted only)

- **Out-of-scope routes:**
  - `/dashboard/**`: 28 `page.js` files, including `/dashboard/login` and the operator console `/dashboard/live-auctions/[id]`.
  - `/warehouse/login`.
- **Customer UI links into them from:**
  - the Navbar admin "Dashboard" link
  - the non-buyer account menu
  - the login portal switch
  - the payment result page (staff are sent to `/dashboard/orders`)
  - seller registration success

---

## B. Main customer features that must be preserved

Each group lists current behaviour. Behaviour that looks unintended is marked **Quirk**. The redesign keeps a quirk unless a functional change is approved separately.

### B.1 Browsing, search, categories, filters, sorting (`/browse`, `/seller/[code]`, header search)

- **Tabs:** Auctions (default), Buy now, Live. The tab switcher is hidden when only one tab is allowed. `changeTab` resets `page`. Moving to Buy now resets "ending". Moving away from Buy now resets "in stock" and "discounted".
- **URL contract** (inbound links depend on it):

  | Param | Meaning |
  |---|---|
  | `tab` | `auction` \| `buy_now` (also accepts `buynow`) \| `live` |
  | `search` | Free text |
  | `category` | Comma list of **English category names**, plus the sentinel `__uncategorized__` |
  | `condition` | Grade keys (B.14) |
  | `location` | Comma list of city/region strings |
  | `item_type` | `bulk`, `pallet` |
  | `min_price`, `max_price` | Numbers |
  | `ending` | `1h`, `6h`, `24h` (auction tab) |
  | `in_stock`, `has_discount` | `true` (Buy now tab) |
  | `sort` | `ending` \| `price_low` \| `price_high` |
  | `page` | Integer ≥ 1 |

  - Inbound producers:
    - Navbar search: `/browse?tab={auction|buy_now}&search=`, plus the window event `khaznah-marketplace-search`.
    - Homepage: `?tab=auction&category={EnglishName}`, `?tab=auction&sort=ending`, `?tab=buy_now`, `?tab=live`.
    - `/live` redirect.
- **Search:** Browse debounces search by 350 ms. Backend search covers title, description, slug, SKU, stock title/description, category name and warehouse name/code.
- **Filters:**

  | Filter | Details |
  |---|---|
  | Condition | 10 grades |
  | Item type | Bulk / Pallet. Sent as `stock_item__item_type` only when exactly one is chosen. |
  | Category | Checkbox list. Desktop shows only the first 10. |
  | Location | Hidden on seller pages. Desktop shows the first 8. |
  | Price | Two inputs plus a dual slider, 0–100,000 in steps of 500. Typed values may exceed the slider. |
  | Buy now: availability | "In stock only" and "Discounted products" |
  | Auction: ending | "Any / 1 h / 6 h / 24 h" |

  - **Clear filters** keeps the search term and the sort.
- **Buy-now category rail:** round thumbnails, single-select. Order is "All products", then the synthetic "Uncategorized", then categories with "{n} items".
- **Sort → API `ordering`:**

  | Sort value | Auctions | Buy now |
  |---|---|---|
  | `ending` (labelled "Newest" on Buy now) | `end_time` | `-created_at` |
  | `price_low` | `current_bid` | `buy_now_price` |
  | `price_high` | `-current_bid` | `-buy_now_price` |

- **Views:** Grid or List (not persisted). Grid columns: 2, then 4 from 640 px, then 5 from 1280 px.
- **Loading more:** `PAGE_SIZE = 20`. An infinite-scroll sentinel (600 px margin) runs alongside a numbered pager, and the next page is prefetched.
- **Listing request:**
  - Always sent **anonymously** with `status=live`.
  - The auction tab adds `auction_only=true`.
  - The Buy now tab adds `sale_type=buy_now&price_mode=buy_now`.
  - `country=XX` is appended automatically (`lib/country.js`).
  - Server cache is 10 s whenever `status=live` or `auction_only` is sent (so every browse request), and 60 s otherwise.
- **Filter options:**
  - Categories come from `marketplace/categories/options/[?seller=]`. They include only categories with live, in-stock `buy_now`/`both` lots.
  - Locations come from `operations/warehouses/public-options/`.
  - Both are cached for 15 min. They refresh on BroadcastChannel `khaznah-marketplace` `{type:"categories-updated"}` or the window event `khaznah-categories-updated`.
- **Countdown on cards:** one page-level 1 s ticker. Cards are urgent below 10 min and critical below 3 min.
- **Expired lots:** removed client-side, and a card returns `null` once its end time passes.
- **Live tab:** `LiveAuctionsGrid` (see B.4).
- **Quirks:**
  - The seller-storefront Live tab checks `entitlements.live_auctions`, but the backend sends `entitlements.live` (`browse/page.js:1226`).
  - Watch on cards can only add; there is no watched state on cards.
  - Before hydration the empty state ("No matching …", "0 of 0 shown") renders, because `listingParams` is null.
  - At 1280 px and above, the "Ending time" and "Discounted" filters are unreachable (they exist only in the drawer).
  - `sale_type=both` lots never appear in the Buy now tab.
  - Numbered pages merge into the infinite list.
  - The Live tab shows filters that it ignores.
  - The `khaznah-browse-tab-changed` event has no listener.

### B.2 Buy Now (fixed price)

- **Card** (`frontend/src/components/marketplace/BuyNowCard.jsx`):
  - Shows the price (`final_price ?? buy_now_price`), a discount %, the struck-through original price with "Save X", and "{n} in stock" / "Out of stock".
  - The CTA label is "Add to cart", "Add Full Pallet" (pallet), "Buy Full Lot" (`sale_type=both`) or "Out of stock".
  - Adds with quantity 1. The server raises full-stock lots to the full quantity.
  - When the item is in the cart, the card shows a stepper bound to the cart. "−" is disabled for full-stock lots.
- **Full-stock / pallet lock:**
  - The server marks auction/`both` lots and pallets as `full_stock_required`. `purchase_mode` is `auction_lot`, `full_lot` or `flexible_quantity`, and `minimum_purchase_quantity` is set accordingly.
  - The UI locks the quantity to the full stock (cart, card, shop page).
  - Checkout rejects partial quantities of pallets or `both` lots.
  - It also rejects `both` lots once `current_bid ≥ buy_now_price`.
  - It rejects any lot with `requires_deposit=true`, so `both` lots can't be bought via Buy Now while the deposit policy is on (`backend-reference/marketplace/serializers.py`).
- **Detail** (`/shop/[id]`):
  - Availability requires all of: `status==="live"`, active, `quantity_available>0`, and `isBuyNowAvailableForLot` (for `both`: `current_bid < buy_now_price`).
  - Price block: "Discount applied" chip, original and final price, "You save X". Stock line: "{stock} available", or "Only N left!" when there are 3 or fewer.
  - Quantity has two modes: bound to the cart ("In your cart", typing updates the cart; 0 removes the line), or a local stepper clamped to stock. `both` lots are locked to full stock.
  - "Add to cart". "Buy Now" = add, then `router.push("/cart")` (the copy says "Skip the cart", which doesn't match what happens).
  - Wallet balance shows when signed in. "Share this item" opens the share modal.
  - Accordions: Specifications (`extra_data.specs`), Shipping & Pickup, Return Policy (3 fixed lines).
  - Arabic title and description come from `extra_data.title_ar` / `description_ar`.
- **Quirks:**
  - SKU and image are not mapped on the shop page, so the SKU line never renders.
  - An empty Specifications panel still renders.
  - No video, pallet contents, watch button, related items or mobile sticky CTA.

### B.3 Timed auctions and bidding rules (backend-verified)

**Minimum bid**

| Source | First bid (no bids yet) | Later bids |
|---|---|---|
| REST `POST marketplace/sale-lots/{id}/bid/` (and bid-eligibility's `minimum_next_bid`) | `starting_bid + 0.01` | `current_bid + bid_increment` |
| WebSocket `auction_state.minimum_next_bid` | `starting_bid` | `current_bid + bid_increment` |

- There is no multiple-of-increment rule and no cap (`backend-reference/marketplace/views.py:1086-1091`, `backend-reference/marketplace/consumers.py:47-56`).
- Where the WebSocket and REST disagree on the first-bid minimum, the eligibility value is authoritative.

**Order of server checks** on a bid:

1. Lot must exist and be public.
2. Lot must be live and started.
3. Bidder must be an active, non-suspended, non-blocked buyer who is not the listing creator.
4. Verification must be complete if the lot has `requires_verification`.
5. Deposit must be covered.
6. Amount must meet the minimum.
7. Race checks (outbid during submit, amount taken).

**Error payloads the UI must handle**

| Status | Code / message | Extra fields |
|---|---|---|
| 400 | `bid_too_low` | `next_valid_bid`, `auction_state` |
| 409 | `outbid_during_submit` | |
| 400 | `bid_amount_taken` | |
| 400 | `auction_deposit_required` | `required_amount`, `current_wallet_balance`, `missing_amount` |
| 403 | Not buyer / suspended / blocked / own lot | |
| 400 | "Verification is required…" | |

**Deposit policy**

- The global setting `auction_bid_deposit_required` defaults to true. The amount comes from `auction_bid_minimum_deposit_amount`, with a fallback of `50.00` (`backend-reference/backend/deposit_policy.py`).
- A bidder is eligible when any of these holds:
  - the policy is off;
  - their paid `DEPOSIT` payment records for the lot reach the amount;
  - their wallet balance is at least the amount. For timed auctions the wallet is not debited.
- **UI by user state:**
  - **Guests:** "Sign in to bid", plus "Refundable deposit required: X", with a link to `/login?next=/auction/{slug}`.
  - **Signed-in but not eligible:** a deposit block opens `WalletDepositModal`, which prefills the full required amount. It calls `POST payments/wallet/top-up/` with `return_to` set to the current path and redirects to the payment page.
- Eligibility and the wallet refresh on window focus and when the tab becomes visible again. This is how a returning payment is picked up.

**Proxy / maximum bid**

- Endpoint: `marketplace/sale-lots/{id}/max-bid/`, which supports GET, POST (no proxy yet), PATCH (proxy exists) and DELETE.
- The UI shows "Your Proxy Bid X" with a Clear button, and a toggle to set or update the maximum.
- The ceiling must be at least the current bid (or the starting bid when the current bid is 0) plus the increment. It can be lowered.
- **Engine** (`backend-reference/marketplace/views.py:1270-1392`):

  | Situation | Result |
  |---|---|
  | No competing proxy | Your proxy bids `min(max(current + inc, starting_bid), your ceiling)`. |
  | Your ceiling ≤ a competitor's ceiling | The competitor's proxy answers at `min(your ceiling + inc, its ceiling)`. |
  | Your ceiling > the competitor's ceiling | You lead at `min(competitor ceiling + inc, your ceiling)`. |
  | A normal bid meets an existing proxy | The proxy answers at `min(bid + inc, its ceiling)`. |

**Anti-sniping**

- Defaults per lot: `anti_snipe_enabled=True`, `anti_snipe_window_seconds=300`, `anti_snipe_extend_seconds=300` (`backend-reference/marketplace/models.py:148-150`).
- A bid inside the last 5 min extends `end_time` by 5 min. The bid response carries `anti_snipe_applied`, and the detail payload exposes all three fields.
- There is no `auction_extended` WebSocket message; the change arrives as a new `end_time`.
- **Quirk:** the UI copy says "Timer extends 2 minutes" (`AuctionDetailClient.jsx:2161`).

**Bid flow and states**

- **Placing a bid:** Place Bid → confirm modal ("This bid is binding if you win the auction.") → REST.
- **Bidder state** (server `bidder_state`: `neutral | highest | outbid | winner | ended_outbid | ended`) is shown in an `aria-live` pill.
- **Leading:** disables Place Bid ("You're leading").
- **Ended:** disables it too ("Auction ended").
- **Urgency:** styling below 10 min (urgent) and 3 min (critical). The countdown shows `HH:MM:SS` with uncapped hours and uses the client clock.

**Real-time updates**

- **WebSocket** `/ws/auctions/{id}/`, anonymous (no ticket):
  - Only `auction_state` frames are applied, and frames with an older `bid_version` are dropped.
  - The displayed bid never decreases from a frame.
  - Every frame triggers an eligibility refetch for signed-in users.
- **Polling fallback:** every 7 s while disconnected, and a 45 s safety sync while connected.
- **Reconnect:** backoff of 5 s, 10 s, 20 s, 40 s, then 60 s, with a REST snapshot after reconnecting.

**Bid history**

- 8 per page, with bidder labels masked server-side (e.g. `A****h`), a "YOU" badge, "Highest", and a flash on new rows.

**Other detail-page features**

- Watch / unwatch.
- Watcher count.
- Share.
- Push prompt after the first successful bid.
- Market comparison, only when the server's `show_market_comparison` is set.
- Pallet contents manifest.
- YouTube video (nocookie).
- Gallery that autoplays every 4 s.

**Buy Now on `both` lots**

- "Or skip the auction" opens a review modal, then "Pay now".
- `CartProvider.replaceWithItem` **clears the server cart first**, adds the full quantity, and goes to `/checkout`.
- Buy Now closes once `current_bid ≥ buy_now_price`.

**Close, win and payment** (Celery `close_expired_auctions`, every 60 s)

- **Outcome:** no bids → `expired`; otherwise → `sold`.
- **Winner order:** `auction_win` / `pending_payment`, with `payment_due_at = now + 24 h` (`AUCTION_WIN_PAYMENT_WINDOW_HOURS`).
- **Auto-charge:** wallet first, then the default saved card with `consent_for_auto_charge`. Delivery needs the default address.
- **Missed payment:** the order is cancelled, the lot goes back to `draft` and the credit score drops by 10.
- **Notification:** "Auction won" → `/account/orders/{id}`, a missing route (A.3).

**Visibility**

- A lot is public only while it is `scheduled`/`live`, approved, active, subscription-eligible and before `end_time`.
- **Finished auctions return 404** from list, detail and by-slug, including for the winner. After the end, only bid-eligibility and the account area can report the result.
- The reserve price is deactivated system-wide (`backend-reference/marketplace/views.py:1251`).

**Quirks**

- There is no UI for scheduled/upcoming lots; the header always says "Live Auction".
- There is no status-specific ended wording.
- Watch state is never loaded (`AuctionDetailClient.jsx:433`), so it always starts as "Watch".
- The gallery resets to the first image on every poll or bid.
- The deposit block's "Missing" shows the required amount rather than the missing amount.
- There is no double-submit guard on confirm.
- The mobile sticky bar only scrolls to the bid panel.
- There are two `h1` elements.

### B.4 Live auctions

**Index**

- `/live` redirects to `/browse?tab=live`, which renders `frontend/src/components/marketplace/LiveAuctionsGrid.jsx`.
- **Query:** an infinite query with `directory=current`, `compact=grid`, `page_size=12`, `search`, and `warehouse_code` on storefronts. Data is fresh for 15 s.
- **Paging:** an auto-load sentinel plus a "Load more" button.
- **Cards:** `LiveEventCard`.
- **Homepage rail:** `LiveNowSection` fetches `directory=current&page_size=12` once, without the compact format.

**Viewer** (`/live/[slug]`)

- **Bootstrap:** REST first (by-slug, or the legacy numeric id). An `id` must be resolved before the socket opens.
- **Socket:** `/ws/live-auctions/{id}/`.
  - Signed-in users get a fresh single-use ticket for every connect (`POST accounts/session/ws-ticket/`, 60 s TTL). The page never falls back to anonymous silently.
  - Frames: `live_event_state` (full snapshot; drop older `state_version`), `ping` every 30 s, and close code 4403.
  - Backoff is `min(10 s, 500 ms·2^n)`.
- **Current lot:** the first `live` lot, else `countdown`, else `paused`, else the last finished lot.
- **Item statuses and labels:**

  | Status | Label (EN / AR) |
  |---|---|
  | `staged` | Up next / التالي |
  | `countdown` | Starting / يبدأ (5 s pre-roll) |
  | `live` | Live / مباشر |
  | `paused` | Paused / متوقف |
  | `sold` | Sold / تم البيع |
  | `reserve_not_met` | Unsold / لم يُباع |
  | `cancelled` | Cancelled / أُلغي |
  | `ended` | Ended / انتهى |

- **Operator-controlled behaviour:** the next lot is **not** started automatically, and there is **no automatic anti-sniping** in live (the operator can "extend").
- **Manual bid** (current lot `live` and user signed in):
  - Desktop has an inline form; mobile has a fixed bottom bar.
  - The amount defaults to the minimum: `next_minimum_bid`, else `current + inc`, else `starting_bid` when there are no bids.
  - Request: `POST live-auctions/events/{id}/bid/` with `{item_id, amount}`.
  - The button is disabled while sending, while leading, when the input is empty, or when the amount is below the minimum.
  - If the error text contains "deposit", the page opens `WalletDepositModal` and retries the bid once.
- **Proxy:** `live-auctions/events/{id}/items/{itemId}/max-bid/` supports GET, POST and DELETE. The server lets the ceiling **only be raised**. On mobile it's a bottom sheet.
- **Deposit chip:** "Wallet covers the required deposit: X" or "Deposit coverage required: X".
- **Other panels:**
  - Bidder status chip.
  - Wins banner ("It's already in your orders" → `/account?tab=orders`).
  - "All lots" gallery.
  - Bid history of up to 20 rows with YOU and AUTO badges.
  - Viewer count.
  - Live / "Reconnecting…" pill.
  - YouTube stream: `youtube-nocookie`, sandboxed iframe, autoplay muted.
- **Live wins:** the order has no OrderItem and no payment deadline, and there is no "Auction won" notification.
- **Quirks:**
  - An unknown slug spins forever.
  - The countdown overlay needs a lot image.
  - The proxy minimum in the UI is the next minimum bid, while the server requires the current bid.
  - A max-bid GET runs on every new bid.
  - The page re-renders once a second.

### B.5 Lot detail — shared behaviour

- **Grade:** `GradeBadge` opens `GradeInfoModal` (B.14).
- **Seller link:** `/seller/{code}`. Lots without a warehouse, or whose `warehouse_type` is `main`, show "KHAZNA" (`lib/marketplaceAdapters.js:29-33`).
- **Share modal** (`ShareProductModal.js`): Copy, WhatsApp (`wa.me`), X intent, and native `navigator.share`.
- **Push prompt** (`PushPrompt.jsx`), shown only when all of these hold:
  - the user is signed in;
  - push is supported;
  - `Notification.permission` is `default`;
  - the user hasn't dismissed it in the last 14 days;
  - they are not subscribed.
- **Metadata:** `lib/saleLotMetadata.js` (B.15).
- **Media:** images from `cover_image_url` / `image_url` / `extra_data.images` / pallet images. Video is YouTube only.

### B.6 Seller storefront (`/seller/[code]`)

- **Lookup:** `GET marketplace/sellers/{CODE}/` returns `{code, name, city, member_since, active_auction_count, buy_now_count, live_now, entitlements{buy_now, auctions, live}}`. `KHAZNA` resolves to the Main warehouse, which is returned as name "Khazna".
- **Catalogue:** reuses `BrowseContent` with `warehouse_code`.
  - Categories come from `?seller=`.
  - The location filter is hidden.
  - Tabs are filtered by entitlements (with the Live-tab quirk from B.1).
  - Hero: fixed headline "Verified stock, straight from the seller." plus a "Seller · CODE" chip.
- **Not displayed:** the lookup's city, member-since, counts and `live_now`.
- **Error page:** "We couldn't load this seller catalogue" (EN/AR).

### B.7 Cart

- **Guest carts:** the HttpOnly cookie `khaznah_cart_session` (path `/api/v1/orders/`, 90 days) is sent with `credentials:"include"`. After login the guest cart is merged **once per user** with `POST orders/cart/merge/` (`CartProvider.jsx:94-101`).
- **Cart ownership:** the query key is `["cart", "guest" | "user:<id>" | "pending"]`. It is cached indefinitely and not refetched on mount.
- **Optimistic updates** with rollback on failure. Quantity or remove actions on a row that is still being added wait for the pending add (the module-level `pendingAdds` map).
- **Line rules:**
  - Minimum 1 and maximum = stock. Editing the quantity never removes a line; only the trash button does, behind a "Remove Item?" confirmation.
  - Locked lines (`full_stock_required` or `sale_type=both`) have no stepper and no trash. They read "Packed pallet · full lot required" or "Full stock required to close the auction".
  - Stock note: "Out of stock" or "Only N left" (≤ 3).
- **Checkout blocking:** any line with stock ≤ 0 or quantity > stock replaces the CTA with a disabled "Update unavailable items before checkout".
- **Totals:** Products = Σ final price × qty. The discount line is informational only, and the total is VAT-inclusive.
- **Empty state:** "Your cart is empty" with a link to `/browse`. The header shows a badge with the item count.
- **Quirk:** the cart page does no server validation. `can_checkout` and `unavailable_reason` are mapped but not shown.

### B.8 Checkout, payments and wallet

**Loading and guard**

- Buyer-only guard.
- Loads run in parallel:
  - active-checkout probe (`GET orders/checkout/active/`, non-blocking);
  - addresses (`?is_active=true`, default preselected);
  - wallet (up to 3 attempts, with a 700 ms × attempt backoff).

**Delivery and pickup**

- **Methods:** home delivery or warehouse pickup.
- **Pickup:** only when the whole cart is platform stock from one warehouse, i.e. the single group is `__platform__`. It uses `GET orders/pickup-locations/` filtered to the origin warehouse.
- **Addresses:** chosen with `AddressSelector`, or created and edited in `AddressModal`. Saving always sets `is_default:true`.
- **Delivery quote:** `POST orders/delivery/quote/`.
  - The first request fires immediately and later ones are debounced by 350 ms.
  - A request-id guard drops stale responses.
  - The Pay button is enabled only when the quote signature equals `${address.id}:${cartSignature}`.

**Orders per seller**

- Items are grouped by `warehouse_code`: "Order N · Sold by {label}".
- Each group has its own delivery charge, COD eligibility (including `cod_fee` and `cod_max_order_value`) and totals.
- The quantity stepper is capped by the quote's `max_quantity`.

**Coupons and wallet**

- **Coupons:** per seller group via `POST marketplace/cart/validate/` with `{items, discount_codes, city, include_coupons:true}`. Invalid codes are removed automatically with a toast. The page lists available coupons and applied automatic discounts.
- **Wallet** (`CheckoutControls.jsx`): modes `none` / `partial` / `full`. It applies only to the online total.

**Submit pipeline**

1. Refetch the cart and validate it.
2. Build the payload. `payment_method` is one of `home_delivery_cod`, `wallet`, `wallet_moyasar` or `moyasar`. The payload also carries `payment_methods` per group, `wallet_amount`, `wallet_mode`, `expected_total` and `discount_codes`.
3. Send **`client_token`**, a UUID kept while the payload is unchanged (idempotency), with **`defer_until_paid:true`**.
4. Branch on the response:
   - `checkout_session` → go to `payment_page_url`.
   - `group` → `POST payments/groups/{ref}/create-payment/`, or go straight to orders when nothing is due.
   - Single order → `POST payments/orders/{id}/create-payment/` → redirect.
5. Recover from errors:
   - A changed total re-prices and asks the user to review.
   - A dead coupon is removed.
   - Anything else shows an error panel with a retry.

**Active checkout session**

- A deferred session holds reserved stock for 30 min.
- The UI lets the user resume payment, edit (cancels the session and returns to the form) or cancel.
- Cancelling the checkout also clears the cart and goes to `/browse`.

**Payment pages**

- **Moyasar page:**
  - Calls `Moyasar.init` with the backend `form_config`. The backend defaults are `methods ["creditcard"]` and networks `mada`, `visa` and `mastercard`, configurable via env; the production values are **not verified**.
  - `on_completed` calls `POST payments/payment-records/{id}/attach-gateway/`.
- **Result page:**
  - With a gateway id it runs `POST …/status/`; otherwise it polls `GET …/status/` 8 times, 1.5 s apart.
  - It resolves the destination in this order:
    1. `extra_data.return_to` (sanitised);
    2. `checkout_credited` → `/account?tab=wallet`;
    3. `checkout_reference` and not paid → `/checkout`;
    4. group → `/account?tab=orders&group=REF`;
    5. order → `/account?tab=orders&order=ID`;
    6. otherwise the orders tab (`/dashboard/orders` for staff).
  - It redirects automatically when the payment is paid.

**Other payment features**

- **Invoices:** PDF via `GET payments/invoices/{id}/pdf/`.
- **Saved cards:** Default, Auto-charge consent and Remove in the account.
- **Wallet top-up:** in the account and in the deposit modal.

**Quirks**

- `PaymentMethodDrawer` never opens, so "Cash on Pickup" is unreachable.
- The "Order Created" fallback screen is placeholder UI with a fake timeline and a dead `/orders/1` link.
- The processing overlay's Cancel only hides the overlay.

### B.9 Authentication and session

**Tokens and CSRF**

- The access token (JWT, 30 min) lives in memory (`lib/authSession.js`).
- The refresh token is an HttpOnly cookie, `khaznah_refresh`: path `/api/v1/accounts/session/`, 90 days, rotated with a 45 s grace window.
- `GET accounts/session/` issues the CSRF token. Login, refresh and logout send `X-CSRFToken`.

**Client behaviour** (`lib/api.js`)

- Every 401 triggers one refresh followed by a retry.
- Refreshes are serialised across tabs with `navigator.locks`. Where that's unavailable, a localStorage mutex and a BroadcastChannel `khaznah-token-refresh` handoff are used.
- Transient failures don't log the user out ("Reconnecting to your session…").
- A genuinely expired session redirects to `/login?next=<path+query>&expired=1` (`AuthProvider.jsx:236-247`).
- Login and logout sync across tabs via BroadcastChannel `khaznah-auth`.
- Logout clears all queries except `homepage` and `current-user`.

**Roles**

- `isBuyer` is true for `buyer`/`trade_buyer`, or for a user who is none of admin, operator or warehouse.
- Account and checkout reject non-buyers.
- Login rejects non-buyers with "This login is for customers only…".

**Login and registration**

- **Login:** email and password with a show/hide toggle. On success it fires `PATCH accounts/profile/ {customer_language}` without waiting, then goes to `next`. The page also has the portal switch, the language toggle and the (dashboard) theme selector.
- **Register:**
  - Fields: name, email, optional phone and password twice. Terms must be accepted.
  - Calls `POST accounts/register/` with role `buyer`, then `POST accounts/send-otp/` with `{purpose:"verify_email"}`.
  - The code is 6 digits; Verify is enabled at 4 or more. Resend has a 60 s cooldown, and a debug OTP is shown in test mode.
  - `POST accounts/verify-otp/`. There is no auto-login afterwards.

**Absent**

- Forgot or reset password (no backend endpoint either).
- Phone verification in the UI.
- Social login.
- Redirecting already-signed-in users away from the login page.

### B.10 Watchlist

- **Watch / unwatch:** `POST` / `DELETE marketplace/sale-lots/{id}/watch/`, sign-in required.
  - Auction detail can toggle both ways.
  - Browse cards and the hero "Watch lot" can only add.
  - Guests get the toast "Please sign in to use the watchlist."
- **Auto-watch:** the server auto-watches a lot on bid (`source:"bid"`).
- **Account tab `watchlist`** (alias `bids`):
  - Merges live saved lots with live lots the user has bid on.
  - Rows show source ("You have bid on this auction" / "Saved auction"), a Winning or Outbid badge, the price and a live "Time left".
  - Actions: View lot (`AuctionDrawer`), QuickBid inline (`POST …/bid/`) and Open auction.
  - Only page 1 of 8 is loaded, and there is **no remove action**.
- **Legacy route:** `/account/watchlist` redirects to the tab.

### B.11 Account, orders, wallet, disputes, notifications (`/account`)

**Shell**

- **Hero:** "Buyer Account Hub", with the buttons Pay N awaiting / View Orders, Open Wallet and Refresh.
- **Stats:** built only from data already loaded.
- **Sidebar menu:** count badges for watchlist, won, orders, open disputes and unread notifications.
- **AlertBar:** "Payment action required", or "Need help with an order?" on the Disputes tab.
- **SuspensionBanner:** for suspended accounts. Shows the reason, "You cannot bid or check out…" and the appeal status, or a form (`GET`/`POST accounts/appeals/`).
- **Data:** React Query `fetchQuery` keyed `["account", name, params, refreshKey]`, 2 min cache.

**Tabs**

| Tab | Must keep |
|---|---|
| `overview` | Tiles: Active bids, Watchlist, Awaiting payment, Invoices. Wallet card and orders card. |
| `watchlist` | As B.10. |
| `won` | `auction_win` orders taken from the loaded orders. Pay now (unpaid), View details and Download invoice. **PayNowModal**: 1. Pick an address or quick-add one; delivery is priced with `POST orders/orders/{id}/auction-delivery-address/`, debounced 300 ms. 2. Coupons from `GET …/available-discounts/`, applied with `POST …/apply-discount/`. 3. Wallet: partial amount or "Use full available". 4. Pay: `POST payments/orders/{id}/apply-wallet/`, then `POST payments/orders/{id}/create-payment/ {address_id}` and a redirect. |
| `orders` | Cards and "Load 8 more". Multi-seller group banner "Pay X for all N orders" (group payment). Group filter chip. **OrderDrawer**: summary tiles, items, price breakdown with VAT included, fulfilments with courier, tracking, pickup code and live map link. Track (`GET orders/orders/{id}/tracking/`). Invoice PDF. Pay. "Delivery support" panel with the last 3 events. |
| `wallet` (alias `deposits`) | Balance and status. Top Up with quick amounts 50/100/250/500 (`POST payments/wallet/top-up/`, then redirect; dispatches `khaznah-wallet-updated`). Saved methods: Default, Allow/Disable auto-charge, Remove. Ledger (first page). Auction deposits list (payment records of type `deposit`/`high_value_deposit`). |
| `payments` | Tiles: Successful / Pending / Needs attention. Payment history with the "Open gateway" link. Invoice centre with PDFs. Static protection panel. |
| `disputes` | List (`GET orders/disputes/`). **New dispute** modal: order radio list (loaded orders only), type (`return_request`, `damaged_item`, `wrong_item`, `delivery_issue`, `payment_issue`, `other`), description of 10–2000 characters, image and video uploads via `POST backend/attachments/` (purpose `dispute_evidence`), then `POST orders/disputes/`. Cancel open disputes (`PATCH {status:"cancelled"}`). |
| `notifications` | Client-side category filter (all, bidding, payment, order, fulfillment, dispute, account, system). Unread count. Mark read and Mark all read. Bidding payload detail (your bid, current, next valid). Action link. "Load 10 more". Dispatches `khaznah-notifications-updated`. |
| `profile` | Avatar upload (multipart `PATCH accounts/profile/`). Full name and preferred language. Password change (`POST accounts/password/change/`). Push enable/disable. Email verification by OTP. Saved addresses (AddressSelector plus a form; set default; delete with confirmation). |

**Quirks**

- `order`, `group` and `case` URL params are ignored.
- `actionMessage` is rendered only on the Orders tab.
- On a direct visit to Disputes, no orders are loaded, so a dispute can't be filed.
- The Email and Mobile inputs look editable but are never saved.
- The Orders "Pay" button bypasses PayNowModal.
- About 440 dead lines: `ActiveBids` (would crash if rendered), `DepositsPanel`, `BidTableRow`, `BidRow`, `OrderSmall`, `Toggle`, `Logo`, `useCountdown`.
- There is no notification-preferences UI, although the API exists.

### B.12 Notifications and push (global)

- **Navbar bell:**
  - When signed in, the Navbar gets a ticket (`POST accounts/session/ws-ticket/`), then opens `/ws/notifications/?ticket=…`.
  - It consumes `notification_summary` (`unread_count`, `latest[≤5]`) and reconnects with backoff from 1 s to 30 s.
  - The summary query (`GET notifications/summary/`) seeds it.
  - The popover lists up to 50 notifications (`GET notifications/notifications/?page_size=50`) with Mark read / Mark all read, action links and "View all" (`/account?tab=notifications`).
- **Backend limits:**
  - New system notifications (outbid, won, …) are **not pushed** over the socket. Summaries are sent on connect and after REST mutations only.
  - There are no "ending soon" or "live starting" notifications.
- **Web push:**
  - `lib/push.js` registers `/sw.js`, then `GET notifications/push/vapid-public-key/`, then `POST notifications/push/subscribe/`. Unsubscribing uses `POST notifications/push/unsubscribe/`.
  - The service worker opens `data.url` when a notification is clicked.

### B.13 Language, RTL, currency, country

**Language**

- `LocaleProvider` (`frontend/src/components/providers/LangProvider.jsx`) stores the choice in localStorage (`khaznah-customer-language`), syncs it across tabs via BroadcastChannel `khaznah-locale`, and saves it to the profile (`customer_language`) when signed in.
- It sets `<html lang/dir>` and `body dir`. It also renders a wrapper `div` with `lang` and `dir` from React state, which starts as `en`.
- **Flash of LTR:** the root pre-paint script sets `<html dir>` before paint. Descendants of the wrapper may still render LTR until the effect runs. This is likely but **not verified in a browser**.
- The API client sends `Accept-Language`.

**Strings**

- 28 customer files each declare their own `t(en, ar, lang)` helper; there is no string catalogue.
- **English-only areas:**
  - the payment pages and `AddressSelector`;
  - most of the account copy;
  - the auction deposit block;
  - server error-code messages (`lib/api.js:181-194`);
  - the loading and error screens of the auction route;
  - several strings on the shop and cart pages.

**RTL and typography**

- **Logical CSS** (start/end, `ms`/`me`, `border-s`) is used widely.
- **Global CSS:** keeps numeric, email and tel inputs LTR, and applies `unicode-bidi: plaintext` to Arabic prose.
- **Known mirroring gaps:**
  - Some chevrons aren't mirrored.
  - `FloatingCardRail` is forced to `dir="ltr"`.
  - The ticker always scrolls left.
  - The toast slides in from the right.
- **Fonts:** the only web font loaded is `riyal-regular.woff2`, for the riyal glyph. Inter, Noto Sans Arabic and Tajawal are named in `globals.css` but not loaded, so system fonts are used.

**Currency** (`lib/currency.js`)

- `formatSAR` renders the Saudi Riyal sign U+20C1 followed by the amount, wrapped in LTR isolates.
- Digits use `en-SA` (Latin) in both languages, with a maximum of 2 decimals.
- The API sends money as decimal strings; the timezone is Asia/Riyadh.

**Country scoping**

- **Detection (`CountryProvider`):** on the first visit it tries the stored choice, then `GET operations/countries/detect/`, then GPS (reverse-geocoded by `api.bigdatacloud.net`), then the default country.
- **Storage:** the choice is saved in localStorage and the `khaznah-country` cookie, and the page does a full `location.reload()`.
- **Notices:** a detected-country notice (6 s) and an unsupported-country notice (8 s).
- **Switcher:** `CountrySwitcher` is hidden when there are fewer than 2 countries.
- **Effect on requests:** `?country=XX` is appended to `marketplace/sale-lots/`, `marketplace/homepage/` and `live-auctions/public/events/` only.

### B.14 Condition grades

Source of truth: `frontend/src/lib/gradeInfo.js` (EN/AR labels and descriptions, plus the electronics / non-electronics matrix).

| Key | Chip | Dot |
|---|---|---|
| `new` | NEW / جديد | #3B82F6 |
| `A` | A | #10B981 |
| `B` | B | #F59E0B |
| `C` | C | #F97316 |
| `D` | D | #F43F5E |
| `R` | R | #A855F7 |
| `F` | F | #EF4444 |
| `parts` | PARTS / قطع | #64748B |
| `non_working` | N/W / لا يعمل | #EF4444 |
| `ungraded` | — (badge hidden) | #94A3B8 |

- **`GradeBadge`:** about 44 px tap area, `aria-haspopup=dialog`. It is shown on cards, detail pages, cart and checkout.
- **`GradeInfoModal`:** a portal that becomes a bottom sheet on phones. It traps focus, closes on Escape, locks scroll and restores focus. The footer also has a "Grade guide" button that opens it.
- **Backend enum:** `condition_grade` has exactly these 10 keys. `source_type` is `open_box | returned | surplus | liquidation | other`.

### B.15 SEO, metadata, crawling

- **Root metadata:** title "Khaznah - Auction House" plus description and keywords.
- **Per-page metadata:** only `/auction/[slug]` and `/shop/[id]` generate it (`lib/saleLotMetadata.js`, fetch revalidated every 15 s). On the auction route it shares the server page's request (same URL). The shop page fetches client-side, so its metadata request is separate.
  - Title: "{title} | Khaznah".
  - Description: the first 180 characters of the description.
  - Canonical: the current slug or id.
  - OpenGraph and a Twitter card.
- **Missing:**
  - Page-specific titles on every other route. The home and seller entries are server components that don't export `metadata`. The rest are client components, which can't export it.
  - JSON-LD. `public/llms.txt` claims JSON-LD exists on `/shop/{id}` and `/auction/{id}`, but it does not.
  - hreflang.
  - A sitemap.
  - `noindex` for ended lots.
- **ISR:** home 20 s, auction 15 s, seller 60 s.

### B.16 Support and content

- **Contact page:**
  - Support info from `GET notifications/support/contact/`: email, phone and WhatsApp.
  - WhatsApp CTA.
  - Form (`POST notifications/support/message/`, throttled to 5/min).
  - Static Riyadh address and Sun–Thu 9–6 hours.
- **Footer:**
  - Link columns (Platform / Company / Help).
  - Newsletter **stub**; there is no backend and it simulates success after 500 ms.
  - Social links to generic network homepages.
  - Typographic payment marks: Visa, Mastercard, mada, STC Pay.
  - "© {year} Logic Gate · Khaznah — Direct Auction House".
  - "Grade guide" button.
- **Static pages:** About, How it works, FAQ, Privacy and Terms are client components that render bilingual copy.

### B.17 Performance and security behaviours to keep

- **Homepage:**
  - The server-seeded snapshot plus 30 s polling replaces per-card sockets.
  - One shared countdown clock (`useSyncExternalStore`, `page-client.jsx:186-254`) drives every homepage timer.
  - `PrefetchAuctionLink` prefetches the lot on hover, focus or touch.
  - `Reveal` was deliberately removed from rail cards for LCP.
  - Cards use YouTube poster images instead of iframes.
- **Navbar and Footer:** link prefetch is disabled.
- **Images:** `deviceSizes` 640–1920, `qualities` 65/75, WebP.
- **WebSocket URLs:** always use `wss:` on HTTPS pages. WebKit throws synchronously on mixed content, so the socket constructor is wrapped in try/catch (`lib/ws.js`).
- **Bidding reliability** (backend):
  - Unique-amount race handling.
  - `bid_version` and `state_version` monotonic guards.
  - Throttles: `bid` 60/min, `auth`/`otp`/`register` 10/min, `payment` 30/min, anonymous 200/min.
- **Safe redirects:** `sanitizeNextPath` for `next` and `return_to`.

---

## C. Shared customer components

Sizes are line counts, given where a component is large or significant.

### C.1 Chrome and navigation

| Component | File | Where used | Notes |
|---|---|---|---|
| Header / Navbar | `frontend/src/components/layouts/Navbar.jsx` (1,096) | `(main)/layout.js`, so every `(main)` route | Contents: text logo mark (خزنة / KHAZNAH); search; primary nav (Home, Browse (`/browse?tab=auction`), Live (`/live`), About dropdown with 6 links, Dashboard for admins); `CountrySwitcher`; EN/ع toggle; cart icon with badge; wallet chip (buyers, `/account?tab=wallet`); notification bell and popover; account dropdown. On mobile the header hides while scrolling down. Also owns the notification WebSocket and the wallet fetch. |
| Search | `SearchBar` inside Navbar (`Navbar.jsx:78-145`) | Mobile and desktop instances | Submits to `/browse?tab=…&search=` and dispatches `khaznah-marketplace-search`. No typeahead. |
| Mobile navigation | Inside Navbar (`Navbar.jsx:917-1079`) | Below `lg` | A two-column popover grid, not a drawer. No focus trap. |
| Notification popover | `NotificationDrawer` inside Navbar (`Navbar.jsx:186-300`) | Signed-in users | `role=dialog`. Escape, outside click and scroll close it. |
| Footer | `frontend/src/components/layouts/Footer.jsx` (416), `PaymentLogos.jsx` (53), `SocialIcons.jsx` (67) in the same folder | `(main)` layout | Newsletter stub, grade-guide trigger, decorative chest artwork. |
| Country switcher | `frontend/src/components/layouts/CountrySwitcher.jsx` (37) | Navbar (desktop and mobile), browse toolbar | Native `<select>`. Hidden when there are fewer than 2 countries. |
| Account navigation | Account `Sidebar`, `Hero`, `AccountTabHeader` and `AlertBar` in `frontend/src/app/(main)/account/page.js` (296, 207, 612, 386) | `/account` | A 3-column grid on mobile. |
| Language toggle (auth) | `frontend/src/components/auth/LoginLanguageToggle.jsx` (21) | `/login`, `/register`, `/seller/register`, **and** dashboard and warehouse logins | Shared with out-of-scope pages. |

### C.2 Cards and listings

| Component | File | Where used | Notes |
|---|---|---|---|
| Auction card (grid and list) | `AuctionCardBody` in `frontend/src/app/(main)/browse/page.js:751-945` (with wrappers `BrowseAuctionCard` / `AuctionListRow`, 947-953) | Browse, seller storefront | HURRY / CLOSING badges, Watch button, `HH:MM:SS` pill, watchers, "Deposit" chip, "Place Bid →". |
| Homepage auction cards | `EndingSoonCard` (944-1110), `HotNowCard` (1240-1333), `FeaturedAuctionCard` (1628-1729) and `HeroCarousel` slides (428-674) in `frontend/src/app/(main)/page-client.jsx` | Homepage | `DemoAuctionCard` (1112-1238) is unused. |
| Buy Now card | `frontend/src/components/marketplace/BuyNowCard.jsx` (411) | Browse grid | Cart rules and stepper (B.2). |
| Buy Now list row | `BuyNowListRow` in `browse/page.js:955-1106` | Browse list view | Differs from the card: no full-lot lock, discount or seller link. |
| Homepage Buy Now card | `DemoBuyNowCard` in `page-client.jsx:1390-1626` | Homepage Buy Now section | Has its own cart controls. |
| Live event card | `frontend/src/components/marketplace/LiveEventCard.jsx` (150) | `LiveAuctionsGrid`, `LiveNowSection` | `div role=link`. YouTube poster. LIVE / Starting soon / Completed. |
| Live grid | `frontend/src/components/marketplace/LiveAuctionsGrid.jsx` (114) | Browse Live tab | Infinite query and skeleton, error and empty states. |
| Live Now rail | `frontend/src/components/marketplace/LiveNowSection.jsx` (110) | Homepage | Uses ShinyText and TextType. |
| Marquee rail | `frontend/src/components/marketplace/FloatingCardRail.jsx` (306) | 4 homepage rails (featured, ending soon, hot, Buy Now) and `LiveNowSection` | `requestAnimationFrame` marquee with drag and wheel. Pauses on mouse hover only. Forced LTR. |
| Seller card | — | — | None exists. Sellers appear only as code chips or links and in the storefront hero. |
| Image placeholder | `frontend/src/components/marketplace/ProductImagePlaceholder.jsx` (23) | BuyNowCard, browse cards | |

### C.3 Filters, search, pagination

| Component | File | Where used | Notes |
|---|---|---|---|
| Filter panel (drawer content) | `FilterPanel` in `browse/page.js:235-508` | Below 1280 px | Holds all filters. |
| Filter drawer | `FilterDrawer` in `browse/page.js:595-664` | Below 1280 px | Scroll lock only. No Escape, no dialog role. |
| Desktop filter menus | `CompactBrowseFilters` in `browse/page.js:1121-1201` | 1280 px and above | `<details>` popovers. |
| Price range | `PriceRangeSlider` in `browse/page.js:63-108` | Filter UIs | RTL-safe fill. |
| Category rail | `BuyNowCategoryRail` in `browse/page.js:510-593` | Buy now tab | |
| Pagination | Browse numbered pager and sentinel (`browse/page.js:1706-1775`, `2207-2282`); LiveAuctionsGrid sentinel and "Load more"; account "Load 8 more" / "Load 10 more"; auction bid-history pager | Various | Four different models. |

### C.4 Detail-page building blocks

| Component | File | Where used | Notes |
|---|---|---|---|
| Auction gallery | Inline in `AuctionDetailClient.jsx` (about 1552-1765) | Auction detail | Video first, 4 s autoplay, thumbnails, `GradeBadge` overlay. |
| Shop gallery | Inline in `frontend/src/app/(main)/shop/[id]/page.js` (about 213-257) | Shop detail | No aria-labels on arrows or thumbnails. |
| Live lot gallery | `GalleryCard` in `frontend/src/app/(main)/live/[slug]/page.js:146-183` | Live viewer | Tiles are not clickable. |
| Countdowns | Auction `useCountdown` + `CompactAuctionTimer` (`AuctionDetailClient.jsx:58-87`, `254-338`); homepage shared clock + `TimerBlock` (`page-client.jsx:186-254`, `386-426`); browse `useBrowseCountdown` (`browse/page.js:738-749`); account `TimeRemaining` (1821; its `useCountdown` at 164 is unused); `frontend/src/lib/useCountdown.js` (28; live viewer and operator console) | Various | Five implementations with different formats. Only the live one shows `m:ss`; the others show uncapped hours. |
| Bid history | Inline in the auction detail; `BidHistoryPanel` in `live/[slug]/page.js:185-231` | Detail pages | |
| Pallet manifest | Inline in `AuctionDetailClient.jsx` (about 1870-1978) | Auction detail | |
| Grade badge and guide | `frontend/src/components/marketplace/GradeBadge.jsx` (72), `frontend/src/components/marketplace/GradeInfoModal.jsx` (182) | Cards, detail pages, cart, checkout, footer, **and dashboard ecommerce** | Shared with an out-of-scope page. |

### C.5 Overlays (modals, drawers, sheets, popovers)

| Component | File | Where used | Notes |
|---|---|---|---|
| Wallet deposit modal | `frontend/src/components/marketplace/WalletDepositModal.jsx` (242) | Auction detail, live viewer | Dialog, Escape. Top-up with redirect. |
| Share modal | `frontend/src/components/marketplace/ShareProductModal.js` (101) | Auction detail (dynamic import), shop | Dialog with labelled title. |
| Push prompt | `frontend/src/components/marketplace/PushPrompt.jsx` (103) | Auction detail, live viewer | `role=status`. |
| Bid confirm and Buy Now review | Inline in `AuctionDetailClient.jsx` (about 2737-2861) | Auction detail | No dialog role, Escape or focus trap. |
| Checkout overlays | `Modal`, `AddressModal`, `PaymentProcessing` and the dead `PaymentMethodDrawer` in `checkout/page.js` (94, 112, 321, 258) | Checkout | |
| Account overlays | `AccountDrawer` (3697), `OrderDrawer` (2006), `AuctionDrawer` (3732), `PayNowModal` (2346), `QuickAddAddressPopup` (2268), `DisputeModal` (4012) in `account/page.js` | Account | |
| Live proxy sheet | Inline in `live/[slug]/page.js` (about 933-963) | Live viewer, mobile | Dialog. No Escape or focus management. |

### C.6 Forms and controls

| Component | File | Where used | Notes |
|---|---|---|---|
| Address selector | `frontend/src/components/account/AddressSelector.jsx` (100) | Checkout, account profile | English only. |
| Address forms | Checkout `AddressModal`; account `QuickAddAddressPopup` and the profile inline form | Checkout, account | Four address UI variants with different validation. |
| Coupon and wallet controls | `frontend/src/components/marketplace/CheckoutControls.jsx` (53): `OrderCoupon`, `CheckoutWallet` | Checkout | |
| Quantity steppers | Cart `CartItem`, `BuyNowCard`, `BuyNowListRow`, shop page, homepage `DemoBuyNowCard`, checkout line rows | Various | Six implementations. |
| Auth forms | Login, register and seller-register pages | Auth | Three copies of the portal switch. |
| Seller plan card | `frontend/src/components/seller/PlanCard.jsx` (134) | `/seller/register` **and** dashboard warehouses | Shared with an out-of-scope page. |

### C.7 Feedback: loading, empty, error, toasts

| Component | File | Where used | Notes |
|---|---|---|---|
| Route skeletons | `frontend/src/app/(main)/loading.js`, `frontend/src/app/(main)/auction/[slug]/loading.js` | Route loading | |
| In-page skeletons | Homepage `SkeletonCard` (2391); browse `ListingSkeleton` (1108); LiveAuctionsGrid skeleton; `AccountLoading` (4264); cart, checkout and shop pulse blocks | Pages | Several variants. |
| Error boundaries | `auction/[slug]/error.js` (36), `seller/[code]/error.js` (41) | Routes | The seller one is bilingual. The auction route's `error.js` and `loading.js` are English only. |
| Empty states | Homepage `CountryEmptyState` (`page-client.jsx:2210-2245`, `aria-live`); browse, cart, live grid and account tab empties | Pages | |
| Toasts | Local implementations in 13 files: home, browse, auction, shop, live, cart, checkout, about, how-it-works, FAQ, contact, privacy, terms. Account uses `actionMessage` instead. | Pages | Several lack live regions, and the auction toast always shows ✓. |

### C.8 Motion and decorative

| Component | File | Where used | Notes |
|---|---|---|---|
| Section header | `SectionHeader` in `page-client.jsx:2124-2208` | Homepage | TextType `h2`, ShinyText eyebrow. |
| ShinyText, TextType | `frontend/src/components/reactbits/ShinyText.jsx` (123), `frontend/src/components/reactbits/TextType.jsx` (210) | Homepage, LiveNowSection | No reduced-motion handling. |
| Unused motion components | `frontend/src/components/reactbits/Shuffle.jsx`, `SplitText.jsx`, `TrueFocus.jsx`; `frontend/src/components/ui/RotatingText.jsx` | — | |
| Reveal | Local copies in `page-client.jsx`, `AuctionDetailClient.jsx` and `shop/[id]/page.js` | Pages | The auction copy hides content until JavaScript runs. |

### C.9 Providers and client state

| Provider | File | Notes |
|---|---|---|
| Auth | `frontend/src/components/providers/AuthProvider.jsx` (357) + `frontend/src/lib/authSession.js` (68) + `frontend/src/lib/portalRoles.js` (40) | Session bootstrap, login, logout, `hydrateSession`, `refreshSession`, `updateUser`, role flags, cross-tab sync. |
| Cart | `frontend/src/components/providers/CartProvider.jsx` (313) + `frontend/src/lib/cart.js` (89) | Owner-keyed query, optimistic mutations, merge, `replaceWithItem`. |
| Locale | `frontend/src/components/providers/LangProvider.jsx` (130) | `useLang()` returns `{lang, dir, isRTL, setLang, toggle}`. |
| Country | `frontend/src/components/providers/CountryProvider.jsx` (207) + `frontend/src/lib/country.js` (60) | Detection, storage, reload, notices. |
| Query client | `frontend/src/components/providers/ReactQueryProvider.jsx` (35) + `frontend/src/lib/queryKeys.js` (24) | Defaults: `staleTime` 30 s, no refetch on focus, no retry on 4xx. |
| Theme (auth pages only) | `frontend/src/components/providers/DashboardThemeProvider.jsx` (117) | The customer `(main)` routes have no dark mode. |

### C.10 Duplication at a glance

| Duplicated item | Copies |
|---|---|
| Toast | 13 |
| `t()` helper | 28 files |
| Countdown logic | 5 |
| Quantity stepper | 6 |
| Address form | 4 |
| Reveal | 3 |
| Portal switch | 3 |
| Pagination models | 4 |
| Cart-id helpers | 4 (`cartRowId`, `cartItemId` ×2, `getCartItemKey`) |
| Full-stock rule | Derived separately in `BuyNowCard.jsx:104-113` and `lib/cart.js:17-24` |

Hard-coded colours:

- No customer design tokens exist.
- Frequent hex values: `#0B101F`, `#D8A535`, `#2A3A8F`, `#F2C866`, `#E8B94B`.
- `page-client.jsx` alone contains 205 hex literals.
- `frontend/src/app/globals.css` (3,863 lines) interleaves customer rules with the dashboard theme. Customer rules sit at about lines 1–420, 3138–3215 and 3808–3863.

---

## D. Functional dependencies

### D.1 Dependency matrix

Legend: **Req** = required; **Opt** = optional or partial; **—** = none.

| Route / area | REST APIs | Authentication | WebSockets | Payments | Cart state | Auction state | User state | Seller data | Order data |
|---|---|---|---|---|---|---|---|---|---|
| Global chrome (Navbar, Footer, providers) | Req (session, wallet, notifications, countries) | Opt (bootstrap; bell and wallet when signed in) | Opt: `/ws/notifications/` (ticket, signed in) | — | Req (badge count) | — | Req (menus, wallet, unread) | — | — |
| Home `/` | Req (homepage SSR plus 30 s poll, live events, prefetch) | Opt (watch) | — | — | Opt (add / stepper) | Opt (countdowns from `end_time`) | — | Opt (seller chips) | — |
| Browse `/browse` | Req (sale-lots, category options, locations, live events) | Opt (watch) | — | — | Opt (add / stepper) | Opt (card countdowns) | — | Opt (seller chips) | — |
| Seller `/seller/[code]` | Req (seller lookup SSR plus browse set) | Opt | — | — | Opt | Opt | — | Req (lookup, entitlements) | — |
| Auction `/auction/[slug]` | Req (detail, bids, eligibility, bid, max-bid, watch, wallet, top-up) | Req for bid, proxy, watch and deposit | Req: `/ws/auctions/{id}/` (anonymous) plus polling | Opt (deposit via wallet top-up, Moyasar) | Opt (`replaceWithItem` / `addItem`) | Req (WebSocket plus REST) | Opt (eligibility, wallet, bidder state) | Opt (seller link) | — |
| Shop `/shop/[id]` | Req (detail, wallet) | Opt | — | — | Req (add / update / in-cart mode) | Opt (`both`: availability) | Opt (wallet line) | Opt (seller link) | — |
| Live index (browse Live tab) | Req (public events) | — | — | — | — | Opt (card status) | — | Opt (`warehouse_code`) | — |
| Live viewer `/live/[slug]` | Req (by-slug, bid, max-bid, wallet, top-up, ticket) | Req for bid and proxy; the ticket personalises state | Req: `/ws/live-auctions/{id}/` (ticket when signed in) | Opt (deposit via top-up) | — | Req (WebSocket) | Opt (my-bid flags, wins) | — | Opt (wins → orders) |
| Cart `/cart` | Req (cart CRUD) | Opt (guest allowed; merge on login) | — | — | Req (owner) | — | Opt (owner key) | — | — |
| Checkout `/checkout` | Req (addresses, quote, validate, pickup, checkout, active session, create-payment, wallet) | Req (buyer) | — | Req (Moyasar, wallet, COD) | Req (read, clear) | — | Req (addresses, wallet) | Req (groups by `warehouse_code`) | Req (creates orders or sessions) |
| Payment `/payment/moyasar/[id]` | Req (record status, attach-gateway) | Req (implicit) | — | Req (Moyasar form) | — | — | — | — | Opt (metadata) |
| Payment `/payment/result` | Req (status GET/POST) | Req (soft) | — | Req (verification) | — | — | Opt (buyer vs staff) | — | Req (order/group redirect) |
| Account `/account` | Req (see D.2) | Req (buyer) | Opt (Navbar socket; the page itself is REST) | Req (pay, top-up, wallet, saved cards, invoices) | — | Opt (watchlist, my-bids, QuickBid) | Req (profile, addresses, verification, push, appeals) | — | Req (orders, fulfilments, tracking, invoices, disputes) |
| Login / Register | Req (session, login, register, OTP) | Public | — | — | Opt (merge after login) | — | Req (session) | — | — |
| Seller register | Req (public packages, countries, seller-register, OTP) | Public; auto-login | — | — | — | — | Req | — | — |
| Static pages | Opt (contact only) | Public | — | — | — | — | — | — | — |

### D.2 REST endpoints by area (under `/api/v1/`)

- **Session and chrome:**
  - `GET accounts/session/`
  - `POST accounts/session/login/`, `refresh/`, `logout/`
  - `POST accounts/session/ws-ticket/`
  - `GET payments/wallet/me/`
  - `GET notifications/summary/`
  - `GET notifications/notifications/?page_size=50&ordering=-created_at`
  - `PATCH notifications/notifications/{id}/`
  - `POST notifications/notifications/mark-all-read/`
  - `GET operations/countries/public/`, `GET operations/countries/detect/`
  - Next route `POST /country-pref`
- **Home:**
  - `GET marketplace/homepage/[?country=]` (SSR and client)
  - `GET live-auctions/public/events/?directory=current&page_size=12`
  - `GET marketplace/sale-lots/{id}/` (hover prefetch)
  - `POST marketplace/sale-lots/{id}/watch/`
  - Cart endpoints
  - `GET marketplace/featured-notifications/active/` is wired in code but unused
- **Browse and seller:**
  - `GET marketplace/sale-lots/?…` (anonymous)
  - `GET marketplace/categories/options/[?seller=]`
  - `GET operations/warehouses/public-options/`
  - `GET live-auctions/public/events/?directory=current&compact=grid&page_size=12[&warehouse_code][&search]`
  - `POST|DELETE marketplace/sale-lots/{id}/watch/`
  - `GET marketplace/sellers/{CODE}/` (SSR)
- **Auction detail:**
  - `GET marketplace/sale-lots/by-slug/{slug}/`, `GET marketplace/sale-lots/{id}/`
  - `GET …/{id}/bids/?page=&page_size=8`
  - `GET …/{id}/bid-eligibility/`
  - `POST …/{id}/bid/`
  - `GET|POST|PATCH|DELETE …/{id}/max-bid/`
  - `POST|DELETE …/{id}/watch/`
  - `GET payments/wallet/me/`, `POST payments/wallet/top-up/`
  - `DELETE orders/cart/` + `POST orders/cart/items/` (`replaceWithItem`)
  - Push: `GET notifications/push/vapid-public-key/`, `POST notifications/push/subscribe/`
- **Shop:**
  - `GET marketplace/sale-lots/{id}/` (metadata and client)
  - `GET payments/wallet/me/`
  - Cart endpoints
- **Live viewer:**
  - `GET live-auctions/public/events/by-slug/{slug}/`
  - `GET live-auctions/public/events/?id=&page_size=1` (legacy)
  - `POST accounts/session/ws-ticket/`
  - `POST live-auctions/events/{id}/bid/`
  - `GET|POST|DELETE live-auctions/events/{id}/items/{itemId}/max-bid/`
  - `GET payments/wallet/me/`, `POST payments/wallet/top-up/`
  - Push endpoints
  - `live-auctions/items/{id}/create-deposit/` exists but is **unused**
- **Cart:**
  - `GET|DELETE orders/cart/`
  - `POST orders/cart/items/`
  - `PATCH|DELETE orders/cart/items/{id}/`
  - `POST orders/cart/merge/`
- **Checkout:**
  - `GET|PATCH orders/checkout/active/`
  - `GET accounts/addresses/?is_active=true`
  - `POST accounts/addresses/`, `PATCH accounts/addresses/{id}/`
  - `GET orders/pickup-locations/`
  - `POST orders/delivery/quote/`
  - `POST marketplace/cart/validate/`
  - `POST orders/checkout/`
  - `POST payments/groups/{ref}/create-payment/`
  - `POST payments/orders/{id}/create-payment/`
  - `DELETE orders/cart/`
- **Payment pages:**
  - `GET payments/payment-records/{id}/status/`
  - `POST payments/payment-records/{id}/status/`
  - `POST payments/payment-records/{id}/attach-gateway/`
- **Account:**
  - Orders and fulfilment:
    - `GET orders/orders/`, `GET orders/orders/{id}/`, `GET orders/orders/{id}/tracking/`
    - `POST orders/orders/{id}/auction-delivery-address/`
    - `GET orders/orders/{id}/available-discounts/`, `POST orders/orders/{id}/apply-discount/`
    - `GET orders/fulfillments/`
  - Payments and wallet:
    - `GET payments/invoices/`, `GET payments/invoices/{id}/pdf/`
    - `GET payments/payment-records/`
    - `GET payments/wallet/me/`, `GET payments/wallet/transactions/`, `POST payments/wallet/top-up/`
    - `GET|PATCH|DELETE payments/saved-methods/…`
    - `POST payments/orders/{id}/apply-wallet/`, `POST payments/orders/{id}/create-payment/`
    - `POST payments/groups/{ref}/create-payment/`
  - Bids and watchlist:
    - `GET marketplace/my-bids/`, `GET marketplace/watchlist/`
    - `GET marketplace/sale-lots/{id}/` (authenticated), `GET …/bids/`, `POST …/bid/`
  - Disputes:
    - `GET|POST orders/disputes/`, `PATCH orders/disputes/{id}/`
    - `POST backend/attachments/`
  - Notifications:
    - `GET notifications/notifications/?page_size=10`, `PATCH notifications/notifications/{id}/`, `POST notifications/notifications/mark-all-read/`
    - `GET notifications/summary/`
  - Profile and account:
    - `PATCH accounts/profile/` (JSON and multipart)
    - `POST accounts/password/change/`
    - `POST accounts/send-otp/`, `POST accounts/verify-otp/`
    - `GET|POST|PATCH|DELETE accounts/addresses/…`
    - `GET|POST accounts/appeals/`
    - Push subscribe and unsubscribe
- **Auth pages:**
  - `POST accounts/register/`
  - `POST accounts/send-otp/`, `POST accounts/verify-otp/`
  - `PATCH accounts/profile/`
  - `GET billing/packages/public/`, `POST accounts/seller-register/`
- **Contact:**
  - `GET notifications/support/contact/`
  - `POST notifications/support/message/`
- **Exist but are unused by customer pages:**
  - `marketplace/sale-lots/{id}/availability/`
  - `marketplace/discounts/available/`
  - `orders/orders/counts/`
  - `orders/fulfillments/{id}/return-shipment/` (the backend supports returns, but there is no customer UI)
  - `orders/fulfillments/{id}/delivery-events/`
  - `notifications/preferences/me/`
  - `payments/sale-lots/{id}/create-deposit/` (only an unreachable account panel calls it)
  - `paymentsApi.createTokenPayment` (in `frontend/src/lib/api.js`)

**Contract rules the redesign must respect:**

- An invalid or expired Bearer token returns 401 even on public endpoints. The client refreshes once and retries.
- Cross-origin `X-Country` and `Idempotency-Key` headers are not allowed by CORS. Use `?country=` and the body field `client_token`.
- Pagination follows DRF: `{count, next, previous, results}`.

### D.3 WebSockets

| Socket | Used by | Auth | Messages consumed | Notes |
|---|---|---|---|---|
| `/ws/auctions/{sale_lot_id}/` | `AuctionDetailClient.jsx` | Anonymous (no ticket) | `auction_state` (`bid_version` guard) | Server also sends `ping` every 30 s and `auction_info`. Close codes: 4404 unknown lot, 4429 rate. **No frame on close or activation**, so the end state comes from `end_time` plus REST. There is no `bid_placed` or `auction_extended` type. |
| `/ws/live-auctions/{event_id}/` | `live/[slug]/page.js` | Ticket (`?ticket=`) when signed in, else anonymous | `live_event_state` (`state_version` guard; the client receives it twice) | `ping` every 30 s (also a 90 s presence lease). 4403 for draft, inactive or ineligible events. A 5 s expiry sweep runs while connected. |
| `/ws/notifications/` | `Navbar.jsx` | Ticket required (4401 otherwise) | `notification_summary` | Sent on connect and after REST mutations only. There is no `ping`. |

- **Tickets:** `POST accounts/session/ws-ticket/ {count 1..8}` returns `{ticket, tickets[], expires_in:60}`. Each ticket is single-use, so every socket needs its own.
- **URL builder:** `frontend/src/lib/ws.js`, using `NEXT_PUBLIC_WS_BASE_URL` or the same origin, forced to `wss:` on HTTPS.
- **Reconnect helpers:**
  - `frontend/src/lib/useReconnectingSocket.js` is used only by the operator console and `lib/useLiveAuctionSubscriptions.js`.
  - The live viewer has its own local copy (`live/[slug]/page.js:63-122`).
  - The auction page and the Navbar implement reconnection inline.
- The staff socket `/ws/dashboard/auctions/` is out of scope.

### D.4 Payments

| Flow | Entry points | Mechanism |
|---|---|---|
| Buy Now checkout | `/checkout` | `POST orders/checkout/` with `defer_until_paid` and `client_token` → Moyasar hosted form (`/payment/moyasar/{id}`) → `callback_url` `/payment/result?payment_record_id=…`. Wallet-only and COD skip the gateway. Multi-seller orders use a group payment. |
| Auction win | Account Won tab (PayNowModal), Orders "Pay" | Auction delivery address → coupon → apply wallet → create-payment → Moyasar. The backend may already have auto-charged the wallet or saved card. |
| Bidding deposit | Auction detail, live viewer (`WalletDepositModal`) | Wallet top-up (`POST payments/wallet/top-up/` with `return_to`) → Moyasar → return. Eligibility comes from wallet coverage. |
| Wallet top-up | Account Wallet tab | Same endpoint. Dispatches `khaznah-wallet-updated` for the Navbar chip. |
| Saved cards | Account Wallet tab | Manage only (default, auto-charge consent, remove). Adding a card happens only through an online payment. |
| Invoices | Account Orders, Won and Payments tabs | PDF blob download. |

### D.5 Client state and cross-page signals

- **React Query keys** (`frontend/src/lib/queryKeys.js`):

  | Key | Notes |
  |---|---|
  | `["homepage"]` | |
  | `["sale-lots", params]` | |
  | `["sale-lot", id]` | Shared by the auction and shop pages |
  | `["browse-filter-options", …]` | |
  | `["live-events", params]` | |
  | `["cart", owner]` | |
  | `["current-user"]` | |
  | `["wallet"]` | |
  | `["account", name, params, revision]` | |
  | `["notifications", "summary", identity, params]` | Consumed by the Navbar through `frontend/src/features/dashboard/useSharedDashboardData.js`, a dashboard folder used by the customer chrome |

- **Window events:** `khaznah-marketplace-search`, `khaznah-wallet-updated`, `khaznah-notifications-updated`, `khaznah-categories-updated`, `khaznah-browse-tab-changed` (no listener).
- **BroadcastChannels:** `khaznah-auth`, `khaznah-locale`, `khaznah-token-refresh`, `khaznah-marketplace`.
- **Storage:**
  - localStorage: `khaznah-customer-language`, `khaznah-country`, `khazna_push_prompt_dismissed_until`, `khaznah:refresh-lock`, `khaznah-dashboard-theme` (auth pages).
  - sessionStorage: `khaznah-country-notice`, `khaznah-country-unsupported`.
  - Cookies: `khaznah-country` (Next), `khaznah_refresh` and `khaznah_cart_session` (backend, HttpOnly).

### D.6 Coupling with out-of-scope surfaces

These shared files also serve the dashboard or warehouse surfaces. A visual change there affects out-of-scope pages.

| File | Also used by |
|---|---|
| `GradeBadge.jsx` | `app/dashboard/ecommerce/page.js` |
| `PlanCard.jsx` | `app/dashboard/warehouses/page.js` |
| `LoginLanguageToggle.jsx` | Dashboard and warehouse logins |
| `DashboardThemeProvider.jsx` | Customer auth and seller-register pages |
| `lib/currency.js`, `lib/ws.js`, `lib/useCountdown.js`, `lib/youtube.js`, `lib/gradeInfo.js`, `lib/queryKeys.js`, `lib/api.js` | Dashboard pages |
| `app/globals.css` | Dashboard (it contains the dashboard theme) |
