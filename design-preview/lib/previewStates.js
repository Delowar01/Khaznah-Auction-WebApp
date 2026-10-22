// Preview states of the Option 3 customer pages: the documented states of a
// screen (empty, loading, errors, a signed-out visitor, a step of a flow…)
// that a reviewer would otherwise have to provoke. Each page reads `?state=`
// (see components/shared/preview/StateRoute.jsx); the presentation bar lists
// the current page's states. "default" is the page as a signed-in buyer
// meets it. Labels describe the state, not the design.

const S = (key, en, ar) => ({ key, label: { en, ar } });

export const PAGE_STATES = {
  seller: [S("default", "Storefront", "المتجر"), S("error", "Catalogue failed to load", "تعذّر تحميل الكتالوج")],
  cart: [
    S("default", "Your cart (this visit)", "سلتك (هذه الزيارة)"),
    S("sample", "Sample: three sellers", "نموذج: ثلاثة بائعين"),
    S("attention", "Sample: item unavailable", "نموذج: منتج غير متاح"),
    S("guest", "Guest cart (signed out)", "سلة زائر (غير مسجّل)"),
    S("empty", "Empty cart", "سلة فارغة"),
    S("loading", "Loading", "جارٍ التحميل"),
    S("error", "Cart failed to load", "تعذّر تحميل السلة"),
  ],
  checkout: [
    S("default", "Delivery (your cart, or two sellers)", "توصيل (سلتك أو بائعان)"),
    S("pickup", "Warehouse pickup", "استلام من المستودع"),
    S("no-address", "No saved address", "لا يوجد عنوان محفوظ"),
    S("quoting", "Pricing delivery", "جارٍ تسعير التوصيل"),
    S("quote-error", "Delivery price unavailable", "تعذّر تسعير التوصيل"),
    S("session", "Payment pending (resume)", "دفع معلّق (متابعة)"),
    S("session-error", "Payment check failed", "تعذّر التحقق من الدفع"),
    S("submitting", "Placing the order", "جارٍ تقديم الطلب"),
    S("redirecting", "Opening secure payment", "جارٍ فتح الدفع الآمن"),
    S("price-changed", "Total changed — review", "تغيّر الإجمالي — راجع"),
    S("error", "Order failed", "تعذّر تقديم الطلب"),
    S("created", "Order created (placeholder)", "تم إنشاء الطلب (نموذج)"),
    S("signed-out", "Signed out", "غير مسجّل الدخول"),
    S("empty", "No items to checkout", "لا توجد منتجات"),
    S("loading", "Loading", "جارٍ التحميل"),
  ],
  payment: [
    S("default", "Card form ready", "نموذج البطاقة جاهز"),
    S("loading", "Loading the form", "جارٍ تحميل النموذج"),
    S("provider-error", "Card form unavailable", "نموذج البطاقة غير متاح"),
    S("error", "Payment not found", "لم يُعثر على الدفعة"),
  ],
  paymentResult: [
    S("verifying", "Verifying", "جارٍ التحقق"),
    S("paid", "Paid · redirecting", "تم الدفع · جارٍ التحويل"),
    S("pending", "Still processing", "قيد المعالجة"),
    S("failed", "Payment failed", "فشل الدفع"),
    S("signed-out", "Signed out", "غير مسجّل الدخول"),
    S("error", "Verification failed", "تعذّر التحقق"),
  ],
  account: [
    S("default", "Signed-in buyer", "مشترٍ مسجّل"),
    S("empty", "New account (nothing yet)", "حساب جديد (لا شيء بعد)"),
    S("suspended", "Account suspended", "الحساب موقوف"),
    S("appeal", "Suspended · appeal sent", "موقوف · تم إرسال التظلّم"),
    S("loading", "Loading", "جارٍ التحميل"),
    S("error", "Section failed to load", "تعذّر تحميل القسم"),
  ],
  login: [
    S("default", "Sign in", "تسجيل الدخول"),
    S("registered", "After registering", "بعد التسجيل"),
    S("expired", "Session expired", "انتهت الجلسة"),
    S("error", "Wrong email or password", "بريد أو كلمة مرور غير صحيحة"),
    S("not-buyer", "Not a customer account", "ليس حساب عميل"),
  ],
  register: [
    S("default", "Your details", "بياناتك"),
    S("errors", "Missing details", "بيانات ناقصة"),
    S("verify", "Email code", "رمز البريد"),
    S("verify-error", "Wrong code", "رمز غير صحيح"),
    S("verify-test", "Email code · test mode", "رمز البريد · وضع الاختبار"),
    S("seller", "Selling instead", "التسجيل كبائع"),
  ],
  sellerRegister: [
    S("default", "Seller details", "بيانات البائع"),
    S("errors", "Missing details", "بيانات ناقصة"),
    S("loading", "Plans loading", "جارٍ تحميل الباقات"),
    S("no-plans", "No plans available", "لا توجد باقات متاحة"),
    S("success", "Account created", "تم إنشاء الحساب"),
  ],
  contact: [
    S("default", "Contact", "تواصل معنا"),
    S("sent", "Message sent", "تم إرسال الرسالة"),
    S("error", "Message failed", "تعذّر الإرسال"),
  ],
  faq: [S("default", "FAQ", "الأسئلة الشائعة"), S("no-results", "No matching question", "لا يوجد سؤال مطابق")],
};

export const statesOf = (pageKey) => PAGE_STATES[pageKey] || null;
