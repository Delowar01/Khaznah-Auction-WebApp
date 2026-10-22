// Copy of the Option 3 content, support and system screens beyond
// production's page text (that is in data/contentPages.js, verbatim).
// Production strings are used as written ({ en, ar }); arNew marks lines
// production shows in English only, copyNew wording production does not
// have (see flags.js). Nothing here states a new fact about Khaznah.
import { arNew, copyNew } from "./flags";

/** Production's six "About" destinations (Navbar dropdown and phone menu labels, as written). */
export const HELP_PAGES = [
  { key: "about", href: "/about", label: { en: "About Us", ar: "عن خزنة" }, short: { en: "About", ar: "عن" } },
  { key: "howItWorks", href: "/how-it-works", label: { en: "How It Works", ar: "كيف يعمل" } },
  { key: "faq", href: "/faq", label: { en: "FAQ", ar: "الأسئلة الشائعة" } },
  { key: "contact", href: "/contact", label: { en: "Contact", ar: "تواصل" } },
  { key: "privacy", href: "/privacy", label: { en: "Privacy Policy", ar: "سياسة الخصوصية" } },
  { key: "terms", href: "/terms", label: { en: "Terms & Conditions", ar: "الشروط والأحكام" } },
];

export const CONTENT_COPY = {
  helpNav: copyNew("Help and company", "المساعدة والشركة"),
  trustMarks: copyNew("Payment and trust marks", "علامات الدفع والثقة"),

  // How it works: the three ways to buy (Phase 19), in the words of the
  // behaviour the marketplace already has.
  journeysKicker: copyNew("Three ways to buy", "ثلاث طرق للشراء"),
  journeysTitle: copyNew("Choose how you want to buy", "اختر طريقة الشراء التي تناسبك"),
  timedText: copyNew(
    "Bid before the timer runs out. Set a maximum bid and your bids rise automatically up to it; a bid in the last minutes extends the timer. The highest bid when the timer ends wins.",
    "زايد قبل انتهاء الوقت. حدّد حدّاً أقصى لمزايدتك لترتفع مزايداتك تلقائياً حتى بلوغه، وتمدّد المزايدة في الدقائق الأخيرة الوقت. تفوز أعلى مزايدة عند انتهاء الوقت.",
  ),
  buyNowText: copyNew(
    "Pay the listed price and check out right away. Some lots, such as packed pallets, are sold only as the full quantity.",
    "ادفع السعر المعروض وأتمّ الشراء فوراً. بعض المنتجات، مثل المنصات المغلقة، تُباع بالكمية الكاملة فقط.",
  ),
  liveText: copyNew(
    "A seller hosts the sale live: lots come up one after another and close in real time. Join the room to follow along and bid.",
    "يستضيف البائع المزاد مباشرة: تُعرض المنتجات واحداً تلو الآخر وتُغلق في الوقت الفعلي. ادخل غرفة المزاد لتتابع وتزايد.",
  ),
  stepNumber: copyNew("Step {n}", "الخطوة {n}"),

  // FAQ
  faqSearchLabel: copyNew("Search the questions", "ابحث في الأسئلة"),
  faqListTitle: copyNew("Questions and answers", "الأسئلة والأجوبة"),
  // New wording too (copy-new), in plural forms for each language.
  faqCount: {
    en: { one: "{n} question", other: "{n} questions" },
    ar: { zero: "لا توجد أسئلة", one: "سؤال واحد", two: "سؤالان", few: "{n} أسئلة", many: "{n} سؤالاً", other: "{n} سؤال" },
  },
  faqMatches: {
    en: { one: "{n} question matches “{q}”", other: "{n} questions match “{q}”" },
    ar: { zero: "لا توجد أسئلة تطابق «{q}»", one: "سؤال واحد يطابق «{q}»", two: "سؤالان يطابقان «{q}»", few: "{n} أسئلة تطابق «{q}»", many: "{n} سؤالاً يطابق «{q}»", other: "{n} سؤال يطابق «{q}»" },
  },

  // Contact
  requiredName: copyNew("Enter your full name.", "أدخل اسمك الكامل."),
  // Production's own wording (the footer newsletter's validation message).
  requiredEmail: { en: "Enter a valid email address.", ar: "أدخل بريداً إلكترونياً صحيحاً." },
  requiredSubject: copyNew("Enter a subject.", "أدخل الموضوع."),
  requiredMessage: copyNew("Write your message.", "اكتب رسالتك."),
  fixFields: copyNew("Check the highlighted fields.", "راجع الحقول المحددة."),
  notSentTitle: copyNew("Your message wasn't sent", "لم تُرسل رسالتك"),
  sampleTitle: copyNew("Sample contact details", "بيانات تواصل نموذجية"),
  sampleText: copyNew("The preview's support details are samples. On the live site this opens {target}.", "بيانات الدعم في المعاينة نموذجية. في الموقع الفعلي يفتح هذا {target}."),
  sampleMail: copyNew("your email app", "تطبيق البريد"),
  samplePhone: copyNew("your phone app", "تطبيق الهاتف"),
  sampleWhatsApp: copyNew("WhatsApp with your message ready", "واتساب مع رسالتك جاهزة"),

  // Privacy and Terms
  onThisPage: copyNew("On this page", "في هذه الصفحة"),
  print: copyNew("Print", "طباعة"),
  sections: copyNew("Sections", "الأقسام"),
};

