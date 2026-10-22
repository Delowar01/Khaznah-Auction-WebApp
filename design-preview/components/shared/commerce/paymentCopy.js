// Payment pages copy. Production's two payment pages
// (frontend/src/app/payment/moyasar/[id]/page.js and payment/result/page.js)
// are English only — every line here is production's English with a new
// Arabic translation (arNew), which the production pages still need.
// copyNew marks the few lines this design adds: the card-form container's
// label and note, the preview's stand-in controls for Moyasar's form, and
// the redirect line on the paid result.
import { arNew, copyNew } from "./flags";

export const PAYMENT_COPY = {
  // /payment/moyasar/[id]
  eyebrow: arNew("Secure payment", "دفع آمن"),
  title: arNew("Pay online", "الدفع الإلكتروني"),
  payment: arNew("Payment", "الدفعة"),
  amount: arNew("Amount", "المبلغ"),
  loading: arNew("Loading payment...", "جارٍ تحميل الدفعة..."),
  viewResult: arNew("View payment result", "عرض نتيجة الدفع"),
  returnToCheckout: arNew("Return to checkout", "العودة إلى إتمام الطلب"),
  securityNote: arNew("Your card details are handled by the secure payment service. Khaznah stores only a masked payment summary.", "تتولى خدمة الدفع الآمنة بيانات بطاقتك، ولا تحتفظ خزنة إلا بملخص مُخفى للدفعة."),
  notConfigured: arNew("Online payment is not configured. Please contact support.", "الدفع الإلكتروني غير مُعدّ. يُرجى التواصل مع الدعم."),
  scriptFailed: arNew("Unable to load online payment.", "تعذّر تحميل الدفع الإلكتروني."),
  startFailed: arNew("Online payment could not be started.", "تعذّر بدء الدفع الإلكتروني."),
  initFailed: arNew("Unable to initialize online payment.", "تعذّرت تهيئة الدفع الإلكتروني."),
  cardForm: copyNew("Card details", "بيانات البطاقة"),
  cardFormNote: copyNew("Moyasar's secure card form opens here. The card number, expiry date, security code and Pay button are Moyasar's own fields, shown in your language.", "يظهر هنا نموذج البطاقة الآمن من ميسر. حقول رقم البطاقة وتاريخ الانتهاء ورمز الأمان وزر الدفع خاصة بميسر، وتظهر بلغتك."),
  networks: copyNew("Accepted cards", "البطاقات المقبولة"),
  previewOnly: copyNew("Preview only", "للمعاينة فقط"),
  previewNote: copyNew("These stand in for Moyasar's form in this preview.", "هذان الزران بديل لنموذج ميسر في هذه المعاينة."),
  simulatePaid: copyNew("Simulate a completed payment", "محاكاة دفع مكتمل"),
  simulateDeclined: copyNew("Simulate a declined card", "محاكاة رفض البطاقة"),
  sessionExpired: arNew("Session expired. Please log in again.", "انتهت الجلسة. يُرجى تسجيل الدخول مرة أخرى."),

  // /payment/result
  verifying: arNew("Verifying your payment...", "جارٍ التحقق من دفعتك..."),
  failedVerification: arNew("Payment verification failed", "تعذّر التحقق من الدفع"),
  paid: arNew("Payment completed", "اكتمل الدفع"),
  notCompleted: arNew("Payment was not completed", "لم يكتمل الدفع"),
  beingVerified: arNew("Payment is being verified", "جارٍ التحقق من الدفع"),
  // The status is production's raw, lower-case token (paid, failed …), shown as is.
  body: arNew("Payment {number} is {status}. The payment record is authoritative.", "حالة الدفعة {number}: {status}. سجلّ الدفع هو المرجع المعتمد."),
  missingReference: arNew("Payment reference is missing from the return URL.", "مرجع الدفع غير موجود في رابط العودة."),
  signedOut: arNew("Please log in again to verify this payment.", "يُرجى تسجيل الدخول مرة أخرى للتحقق من هذه الدفعة."),
  backToOrder: arNew("Back to your order", "العودة إلى طلبك"),
  viewOrders: arNew("View orders", "عرض الطلبات"),
  wallet: arNew("Wallet", "المحفظة"),
  redirecting: copyNew("Taking you to your orders…", "جارٍ نقلك إلى طلباتك…"),
};

// Server text as production shows it (English): the record lookup's 404 and
// a verification failure.
export const PAYMENT_SERVER_ERRORS = {
  notFound: "Not found.",
  verification: "Moyasar: Unable to reach Moyasar for payment verification.",
};
