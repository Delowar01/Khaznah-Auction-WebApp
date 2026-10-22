// Sample data for the Option 3 checkout and payment previews: what
// production's checkout reads from its APIs (saved addresses, pickup
// locations, the wallet, the delivery quote's per-warehouse terms, suggested
// coupons, a reserved checkout session, a created order and the payment
// record), shaped like those responses. All values are samples.
//
// Server text stays as the server sends it: coupon and discount names have
// no Arabic field in production, so they are English in both languages.

// Carts the checkout preview states load into the preview store.
export const CHECKOUT_CARTS = {
  // Two sellers (one order and delivery fee each); both carry automatic
  // (marked-down) prices, and one warehouse offers cash on delivery.
  delivery: [
    { slug: "capsule-coffee", qty: 1 },
    { slug: "field-watch", qty: 1 },
    { slug: "task-lamp", qty: 2 },
    { slug: "hairpin-desk", qty: 1 },
  ],
  // Khazna's own (platform) lots only: the one cart production lets collect.
  pickup: [
    { slug: "capsule-coffee", qty: 1 },
    { slug: "field-watch", qty: 2 },
  ],
};

// The signed-in buyer's active saved addresses (GET accounts/addresses/),
// shaped like the API rows. Values are what the buyer typed, so the Arabic
// preview shows Arabic entries. The first was saved from checkout, which
// always labels it "Delivery address" (an English literal) and stores the
// building in both the street line and the postal code (production quirk).
export const SAMPLE_ADDRESSES = [
  {
    id: 301,
    label: { en: "Delivery address", ar: "Delivery address" },
    recipient_name: { en: "Faisal Al-Harbi", ar: "فيصل الحربي" },
    recipient_phone: "+966 50 000 1234",
    city: { en: "Riyadh", ar: "الرياض" },
    district: { en: "Al Olaya", ar: "العليا" },
    region: { en: "Riyadh Region", ar: "منطقة الرياض" },
    address_line: { en: "King Fahd Road, 4120", ar: "طريق الملك فهد, 4120" },
    postal_code: "4120",
    extra_data: { notes: "", building: "4120" },
    is_default: true,
  },
  {
    id: 302,
    label: { en: "Office", ar: "المكتب" },
    recipient_name: { en: "Faisal Al-Harbi", ar: "فيصل الحربي" },
    recipient_phone: "+966 50 000 1234",
    city: { en: "Jeddah", ar: "جدة" },
    district: { en: "Al Rawdah", ar: "الروضة" },
    region: { en: "Makkah Region", ar: "منطقة مكة المكرمة" },
    address_line: { en: "Prince Sultan Street, Building 2219", ar: "شارع الأمير سلطان, مبنى 2219" },
    postal_code: "23432",
    extra_data: { notes: "", building: "" },
    is_default: false,
  },
];

// Platform pickup locations (GET orders/pickup-locations/, filtered to the
// cart's origin: platform lots have no warehouse).
export const SAMPLE_PICKUP_LOCATIONS = [
  {
    id: 11,
    name: { en: "Khazna pickup desk", ar: "مكتب استلام خزنة" },
    city: { en: "Riyadh", ar: "الرياض" },
    address_line1: { en: "Al Sulay Industrial Area, Exit 18", ar: "المنطقة الصناعية بالسلي، مخرج 18" },
    contact_name: { en: "Pickup desk", ar: "مكتب الاستلام" },
    phone: "+966 11 000 4400",
    is_default: true,
  },
  {
    id: 12,
    name: { en: "Khazna Jeddah counter", ar: "منفذ خزنة في جدة" },
    city: { en: "Jeddah", ar: "جدة" },
    address_line1: { en: "Al Khumrah logistics zone, Gate 3", ar: "منطقة الخمرة اللوجستية، البوابة 3" },
    contact_name: { en: "Collection counter", ar: "منفذ الاستلام" },
    phone: "+966 12 000 7700",
    is_default: false,
  },
];

// GET payments/wallet/me/ — the demo buyer's balance (data/site.js DEMO_USER).
export const SAMPLE_WALLET = { balance: 1250, status: "active" };

// Delivery quote terms per warehouse (POST orders/delivery/quote/): a fee
// inside or outside the warehouse's city, and cash on delivery where the
// warehouse enables it. Production's default leaves home-delivery COD off
// platform-wide; the sample turns it on so one order shows the choice.
export const QUOTE_TERMS = {
  homeDeliveryCodEnabled: true,
  base: { inside: 25, outside: 45 },
  // Bulky furniture and appliances cost more to deliver.
  surcharge: { RAWABI: 15, SAHEL: 20 },
  cod: { RAWABI: { fee: 15, max: 3000 } },
};

// Suggested coupons per order (pricing preview `available_coupons`).
export const SAMPLE_COUPONS = {
  KHAZNA: [
    { id: 71, code: "SHIPFREE", name: "Free delivery on Khazna Direct orders", description: "Free home delivery on Khazna Direct orders over SAR 200.", discount_type: "free_shipping", min_order_amount: 200 },
    { id: 72, code: "KHZ20", name: "SAR 20 off", description: "SAR 20 off Khazna Direct orders over SAR 150.", discount_type: "fixed", value: 20, min_order_amount: 150 },
  ],
  RAWABI: [{ id: 81, code: "RAWABI50", name: "SAR 50 off Rawabi", description: "SAR 50 off Rawabi Home Outlet orders over SAR 500.", discount_type: "fixed", value: 50, min_order_amount: 500 }],
};

// Name of the automatic (marked-down price) discount in `applied_discounts`.
export const AUTO_DISCOUNT_NAME = "Marked-down prices";

// A pending, deferred checkout session (GET orders/checkout/active/).
export const SAMPLE_SESSION = {
  reference: "4c1f7a52-9d0e-4b8a-a1d3-6f2e9b7c0d41",
  payment_record_id: 9051,
  wallet_reserved: 300,
  // What the completed checkout records (extra_data.order_group_reference
  // for several sellers; the order for one).
  group_reference: "GRP-000123",
  order_id: 418,
};

// The placeholder "Order Created" screen's order (POST orders/checkout/ →
// a plain order): production shows these raw values.
export const SAMPLE_CREATED_ORDER = {
  order_number: "KA-000418",
  total_amount: 238,
  payment_status: "pending",
};

// The payment record behind /payment/moyasar/9051 (GET …/status/).
export const SAMPLE_PAYMENT = {
  id: 9051,
  payment_number: "PAY-20261022-1A2B3C4D",
  amount: 725,
  status: "initiated",
  description: "Khaznah checkout payment",
  supported_networks: ["mada", "visa", "mastercard"],
};
