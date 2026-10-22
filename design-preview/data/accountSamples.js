// Sample data for the Option 3 buyer account, shaped like production's API
// payloads (account specs A §10 and B §1–5): order list and detail fields,
// invoices, the wallet, its ledger and saved cards, payment records,
// disputes, notifications and addresses. Amounts are decimal strings as the
// API sends them; dates are fixed so every visit reads the same. Item
// titles and pictures come from the shared catalogue by slug; text a buyer
// or the server writes (addresses, dispute reasons, notification text) is
// given in both languages for the Arabic preview, although production's
// server text is English only (spec B §0.2). Lists are page 1 (8 rows, 10
// notifications), with a second page where production offers "load more".
import { DEMO_USER } from "./site";

const order = (fields) => ({
  wallet_amount_applied: "0.00",
  discount_amount: "0.00",
  cod_surcharge_amount: "0.00",
  customer_delivery_charge: null,
  fulfillments: [],
  ...fields,
});

const vatOf = (total) => ((Number(total) * 15) / 115).toFixed(2);

// ── Orders (GET orders/orders/, newest first) ──
export const ORDERS_PAGE_1 = [
  order({
    id: 5121,
    order_number: "KZ-ORD-5121",
    order_type: "buy_now",
    status: "pending_payment",
    payment_status: "unpaid",
    fulfillment_status: "pending",
    delivery_method: "delivery",
    group_reference: "CHK-2026-10418",
    created_at: "2026-10-21T18:42:10+03:00",
    item: "task-lamp",
    seller: "RAWABI",
    subtotal: "189.00",
    customer_delivery_charge: "25.00",
    total_amount: "214.00",
    amount_due: "214.00",
    quantity: 1,
  }),
  order({
    id: 5120,
    order_number: "KZ-ORD-5120",
    order_type: "buy_now",
    status: "pending_payment",
    payment_status: "unpaid",
    fulfillment_status: "pending",
    delivery_method: "delivery",
    group_reference: "CHK-2026-10418",
    created_at: "2026-10-21T18:42:09+03:00",
    item: "capsule-coffee",
    seller: "KHAZNA",
    subtotal: "149.00",
    customer_delivery_charge: "25.00",
    total_amount: "174.00",
    amount_due: "174.00",
    quantity: 1,
  }),
  order({
    id: 5114,
    order_number: "KZ-ORD-5114",
    order_type: "auction_win",
    status: "pending_payment",
    payment_status: "unpaid",
    fulfillment_status: "pending",
    delivery_method: "delivery",
    created_at: "2026-10-21T09:30:00+03:00",
    payment_due_at: "2026-10-22T09:30:00+03:00",
    item: "washer-front",
    seller: "SAHEL",
    subtotal: "540.00",
    total_amount: "540.00",
    amount_due: "540.00",
    quantity: 1,
    // No delivery address yet: paying from Orders asks for one (quirk Q8).
    needsAddress: true,
  }),
  order({
    id: 5102,
    order_number: "KZ-ORD-5102",
    order_type: "auction_win",
    status: "paid",
    payment_status: "paid",
    fulfillment_status: "packing",
    delivery_method: "delivery",
    created_at: "2026-10-18T21:05:44+03:00",
    payment_due_at: "2026-10-19T21:05:44+03:00",
    item: "swivel-chair",
    seller: "RAWABI",
    subtotal: "801.00",
    discount_amount: "89.00",
    discount_code: "WELCOME10",
    customer_delivery_charge: "35.00",
    total_amount: "836.00",
    wallet_amount_applied: "836.00",
    amount_due: "0.00",
    quantity: 1,
  }),
  order({
    id: 5096,
    order_number: "KZ-ORD-5096",
    order_type: "buy_now",
    status: "dispatched",
    payment_status: "paid",
    fulfillment_status: "dispatched",
    delivery_method: "delivery",
    created_at: "2026-10-16T13:12:31+03:00",
    item: "field-watch",
    seller: "KHAZNA",
    subtotal: "89.00",
    customer_delivery_charge: "25.00",
    total_amount: "114.00",
    amount_due: "114.00",
    quantity: 1,
    fulfillments: [{ id: 3301, fulfillment_type: "delivery", status: "dispatched", courier_name: "SMSA Express", tracking_number: "SMS7731942", oto_tracking_url: "https://example.com/track/SMS7731942" }],
  }),
  order({
    id: 5089,
    order_number: "KZ-ORD-5089",
    order_type: "auction_win",
    status: "delivered",
    payment_status: "paid",
    fulfillment_status: "delivered",
    delivery_method: "delivery",
    created_at: "2026-10-09T20:47:03+03:00",
    payment_due_at: "2026-10-10T20:47:03+03:00",
    item: "robot-vacuum",
    seller: "REDSEA",
    subtotal: "610.00",
    customer_delivery_charge: "35.00",
    total_amount: "645.00",
    amount_due: "645.00",
    quantity: 1,
    fulfillments: [{ id: 3288, fulfillment_type: "delivery", status: "delivered", courier_name: "Aramex", tracking_number: "ARX5520193", oto_tracking_url: "https://example.com/track/ARX5520193" }],
  }),
  order({
    id: 5081,
    order_number: "KZ-ORD-5081",
    order_type: "buy_now",
    status: "paid",
    payment_status: "paid",
    fulfillment_status: "ready_for_pickup",
    delivery_method: "pickup",
    created_at: "2026-10-07T11:26:58+03:00",
    item: "hairpin-desk",
    seller: "RAWABI",
    subtotal: "349.00",
    total_amount: "349.00",
    amount_due: "349.00",
    quantity: 1,
    fulfillments: [{ id: 3274, fulfillment_type: "pickup", status: "ready_for_pickup", courier_name: null, tracking_number: null, oto_tracking_url: null, pickup_code: "4417" }],
  }),
  order({
    id: 5074,
    order_number: "KZ-ORD-5074",
    order_type: "auction_win",
    status: "pending_payment",
    payment_status: "failed",
    fulfillment_status: "pending",
    delivery_method: "delivery",
    created_at: "2026-10-21T22:04:40+03:00",
    payment_due_at: "2026-10-22T22:04:40+03:00",
    item: "laptop-bags-24",
    seller: "MAJD",
    subtotal: "620.00",
    customer_delivery_charge: "45.00",
    total_amount: "665.00",
    wallet_amount_applied: "100.00",
    amount_due: "565.00",
    quantity: 1,
    addressId: 22,
  }),
];

