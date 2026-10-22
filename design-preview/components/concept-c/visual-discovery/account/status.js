// Status vocabularies of the buyer account (account specs A §9 and B §6).
// Order and fulfilment labels are production's ORDER_STATUS_COPY and
// FULFILLMENT_STATUS_COPY with their tones. Production prints the other
// values raw (`paid`, `under_review` …) in one amber pill; here each value
// gets its backend choice label and a tone that matches its meaning, always
// with words and an icon. Production shows none of these in Arabic, so every
// Arabic label is a new translation (arNew).
import { arNew } from "@/components/shared/commerce/flags";

// Production tones → Option 3 StatusPill tones.
const TONES = { pending: "warning", success: "success", info: "info", danger: "danger" };

const humanize = (value) => String(value).replace(/_/g, " ");

const ORDER = {
  draft: [arNew("Draft", "مسودة"), "pending"],
  pending_payment: [arNew("Awaiting payment", "بانتظار الدفع"), "pending"],
  paid: [arNew("Paid", "مدفوع"), "success"],
  packing: [arNew("Being packed", "قيد التغليف"), "pending"],
  dispatched: [arNew("On its way", "في الطريق"), "info"],
  delivered: [arNew("Delivered", "تم التوصيل"), "success"],
  cancelled: [arNew("Cancelled", "ملغى"), "danger"],
  refunded: [arNew("Refunded", "مسترد"), "info"],
  disputed: [arNew("Under review", "قيد المراجعة"), "pending"],
};

const FULFILMENT = {
  pending: [arNew("Preparing your order", "يجري تجهيز طلبك"), "pending"],
  packing: [arNew("Being packed", "قيد التغليف"), "pending"],
  ready_for_pickup: [arNew("Ready for pickup", "جاهز للاستلام"), "info"],
  dispatched: [arNew("On its way", "في الطريق"), "info"],
  delivered: [arNew("Delivered", "تم التوصيل"), "success"],
  cancelled: [arNew("Cancelled", "ملغى"), "danger"],
};

function lookup(table, value, empty) {
  const key = String(value || "").toLowerCase();
  if (!key) return { label: empty[0], tone: TONES[empty[1]] };
  const hit = table[key];
  if (hit) return { label: hit[0], tone: TONES[hit[1]] };
  return { label: humanize(key), tone: "warning" };
}

/** Order status (§9.1): label and tone; unknown values raw with spaces, empty "Pending". */
export const orderStatus = (value) => lookup(ORDER, value, [arNew("Pending", "قيد الانتظار"), "pending"]);

/** Fulfilment status (§9.2): empty or missing reads "Preparing your order". */
export const fulfilmentStatus = (value) => lookup(FULFILMENT, value, FULFILMENT.pending);

// The pending set production uses for "Pay", the hero CTA, the alert bar and
// the overview tile (§9.3) — including values that never occur.
export const PENDING_PAYMENT = new Set(["pending", "pending_payment", "unpaid", "initiated", "failed"]);
export const PAID_PAYMENT = new Set(["paid", "completed", "succeeded"]);
export const GROUP_PAYABLE = new Set(["pending_payment", "unpaid", "pending", "failed"]);
export const isPendingPayment = (order) => PENDING_PAYMENT.has(String(order?.payment_status || "").toLowerCase());
export const isPaid = (order) => PAID_PAYMENT.has(String(order?.payment_status || "").toLowerCase());

// Lots that no longer count as watched (§4.2 isLiveWatchlistLot).
export const CLOSED_LOT = new Set(["closed", "sold", "expired", "reserve_not_met", "cancelled"]);

/** Raw enum → backend label and tone, for the values production prints raw. */
function table(entries, fallbackTone = "warning") {
  return (value) => {
    const key = String(value || "").toLowerCase();
    const hit = entries[key];
    return hit ? { label: hit[0], tone: hit[1] } : { label: humanize(key), tone: fallbackTone };
  };
}

export const lotStatus = table({
  live: [arNew("Live", "مباشر"), "info"],
  scheduled: [arNew("Scheduled", "مجدول"), "warning"],
  paused: [arNew("Paused", "متوقف مؤقتًا"), "warning"],
  draft: [arNew("Draft", "مسودة"), "neutral"],
  closed: [arNew("Closed", "مغلق"), "neutral"],
  sold: [arNew("Sold", "مباع"), "neutral"],
});

export const saleType = table({
  auction: [arNew("Auction", "مزاد"), "info"],
  buy_now: [arNew("Buy Now", "شراء فوري"), "info"],
  both: [arNew("Auction or Buy Now", "مزاد أو شراء فوري"), "info"],
});

