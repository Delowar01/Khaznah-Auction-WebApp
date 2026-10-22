// Sign-in, registration and seller onboarding copy. Production's words as
// written (frontend/src/app/(auth)/login/page.js, (auth)/register/page.js,
// seller/register/page.js, components/seller/PlanCard.jsx); arNew marks
// lines production shows in English only, copyNew presentation copy
// production does not have (see flags.js). Server messages (lib/auth.js)
// stay English in both languages, as production's backend sends them.
import { arNew, copyNew } from "./flags";

export const PORTAL_COPY = {
  loginNav: { en: "Choose login portal", ar: "اختر بوابة الدخول" },
  registerNav: { en: "Choose register portal", ar: "اختر بوابة التسجيل" },
  sellerNav: { en: "Choose portal", ar: "اختر البوابة" },
  buyer: { en: "Buyer", ar: "المشتري" },
  seller: { en: "Seller", ar: "البائع" },
  admin: { en: "Admin", ar: "الإدارة" },
  // The seller and staff portals are production screens outside this preview.
  outside: copyNew("Opens the {portal} portal in production — not part of this preview.", "يفتح بوابة {portal} في النظام الفعلي — وليست ضمن هذه المعاينة."),
  newTab: copyNew("(opens in a new tab)", "(يفتح في علامة تبويب جديدة)"),
};

const TILE_SELLERS = { en: "Verified sellers, escrowed deposits", ar: "بائعون موثوقون وودائع مؤمّنة" };
const TILE_BIDDING = { en: "Live, transparent bidding", ar: "مزايدة حيّة وشفافة" };

export const LOGIN_COPY = {
  // Intro panel
  pill: { en: "Khaznah marketplace", ar: "سوق خزنة" },
  introTitle: { en: "Welcome back to the vault.", ar: "مرحباً بعودتك إلى الخزنة." },
  introText: { en: "Sign in to bid live, track watchlists, check out securely, and follow every order.", ar: "سجّل الدخول للمزايدة الحيّة ومتابعة قوائمك وإتمام الشراء بأمان ومتابعة طلباتك." },
  tiles: [TILE_SELLERS, TILE_BIDDING, { en: "Email-verified accounts", ar: "حسابات موثّقة بالبريد" }, { en: "Secure checkout & orders", ar: "شراء وطلبات آمنة" }],
  trustTitle: { en: "Your details are protected", ar: "بياناتك محمية" },
  trustText: { en: "Your login details are encrypted and never shared.", ar: "بيانات دخولك مشفّرة ولا تتم مشاركتها أبداً." },
  // Form
  eyebrow: { en: "Customer login", ar: "دخول العملاء" },
  title: { en: "Welcome back", ar: "مرحباً بعودتك" },
  subtitle: { en: "Sign in with your Khaznah customer account.", ar: "سجّل الدخول باستخدام حساب خزنة الخاص بك." },
  registered: { en: "Account created. You can login now.", ar: "تم إنشاء الحساب. يمكنك تسجيل الدخول الآن." },
  expired: { en: "Your session expired. Please sign in again.", ar: "انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى." },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailPlaceholder: "you@example.com",
  password: { en: "Password", ar: "كلمة المرور" },
  submitting: { en: "Signing in...", ar: "جارٍ تسجيل الدخول..." },
  submit: { en: "Login", ar: "تسجيل الدخول" },
  newCustomer: { en: "New customer?", ar: "عميل جديد؟" },
  register: { en: "Register as a buyer", ar: "سجّل كمشترٍ" },
  // Errors
  errEmpty: { en: "Invalid credentials.", ar: "بيانات تسجيل الدخول غير صحيحة." },
  errNotBuyer: { en: "This login is for customers only. Use the admin or seller portal.", ar: "هذا الدخول مخصص للعملاء فقط. استخدم بوابة الإدارة أو البائع." },
  errFallback: { en: "Login failed. Please check your email and password.", ar: "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور." },
  loading: arNew("Loading login page", "جارٍ تحميل صفحة الدخول"),
};