// Page 2 ("Load 8 more orders").
export const ORDERS_PAGE_2 = [
  order({
    id: 5061,
    order_number: "KZ-ORD-5061",
    order_type: "buy_now",
    status: "refunded",
    payment_status: "refunded",
    fulfillment_status: "cancelled",
    delivery_method: "delivery",
    created_at: "2026-09-30T17:40:12+03:00",
    item: "dutch-oven-blue",
    seller: "KHAZNA",
    subtotal: "229.00",
    customer_delivery_charge: "25.00",
    total_amount: "254.00",
    amount_due: "254.00",
    quantity: 1,
  }),
  order({
    id: 5050,
    order_number: "KZ-ORD-5050",
    order_type: "buy_now",
    status: "delivered",
    payment_status: "paid",
    fulfillment_status: "delivered",
    delivery_method: "delivery",
    created_at: "2026-09-22T10:05:33+03:00",
    item: "knit-sneakers",
    seller: "SAHEL",
    subtotal: "119.00",
    customer_delivery_charge: "25.00",
    total_amount: "144.00",
    amount_due: "144.00",
    quantity: 1,
    fulfillments: [{ id: 3190, fulfillment_type: "delivery", status: "delivered", courier_name: "SPL", tracking_number: "SPL0098813", oto_tracking_url: null }],
  }),
  order({
    id: 5043,
    order_number: "KZ-ORD-5043",
    order_type: "buy_now",
    status: "delivered",
    payment_status: "paid",
    fulfillment_status: "delivered",
    delivery_method: "pickup",
    created_at: "2026-09-15T15:48:20+03:00",
    item: "stand-mixer",
    seller: "SAHEL",
    subtotal: "399.00",
    total_amount: "399.00",
    amount_due: "399.00",
    quantity: 1,
    fulfillments: [{ id: 3172, fulfillment_type: "pickup", status: "delivered", pickup_code: "2290" }],
  }),
];

