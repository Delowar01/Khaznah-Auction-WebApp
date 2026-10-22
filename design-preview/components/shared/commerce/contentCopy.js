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