export const REGISTER_COPY = {
  // Intro panel
  introTitle: { en: "Create your buyer account.", ar: "أنشئ حساب المشتري الخاص بك." },
  introText: {
    en: "Register like a normal ecommerce customer: name, email, phone, and password. Warehouse and operator access use separate portal registration.",
    ar: "سجّل كعميل تجارة إلكترونية باستخدام الاسم والبريد الإلكتروني والهاتف وكلمة المرور. يتم تسجيل موظفي المستودع والمشغلين عبر بوابات منفصلة.",
  },
  tiles: [TILE_SELLERS, TILE_BIDDING, { en: "Personal watchlist", ar: "قائمة مراقبة شخصية" }, { en: "Backend-calculated checkout totals", ar: "إجماليات شراء محسوبة من الخادم" }],
  trustText: { en: "Your account details are encrypted and never shared.", ar: "بيانات حسابك مشفّرة ولا تتم مشاركتها أبداً." },
  // Form
  eyebrow: { en: "Customer register", ar: "تسجيل عميل" },
  title: { en: "Create your account", ar: "أنشئ حسابك" },
  subtitle: { en: "Register as a Khaznah customer with your name, email, phone, and password.", ar: "سجّل كعميل خزنة باستخدام اسمك وبريدك الإلكتروني وهاتفك وكلمة المرور." },
  stepDetails: copyNew("Step 1 of 2 · Your details", "الخطوة 1 من 2 · بياناتك"),
  stepVerify: copyNew("Step 2 of 2 · Verify your email", "الخطوة 2 من 2 · تأكيد بريدك"),
  fullName: { en: "Full name", ar: "الاسم الكامل" },
  fullNamePlaceholder: { en: "Your name", ar: "اسمك" },
  phone: { en: "Phone", ar: "رقم الهاتف" },
  phonePlaceholder: "+966 5X XXX XXXX",
  confirmPassword: { en: "Confirm password", ar: "تأكيد كلمة المرور" },
  termsLead: { en: "I agree to the", ar: "أوافق على" },
  terms: { en: "terms", ar: "الشروط" },
  and: { en: "and", ar: "و" },
  privacy: { en: "privacy policy", ar: "سياسة الخصوصية" },
  creating: { en: "Creating...", ar: "جارٍ الإنشاء..." },
  submit: { en: "Create customer account", ar: "إنشاء حساب عميل" },
  haveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  login: { en: "Login", ar: "تسجيل الدخول" },
  joinSeller: { en: "Join as Seller", ar: "انضم كبائع" },
  // Step 2
  sentTo: { en: "We sent a 6-digit code to", ar: "أرسلنا رمزًا مكونًا من 6 أرقام إلى" },
  testMode: { en: "Test mode - OTP code:", ar: "وضع الاختبار - رمز التحقق:" },
  code: { en: "Verification code", ar: "رمز التحقق" },
  codePlaceholder: "000000",
  verifying: { en: "Verifying...", ar: "جارٍ التحقق..." },
  verify: { en: "Verify email", ar: "تحقق من البريد" },
  // "{label} {n}s" — the "s" is Latin in both languages, as in production.
  resendIn: { en: "Resend code in", ar: "إعادة الإرسال خلال" },
  resend: { en: "Resend code", ar: "إعادة إرسال الرمز" },
  // Errors
  errMismatch: { en: "Passwords do not match.", ar: "كلمتا المرور غير متطابقتين." },
  errTerms: { en: "Please accept the terms and privacy policy.", ar: "يرجى الموافقة على الشروط وسياسة الخصوصية." },
  errFallback: { en: "Registration failed. Please check your details.", ar: "فشل التسجيل. يرجى التحقق من بياناتك." },
  errVerify: { en: "Invalid or expired code. Try again or request a new one.", ar: "رمز غير صالح أو منتهي الصلاحية. حاول مرة أخرى أو اطلب رمزًا جديدًا." },
  errResend: { en: "Could not resend the code. Try again shortly.", ar: "تعذّر إعادة إرسال الرمز. حاول مرة أخرى بعد قليل." },
};