export const orderType = table({
  buy_now: [arNew("Buy Now", "شراء فوري"), "neutral"],
  auction_win: [arNew("Auction win", "فوز بمزاد"), "neutral"],
  mixed: [arNew("Mixed", "مختلط"), "neutral"],
});

export const bidType = table({
  normal: [arNew("Standard", "عادية"), "neutral"],
  proxy_auto: [arNew("Automatic", "تلقائية"), "neutral"],
  admin_override: [arNew("Adjusted by Khaznah", "عدّلتها خزنة"), "neutral"],
});

export const paymentRecordStatus = table({
  pending: [arNew("Pending", "قيد الانتظار"), "warning"],
  initiated: [arNew("Initiated", "بدأت"), "warning"],
  paid: [arNew("Paid", "مدفوعة"), "success"],
  failed: [arNew("Failed", "فشلت"), "danger"],
  refunded: [arNew("Refunded", "مستردة"), "info"],
  cancelled: [arNew("Cancelled", "ملغاة"), "danger"],
  expired: [arNew("Expired", "منتهية"), "danger"],
});

export const invoiceStatus = table({
  draft: [arNew("Draft", "مسودة"), "neutral"],
  issued: [arNew("Issued", "صادرة"), "info"],
  paid: [arNew("Paid", "مدفوعة"), "success"],
  cancelled: [arNew("Cancelled", "ملغاة"), "danger"],
  refunded: [arNew("Refunded", "مستردة"), "info"],
});

export const walletStatus = table({
  active: [arNew("Active", "نشطة"), "success"],
  frozen: [arNew("Frozen", "مجمّدة"), "danger"],
});

export const transactionType = table(
  {
    top_up: [arNew("Top Up", "شحن"), "neutral"],
    payment: [arNew("Payment", "دفع"), "neutral"],
    partial_payment: [arNew("Partial Payment", "دفع جزئي"), "neutral"],
    refund: [arNew("Refund", "استرداد"), "neutral"],
    adjustment_credit: [arNew("Adjustment Credit", "تسوية إضافة"), "neutral"],
    adjustment_debit: [arNew("Adjustment Debit", "تسوية خصم"), "neutral"],
    auction_deposit: [arNew("Auction Deposit", "تأمين مزاد"), "neutral"],
    release: [arNew("Release", "إفراج"), "neutral"],
    hold: [arNew("Hold", "حجز"), "neutral"],
  },
  "neutral",
);

export const transactionDirection = table(
  {
    credit: [arNew("Credit", "إضافة"), "success"],
    debit: [arNew("Debit", "خصم"), "neutral"],
  },
  "neutral",
);

export const transactionStatus = table({
  pending: [arNew("Pending", "قيد الانتظار"), "warning"],
  completed: [arNew("Completed", "مكتملة"), "success"],
  failed: [arNew("Failed", "فشلت"), "danger"],
  reversed: [arNew("Reversed", "معكوسة"), "info"],
});

export const disputeStatus = table({
  open: [arNew("Open", "مفتوح"), "warning"],
  under_review: [arNew("Under review", "قيد المراجعة"), "info"],
  approved: [arNew("Approved", "مقبول"), "success"],
  rejected: [arNew("Rejected", "مرفوض"), "danger"],
  resolved: [arNew("Resolved", "تم الحل"), "success"],
  cancelled: [arNew("Cancelled", "ملغى"), "neutral"],
});

// Disputes the sidebar counts as open (§4.2).
export const DISPUTE_CLOSED = new Set(["resolved", "cancelled", "rejected"]);

export const appealStatus = table({
  pending: [arNew("Pending", "قيد المراجعة"), "warning"],
  approved: [arNew("Approved", "مقبول"), "success"],
  rejected: [arNew("Rejected", "مرفوض"), "danger"],
});

// The order card's invoice slot prints the raw payment status when there is
// no invoice number ("Invoice unpaid", quirk Q17); Arabic gets a translation.
export const paymentSlot = table(
  {
    unpaid: [arNew("unpaid", "غير مدفوعة"), "neutral"],
    pending: [arNew("pending", "معلّقة"), "neutral"],
    pickup_cash_pending: [arNew("pickup_cash_pending", "بانتظار الدفع عند الاستلام"), "neutral"],
    paid: [arNew("paid", "مدفوعة"), "neutral"],
    failed: [arNew("failed", "فشل دفعها"), "neutral"],
    refunded: [arNew("refunded", "مستردة"), "neutral"],
  },
  "neutral",
);