/** The order-detail fields of the drawer (VAT included in the total). */
export const withDetail = (o) => ({ ...o, vat_amount: vatOf(o.total_amount) });

// ── Invoices (GET payments/invoices/) ──
export const INVOICES = [
  { id: 412, invoice_number: "INV-2026-0412", order: 5102, order_number: "KZ-ORD-5102", status: "paid", total_amount: "836.00" },
  { id: 405, invoice_number: "INV-2026-0405", order: 5096, order_number: "KZ-ORD-5096", status: "paid", total_amount: "114.00" },
  { id: 398, invoice_number: "INV-2026-0398", order: 5089, order_number: "KZ-ORD-5089", status: "paid", total_amount: "645.00" },
  { id: 391, invoice_number: "INV-2026-0391", order: 5081, order_number: "KZ-ORD-5081", status: "issued", total_amount: "349.00" },
];

// ── Wallet (GET payments/wallet/me/, transactions, saved methods) ──
export const WALLET = { balance: String(DEMO_USER.walletBalance.toFixed(2)), status: "active", currency: "SAR" };

export const TRANSACTIONS = [
  { id: 801, transaction_type: "top_up", direction: "credit", amount: "500.00", balance_after: "1250.00", status: "completed", reference: "PAY-2026-9040" },
  { id: 799, transaction_type: "payment", direction: "debit", amount: "836.00", balance_after: "750.00", status: "completed", reference: "KZ-ORD-5102" },
  { id: 796, transaction_type: "release", direction: "credit", amount: "50.00", balance_after: "1586.00", status: "completed", reference: "PAY-2026-9021" },
  { id: 793, transaction_type: "hold", direction: "debit", amount: "50.00", balance_after: "1536.00", status: "completed", reference: "PAY-2026-9021" },
  { id: 790, transaction_type: "refund", direction: "credit", amount: "96.00", balance_after: "1586.00", status: "completed", reference: "KZ-ORD-5061" },
  { id: 786, transaction_type: "top_up", direction: "credit", amount: "1000.00", balance_after: "1490.00", status: "completed", reference: "PAY-2026-8990" },
  { id: 781, transaction_type: "partial_payment", direction: "debit", amount: "100.00", balance_after: "490.00", status: "completed", reference: "KZ-ORD-5074" },
  { id: 778, transaction_type: "top_up", direction: "credit", amount: "590.00", balance_after: "590.00", status: "completed", reference: null },
];

export const SAVED_METHODS = [
  { id: 31, display_label: "Mada ending 4021", brand: "Mada", last4: "4021", is_default: true, consent_for_auto_charge: false },
  { id: 32, display_label: "Visa ending 7710", brand: "Visa", last4: "7710", is_default: false, consent_for_auto_charge: true },
];