export const SELLER_REGISTER_COPY = {
  pill: { en: "Khaznah seller network", ar: "شبكة بائعي خزنة" },
  // Plans
  plansTitle: { en: "Choose your plan", ar: "اختر باقتك" },
  plansSubtitle: { en: "Upgrade or downgrade at any time.", ar: "يمكنك الترقية أو التخفيض في أي وقت." },
  cycle: copyNew("Billing cycle", "دورة الفوترة"),
  monthly: { en: "Monthly", ar: "شهري" },
  annual: { en: "Annual", ar: "سنوي" },
  annualBadge: { en: "-20%", ar: "-20٪" },
  plansLoading: { en: "Loading plans…", ar: "جارٍ تحميل الباقات…" },
  plansEmpty: { en: "No plans are available right now.", ar: "لا توجد باقات متاحة حاليًا." },
  plans: copyNew("Plans", "الباقات"),
  // Form
  formTitle: { en: "Create your seller workspace", ar: "أنشئ مساحة البائع" },
  selectedPlan: { en: "Selected plan", ar: "الباقة المختارة" },
  choosePlan: { en: "Choose a plan to continue.", ar: "اختر باقة للمتابعة." },
  login: { en: "Login", ar: "تسجيل الدخول" },
  fullName: { en: "Full name", ar: "الاسم الكامل" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  phone: { en: "Phone", ar: "رقم الهاتف" },
  phonePlaceholder: "+966 5X XXX XXXX",
  country: { en: "Country", ar: "الدولة" },
  city: { en: "City", ar: "المدينة" },
  businessName: { en: "Business name", ar: "اسم النشاط التجاري" },
  password: { en: "Password", ar: "كلمة المرور" },
  confirmPassword: { en: "Confirm password", ar: "تأكيد كلمة المرور" },
  showConfirm: { en: "Show confirmation password", ar: "إظهار تأكيد كلمة المرور" },
  hideConfirm: { en: "Hide confirmation password", ar: "إخفاء تأكيد كلمة المرور" },
  termsLead: { en: "I agree to the", ar: "أوافق على" },
  terms: { en: "seller terms", ar: "شروط البائع" },
  and: { en: "and", ar: "و" },
  policies: { en: "policies", ar: "السياسات" },
  termsTail: { en: ", including subscription billing for the selected plan.", ar: "، بما في ذلك فوترة الاشتراك للباقة المختارة." },
  creating: { en: "Creating account…", ar: "جارٍ إنشاء الحساب…" },
  submit: { en: "Create seller workspace", ar: "إنشاء مساحة البائع" },
  // Production leaves these checks to the browser's own bubbles (no
  // noValidate); the preview shows the same rules beside the fields.
  fieldRequired: copyNew("Fill in this field.", "املأ هذا الحقل."),
  fieldEmail: copyNew("Enter an email address with an @ and a domain.", "أدخل بريداً إلكترونياً يتضمن @ ونطاقاً."),
  fieldShort: copyNew("Use at least 8 characters.", "استخدم 8 أحرف على الأقل."),
  // Errors
  errNoPlan: { en: "Select a plan to continue.", ar: "اختر باقة للمتابعة." },
  errMismatch: { en: "Passwords do not match.", ar: "كلمتا المرور غير متطابقتين." },
  errTerms: { en: "Please accept the seller terms.", ar: "يرجى الموافقة على شروط البائع." },
  errFallback: { en: "Seller registration failed.", ar: "فشل تسجيل البائع." },
  // Success
  successTitle: { en: "You're in!", ar: "لقد انضممت!" },
  successText: { en: "Your seller account and warehouse are ready. Your seller code stays visible inside your dashboard.", ar: "حساب البائع والمستودع جاهزان. يظل رمز البائع ظاهرًا داخل لوحة التحكم." },
  warehouseCode: { en: "Warehouse code", ar: "رمز المستودع" },
  verified: { en: "Email verified", ar: "تم التحقق من البريد الإلكتروني" },
  sentTo: { en: "We sent a verification code to", ar: "أرسلنا رمز تحقق إلى" },
  testMode: { en: "Test mode — code:", ar: "وضع الاختبار — الرمز:" },
  code: { en: "Verification code", ar: "رمز التحقق" },
  codePlaceholder: "000000",
  verify: { en: "Verify", ar: "تحقق" },
  verifying: arNew("Verifying", "جارٍ التحقق"),
  resendIn: { en: "Resend in", ar: "إعادة الإرسال خلال" },
  resend: { en: "Resend code", ar: "إعادة إرسال الرمز" },
  errVerify: { en: "Invalid or expired code.", ar: "رمز غير صالح أو منتهي الصلاحية." },
  errResend: { en: "Could not resend the code.", ar: "تعذّر إعادة إرسال الرمز." },
  dashboard: { en: "Go to my dashboard", ar: "الذهاب إلى لوحة التحكم" },
  dashboardOutside: copyNew("The seller dashboard is production's seller portal — not part of this preview.", "لوحة تحكم البائع هي بوابة البائعين في النظام الفعلي — وليست ضمن هذه المعاينة."),
};

export const PLAN_COPY = {
  features: {
    ecommerce_enabled: { en: "Buy Now", ar: "الشراء الفوري" },
    auctions_enabled: { en: "Auctions", ar: "المزادات" },
    live_auctions_enabled: { en: "Live auctions", ar: "المزادات المباشرة" },
    pallet_auctions_enabled: { en: "Pallets", ar: "المنصات" },
    bulk_import_enabled: { en: "Bulk import", ar: "استيراد بالجملة" },
    pickup_enabled: { en: "Pickup", ar: "الاستلام" },
    cod_enabled: { en: "Cash on delivery", ar: "الدفع عند الاستلام" },
  },
  quotas: {
    seats_limit: { en: "Seats", ar: "المقاعد" },
    monthly_auction_limit: { en: "Auctions/mo", ar: "مزادات/شهر" },
    monthly_order_limit: { en: "Orders/mo", ar: "طلبات/شهر" },
    max_active_listings: { en: "Listings", ar: "القوائم" },
  },
  unlimited: copyNew("Unlimited", "غير محدود"),
  popular: { en: "Popular", ar: "الأكثر" },
  perYear: { en: "yr", ar: "سنة" },
  perMonth: { en: "mo", ar: "شهر" },
  trial: { en: "{n}-day trial", ar: "تجربة {n} يوم" },
  save: { en: "Save {n}%", ar: "وفّر {n}٪" },
  more: "+{n}",
  core: { en: "Core selling tools", ar: "أدوات البيع الأساسية" },
};
