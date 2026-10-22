// Seller registration sample data, shaped like production's public APIs.
//
// SELLER_PACKAGES — GET billing/packages/public/ (active packages ordered by
// display_order; prices are decimal strings; a null quota means unlimited).
// Package names, prices and limits are set by Khaznah's admins in
// production and are not in the source: these three are preview samples.
// Only "Enterprise" with a 7-day trial is evidenced (billing migration 0005).
//
// SELLER_COUNTRIES — GET operations/countries/public/: the two countries
// production seeds (operations migration 0029), Saudi Arabia the default.

const features = (flags, quotas) => ({
  ecommerce_enabled: false,
  auctions_enabled: false,
  live_auctions_enabled: false,
  pallet_auctions_enabled: false,
  bulk_import_enabled: false,
  pickup_enabled: false,
  cod_enabled: false,
  seats_limit: null,
  monthly_auction_limit: null,
  monthly_order_limit: null,
  max_active_listings: null,
  ...flags,
  ...quotas,
});

export const SELLER_PACKAGES = [
  {
    id: 1,
    name: "Starter",
    slug: "starter",
    monthly_price: "149.00",
    annual_price: "1490.00",
    trial_days: 14,
    display_order: 1,
    is_active: true,
    features: features({ ecommerce_enabled: true, pickup_enabled: true }, { seats_limit: 2, monthly_auction_limit: 0, monthly_order_limit: 200, max_active_listings: 100 }),
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    monthly_price: "399.00",
    annual_price: "3830.00",
    trial_days: 14,
    display_order: 2,
    is_active: true,
    features: features(
      { ecommerce_enabled: true, auctions_enabled: true, live_auctions_enabled: true, pickup_enabled: true, cod_enabled: true },
      { seats_limit: 5, monthly_auction_limit: 60, monthly_order_limit: 1500, max_active_listings: 1000 },
    ),
  },
  {
    id: 3,
    name: "Enterprise",
    slug: "enterprise",
    monthly_price: "999.00",
    annual_price: "9590.00",
    trial_days: 7,
    display_order: 3,
    is_active: true,
    features: features({
      ecommerce_enabled: true,
      auctions_enabled: true,
      live_auctions_enabled: true,
      pallet_auctions_enabled: true,
      bulk_import_enabled: true,
      pickup_enabled: true,
      cod_enabled: true,
    }),
  },
];

export const SELLER_COUNTRIES = [
  { id: 1, code: "SA", name: "Saudi Arabia", name_ar: "المملكة العربية السعودية", is_active: true, is_default: true, sort_order: 1 },
  { id: 2, code: "EG", name: "Egypt", name_ar: "مصر", is_active: true, is_default: false, sort_order: 2 },
];