export const NOT_FOUND_COPY = {
  kicker: copyNew("Error 404", "خطأ 404"),
  title: copyNew("We couldn’t find that page", "لم نعثر على هذه الصفحة"),
  text: copyNew("The link may be out of date, or the page may have moved.", "ربما أصبح الرابط قديماً، أو نُقلت الصفحة إلى مكان آخر."),
  address: copyNew("Address", "العنوان"),
  home: copyNew("Go to the homepage", "الانتقال إلى الصفحة الرئيسية"),
  // Production's own label (seller error boundary).
  browseAll: { en: "Browse all listings", ar: "تصفح جميع المنتجات" },
  popular: copyNew("Popular places to start", "أماكن شائعة للبدء"),
  help: copyNew("Need help? Contact us", "تحتاج إلى مساعدة؟ تواصل معنا"),
};

export const BOUNDARY_COPY = {
  // (main)/loading.js and auction/[slug]/loading.js: English-only labels in production.
  loading: arNew("Loading", "جارٍ التحميل"),
  loadingAuction: arNew("Loading auction", "جارٍ تحميل المزاد"),
  // A page that failed to render (production has no general boundary; this is the preview's).
  errorText: copyNew("This page didn’t load properly. Try again, or go back to the homepage.", "لم تُحمَّل هذه الصفحة كما يجب. حاول مرة أخرى أو عُد إلى الصفحة الرئيسية."),
  // auction/[slug]/error.js (English only in production).
  auctionKicker: arNew("Auction temporarily unavailable", "المزاد غير متاح مؤقتاً"),
  auctionTitle: arNew("We could not refresh this auction", "تعذّر تحديث هذا المزاد"),
  auctionText: arNew("Your account and bids are safe. Retry the live view or return to the marketplace.", "حسابك ومزايداتك في أمان. أعد تحميل العرض المباشر أو عُد إلى السوق."),
  auctionRetry: arNew("Retry auction", "إعادة تحميل المزاد"),
  auctionBrowse: arNew("Browse auctions", "تصفح المزادات"),
};