// ── Payment records (GET payments/payment-records/) ──
export const PAYMENT_RECORDS = [
  { id: 9051, payment_number: "PAY-2026-9051", order_number: "KZ-ORD-5121", amount: "214.00", status: "initiated", payment_type: "order_payment", transaction_url: "/payment/moyasar/9051" },
  { id: 9047, payment_number: "PAY-2026-9047", order_number: "KZ-ORD-5102", amount: "836.00", status: "paid", payment_type: "wallet_payment" },
  { id: 9040, payment_number: "PAY-2026-9040", order_number: null, amount: "500.00", status: "paid", payment_type: "wallet_top_up" },
  { id: 9033, payment_number: "PAY-2026-9033", order_number: "KZ-ORD-5096", amount: "114.00", status: "paid", payment_type: "order_payment" },
  { id: 9029, payment_number: "PAY-2026-9029", order_number: "KZ-ORD-5074", amount: "565.00", status: "failed", payment_type: "order_payment" },
  {
    id: 9021,
    payment_number: "PAY-2026-9021",
    order_number: null,
    amount: "50.00",
    status: "paid",
    payment_type: "deposit",
    description: { en: "Auction deposit for sale lot 442", ar: "تأمين مزاد للمنتج رقم 442" },
  },
  { id: 9017, payment_number: "PAY-2026-9017", order_number: "KZ-ORD-5089", amount: "645.00", status: "paid", payment_type: "order_payment" },
  { id: 9010, payment_number: "PAY-2026-9010", order_number: "KZ-ORD-5061", amount: "254.00", status: "refunded", payment_type: "order_payment" },
];

// ── Bids and the server watchlist (auto-watched when you bid, source "bid") ──
export const MY_BIDS = [
  { id: 7004, lot: "seat-covers", amount: 180, is_winning: true },
  { id: 7001, lot: "tv-43", amount: 1215, is_winning: false },
];

// ── Coupons for a won order (GET orders/orders/{id}/available-discounts/) ──
export const COUPONS = [
  { id: 4, code: "WELCOME10", discount_type: "percentage", value: "10.00" },
  { id: 7, code: "SHIP25", discount_type: "fixed_amount", value: "25.00" },
];

// Delivery price for a won order by the address's city (the server's quote
// from orders/{id}/auction-delivery-address/, sample values).
export const DELIVERY_BY_CITY = { Riyadh: "35.00", Jeddah: "45.00" };
export const DELIVERY_DEFAULT = "55.00";

// ── Disputes (GET orders/disputes/, newest first) ──
export const DISPUTES = [
  {
    id: 121,
    order: 5096,
    order_number: "KZ-ORD-5096",
    status: "open",
    reason: { en: "The watch strap is a different colour from the listing photos.", ar: "لون حزام الساعة مختلف عن صور الإعلان." },
    updated_at: "2026-10-21T16:02:00+03:00",
  },
  {
    id: 118,
    order: 5089,
    order_number: "KZ-ORD-5089",
    status: "under_review",
    reason: { en: "The robot vacuum arrived without its charging dock.", ar: "وصلت المكنسة الروبوت دون قاعدة الشحن." },
    updated_at: "2026-10-20T11:15:00+03:00",
  },
  {
    id: 97,
    order: 5050,
    order_number: "KZ-ORD-5050",
    status: "resolved",
    reason: { en: "The parcel arrived two days after the promised date.", ar: "وصلت الشحنة بعد الموعد المحدد بيومين." },
    updated_at: "2026-09-28T09:40:00+03:00",
  },
];

// ── Notifications (GET notifications/notifications/, 10 per page) ──
const note = (fields) => ({ status: "read", read_at: "2026-10-20T08:00:00+03:00", payload: null, ...fields });