// /system: the reviewers' page of Option 3's shared parts and page states.
export const SYSTEM_COPY = {
  kicker: copyNew("Option 3 design system", "نظام تصميم الخيار 3"),
  title: copyNew("Components & states", "المكونات والحالات"),
  intro: copyNew(
    "The shared parts every Option 3 customer page is built from, and the states a page can be in. The look of each kind of state is shared; the words stay each page’s own.",
    "الأجزاء المشتركة التي تُبنى منها صفحات العملاء في الخيار 3، والحالات التي قد تمر بها الصفحة. مظهر كل نوع من الحالات مشترك، وتبقى الكلمات خاصة بكل صفحة.",
  ),
  contents: copyNew("On this page", "في هذه الصفحة"),
  buttons: copyNew("Buttons", "الأزرار"),
  buttonsNote: copyNew(
    "Pills throughout: gold for a page’s main step, indigo for the main action in a panel, outline and soft for the rest, red only to confirm a removal.",
    "أزرار بيضاوية في كل مكان: الذهبي للخطوة الرئيسية في الصفحة، والنيلي للإجراء الرئيسي في اللوحة، والمحدد والهادئ لبقية الإجراءات، والأحمر لتأكيد الحذف فقط.",
  ),
  disabled: copyNew("Unavailable", "غير متاح"),
  status: copyNew("Status and messages", "الحالات والرسائل"),
  statusNote: copyNew("Every status shows words and an icon, never colour alone.", "تظهر كل حالة بكلمات وأيقونة، لا باللون وحده."),
  toneSuccess: copyNew("Done", "تم"),
  toneWarning: copyNew("Needs attention", "يحتاج إلى انتباه"),
  toneDanger: copyNew("Problem", "مشكلة"),
  toneInfo: copyNew("For your information", "للعلم"),
  toneNeutral: copyNew("Neutral", "محايد"),
  forms: copyNew("Form fields", "حقول النماذج"),
  formsNote: copyNew(
    "Labels above, hints and errors below and read out with the field. Email, phone and code fields stay left-to-right in Arabic.",
    "التسميات أعلى الحقول، والتلميحات والأخطاء أسفلها وتُقرأ مع الحقل. تبقى حقول البريد والهاتف والرموز من اليسار إلى اليمين في العربية.",
  ),
  password: copyNew("Password", "كلمة المرور"),
  code: copyNew("Verification code", "رمز التحقق"),
  codeHint: copyNew("Six digits, sent to your email.", "ستة أرقام تصلك على بريدك الإلكتروني."),
  remember: copyNew("Remember this choice", "تذكّر هذا الاختيار"),
  cards: copyNew("Cards and summaries", "البطاقات والملخصات"),
  cardsNote: copyNew("White rounded cards for content, blue-grey tiles inside them, and price summaries with the total last.", "بطاقات بيضاء مستديرة للمحتوى، ومربعات زرقاء رمادية داخلها، وملخصات أسعار ينتهي كل منها بالإجمالي."),
  tile: copyNew("A tile inside a card", "مربع داخل بطاقة"),
  overlays: copyNew("Dialogs and side panels", "النوافذ واللوحات الجانبية"),
  overlaysNote: copyNew(
    "Dialogs keep focus inside, close with Escape and return focus to the button that opened them; on phones they rise from the bottom.",
    "تحتفظ النوافذ بالتركيز داخلها وتُغلق بمفتاح Escape وتعيد التركيز إلى الزر الذي فتحها، وتظهر من أسفل الشاشة في الهواتف.",
  ),
  openDialog: copyNew("Open a dialog", "افتح نافذة"),
  openPanel: copyNew("Open a side panel", "افتح لوحة جانبية"),
  panelTitle: copyNew("Side panel", "لوحة جانبية"),
  panelText: copyNew("Details such as an order open here: beside the page from 768 px, from the bottom on phones.", "تُفتح هنا تفاصيل مثل الطلب: بجانب الصفحة من عرض 768 بكسل، ومن أسفل الشاشة في الهواتف."),
  states: copyNew("Page states", "حالات الصفحة"),
  statesNote: copyNew(
    "One look for each kind of state, with the page’s own words, so different situations never read the same. Each example opens on its page.",
    "مظهر واحد لكل نوع من الحالات، بكلمات الصفحة نفسها، فلا تتشابه الحالات المختلفة. يُفتح كل مثال في صفحته.",
  ),
  stateLoading: copyNew("Loading", "التحميل"),
  stateNoResults: copyNew("No results", "لا نتائج"),
  stateEmpty: copyNew("Empty", "فارغ"),
  stateFailed: copyNew("Couldn’t load · retry", "تعذّر التحميل · إعادة المحاولة"),
  stateBlocked: copyNew("Can’t continue yet", "لا يمكن المتابعة بعد"),
  stateSignIn: copyNew("Sign-in needed", "يلزم تسجيل الدخول"),
  stateSendFailed: copyNew("Couldn’t send", "تعذّر الإرسال"),
  openOnPage: copyNew("Open on its page", "افتح في صفحته"),
  boundaries: copyNew("Loading, error and not-found pages", "صفحات التحميل والخطأ وعدم العثور"),
  boundariesNote: copyNew(
    "What a visitor sees while a page loads, when it fails and at an address that doesn’t exist; each keeps production’s retry and way out.",
    "ما يراه الزائر أثناء تحميل الصفحة، وعند تعطلها، وعند فتح عنوان غير موجود؛ وتحتفظ كل منها بإعادة المحاولة والمخرج كما في الموقع الفعلي.",
  ),
  pageLoading: copyNew("Page loading", "تحميل صفحة"),
  auctionLoading: copyNew("Auction loading", "تحميل مزاد"),
  pageError: copyNew("Page error", "خطأ في صفحة"),
  auctionError: copyNew("Auction error", "خطأ في مزاد"),
  sellerError: copyNew("Seller catalogue error", "خطأ في متجر البائع"),
  notFound: copyNew("Page not found", "الصفحة غير موجودة"),
  openReal: copyNew("Open the real page", "افتح الصفحة الفعلية"),
  index: copyNew("Every preview state", "كل حالات المعاينة"),
  indexNote: copyNew("The states in the presentation bar’s Preview state menu, page by page.", "الحالات الموجودة في قائمة «حالة المعاينة» في شريط العرض، صفحة بصفحة."),
};