export const NOTIFICATIONS_PAGE_1 = [
  note({
    id: 640,
    category: "bidding",
    status: "unread",
    read_at: null,
    title: { en: "You have been outbid", ar: "تم تجاوز مزايدتك" },
    body: { en: "Another bidder placed a higher bid on 43-inch Full HD Smart LED TV.", ar: "قدّم مزايد آخر مزايدة أعلى على تلفاز ذكي LED مقاس 43 بوصة." },
    payload: { amount: "1215.00", current_bid: "1240.00", next_valid_bid: "1265.00", status: "outbid" },
    action_url: "/auction/tv-43",
    action_label: { en: "View auction", ar: "عرض المزاد" },
    created_at: "2026-10-22T13:58:12+03:00",
  }),
  note({
    id: 638,
    category: "order",
    status: "unread",
    read_at: null,
    title: { en: "Auction won", ar: "فزت بالمزاد" },
    body: { en: "You won 6 kg Front-Load Washing Machine. Pay before the payment window closes.", ar: "فزت بغسالة أمامية التحميل سعة 6 كجم. ادفع قبل انتهاء مهلة الدفع." },
    action_url: "/account/orders/5114",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-10-21T09:30:05+03:00",
  }),
  note({
    id: 636,
    category: "payment",
    status: "unread",
    read_at: null,
    title: { en: "Payment failed", ar: "فشل الدفع" },
    body: { en: "The card payment for KZ-ORD-5074 did not go through.", ar: "لم تكتمل عملية الدفع بالبطاقة للطلب KZ-ORD-5074." },
    action_url: "/account?tab=orders&order=5074",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-10-21T22:16:40+03:00",
  }),
  note({
    id: 631,
    category: "dispute",
    status: "unread",
    read_at: null,
    title: { en: "Dispute status updated", ar: "تم تحديث حالة النزاع" },
    body: { en: "Your dispute for KZ-ORD-5089 is now under review.", ar: "نزاعك على الطلب KZ-ORD-5089 قيد المراجعة الآن." },
    action_url: "/account/orders/5089",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-10-20T11:15:02+03:00",
  }),
  note({
    id: 627,
    category: "bidding",
    title: { en: "You are the highest bidder", ar: "أنت صاحب أعلى مزايدة" },
    body: { en: "Your bid leads on Faux-Leather Car Seat Cover Set, Black.", ar: "مزايدتك في الصدارة على طقم أغطية مقاعد السيارة." },
    payload: { amount: "180.00", current_bid: "180.00", next_valid_bid: "185.00", status: "winning", is_winning: true },
    action_url: "/auction/seat-covers",
    action_label: { en: "View auction", ar: "عرض المزاد" },
    created_at: "2026-10-20T19:44:51+03:00",
  }),
  note({
    id: 622,
    category: "fulfillment",
    title: { en: "Ready for pickup", ar: "جاهز للاستلام" },
    body: { en: "KZ-ORD-5081 is ready at the warehouse. Bring your pickup code.", ar: "الطلب KZ-ORD-5081 جاهز في المستودع. أحضر رمز الاستلام." },
    action_url: "/account/orders/5081",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-10-19T10:02:18+03:00",
  }),
  note({
    id: 618,
    category: "bidding",
    title: { en: "Auction activity", ar: "نشاط في المزاد" },
    body: { en: "A lot on your watchlist has new bids: 1.5-Ton Split Air Conditioner.", ar: "منتج في مفضلتك عليه مزايدات جديدة: مكيّف سبليت 1.5 طن." },
    payload: { current_bid: "1480.00", next_valid_bid: "1500.00", status: "activity" },
    action_url: "/auction/split-ac",
    action_label: { en: "View auction", ar: "عرض المزاد" },
    created_at: "2026-10-18T17:20:09+03:00",
  }),
  note({
    id: 611,
    category: "order",
    title: { en: "Order dispatched", ar: "تم شحن الطلب" },
    body: { en: "KZ-ORD-5096 is on its way with SMSA Express.", ar: "الطلب KZ-ORD-5096 في الطريق مع سمسا إكسبريس." },
    action_url: "/account/orders/5096",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-10-17T08:41:37+03:00",
  }),
  note({
    id: 604,
    category: "payment",
    title: { en: "Wallet topped up", ar: "تم شحن المحفظة" },
    body: { en: "⁦⃁ 500⁩ was added to your Khaznah wallet.", ar: "أُضيف ⁦⃁ 500⁩ إلى محفظتك في خزنة." },
    action_url: "/account?tab=wallet",
    action_label: { en: "View notification", ar: "عرض الإشعار" },
    created_at: "2026-10-16T21:03:55+03:00",
  }),
  note({
    id: 597,
    category: "system",
    title: { en: "Lot cancelled: Hand-Crafted Leather Sofa", ar: "أُلغي المنتج: كنبة جلدية مصنوعة يدويًا" },
    body: { en: "The seller withdrew this lot from tonight's live sale.", ar: "سحب البائع هذا المنتج من المزاد المباشر الليلة." },
    action_url: "/live-auction",
    action_label: { en: "View live auction", ar: "عرض المزاد المباشر" },
    created_at: "2026-10-15T20:12:00+03:00",
  }),
];

export const NOTIFICATIONS_PAGE_2 = [
  note({
    id: 589,
    category: "account",
    title: { en: "Profile updated", ar: "تم تحديث الملف الشخصي" },
    body: { en: "Your preferred language was changed.", ar: "تم تغيير لغتك المفضلة." },
    action_url: "/account?tab=notifications",
    action_label: null,
    created_at: "2026-10-12T12:00:00+03:00",
  }),
  note({
    id: 575,
    category: "payment",
    title: { en: "Refund processed", ar: "تمت معالجة الاسترداد" },
    body: { en: "⁦⃁ 96⁩ for KZ-ORD-5061 was returned to your wallet.", ar: "أُعيد ⁦⃁ 96⁩ للطلب KZ-ORD-5061 إلى محفظتك." },
    action_url: "/account/orders/5061",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-10-03T14:22:09+03:00",
  }),
  note({
    id: 563,
    category: "dispute",
    title: { en: "Dispute created", ar: "تم إنشاء النزاع" },
    body: { en: "We received your dispute for KZ-ORD-5050.", ar: "استلمنا نزاعك على الطلب KZ-ORD-5050." },
    action_url: "/account/orders/5050",
    action_label: { en: "View order", ar: "عرض الطلب" },
    created_at: "2026-09-24T18:30:44+03:00",
  }),
  note({
    id: 551,
    category: "system",
    title: { en: "Welcome to Khaznah", ar: "مرحبًا بك في خزنة" },
    body: { en: "Your buyer account is ready.", ar: "حساب المشتري الخاص بك جاهز." },
    action_url: "/account?tab=notifications",
    action_label: null,
    created_at: "2026-09-01T09:00:00+03:00",
  }),
];

// ── Profile, addresses, suspension and appeal ──
export const PROFILE = {
  full_name: DEMO_USER.name,
  user_email: "faisal.alharbi@example.com",
  phone_number: "+966 55 010 2030",
  is_email_verified: false,
  preferred_language: "en",
  avatar: null,
};

export const ADDRESSES = [
  {
    id: 21,
    label: { en: "Home", ar: "المنزل" },
    recipient_name: DEMO_USER.name,
    recipient_phone: "+966 55 010 2030",
    city: { en: "Riyadh", ar: "الرياض" },
    cityKey: "Riyadh",
    region: { en: "Riyadh Province", ar: "منطقة الرياض" },
    district: { en: "Al Olaya", ar: "العليا" },
    address_line: { en: "King Fahd Road, Building 12, Apartment 4", ar: "طريق الملك فهد، مبنى 12، شقة 4" },
    postal_code: "12211",
    is_default: true,
  },
  {
    id: 22,
    label: { en: "Office", ar: "المكتب" },
    recipient_name: DEMO_USER.name,
    recipient_phone: "+966 55 010 2030",
    city: { en: "Jeddah", ar: "جدة" },
    cityKey: "Jeddah",
    region: { en: "Makkah Province", ar: "منطقة مكة المكرمة" },
    district: { en: "Al Rawdah", ar: "الروضة" },
    address_line: { en: "Prince Sultan Road, Tower 3, Floor 9", ar: "طريق الأمير سلطان، البرج 3، الطابق 9" },
    postal_code: "23434",
    is_default: false,
  },
];

export const SUSPENSION = {
  is_suspended: true,
  suspension_reason: { en: "Three auction wins were not paid within the payment window.", ar: "لم تُدفع ثلاثة مزادات فائزة خلال مهلة الدفع." },
};

export const APPEAL = {
  id: 3,
  status: "pending",
  reason: { en: "I was travelling and could not pay in time. My wallet is topped up now.", ar: "كنت مسافرًا ولم أتمكن من الدفع في الوقت المحدد. شحنت محفظتي الآن." },
  resolution_note: null,
};
