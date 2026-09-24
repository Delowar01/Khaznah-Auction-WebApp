// The four design directions presented to the client.

export const CONCEPTS = [
  {
    id: "a",
    letter: "A",
    name: { en: "Premium Marketplace", ar: "السوق الفاخر" },
    oneLiner: {
      en: "A modern auction house: editorial, calm and quietly confident.",
      ar: "دار مزادات عصرية: تحريرية الطابع، هادئة وواثقة.",
    },
    philosophy: {
      en: "Treat every lot like a catalogue entry. Generous space, strong serif typography and museum-style lot placards give graded surplus the presentation of high-value inventory — so buyers bid with confidence.",
      ar: "تعامل مع كل منتج كأنه مدخل في كتالوج. المساحات الواسعة والخط الكلاسيكي الأنيق وبطاقات المنتجات بأسلوب المتاحف تمنح المخزون المصنّف حضور البضائع الثمينة — فيزايد المشتري بثقة.",
    },
    traits: [
      { en: "Editorial serif headlines, refined sans for data", ar: "عناوين بخط كلاسيكي تحريري وخط حديث للبيانات" },
      { en: "Warm ivory paper, ink navy and antique brass", ar: "ورق عاجي دافئ مع كحلي الحبر والنحاسي العتيق" },
      { en: "Lot placards, catalogue-style auction cards", ar: "بطاقات منتجات بأسلوب كتالوجات المزادات" },
      { en: "Low density, high trust, slow and precise motion", ar: "كثافة منخفضة وثقة عالية وحركة هادئة ودقيقة" },
    ],
    type: { en: "Instrument Serif · Instrument Sans · Markazi · IBM Plex Arabic", ar: "Instrument Serif · Instrument Sans · مركزي · IBM Plex العربي" },
    swatches: ["#F6F2EA", "#16192A", "#2B377A", "#B08A3E"],
    defaultTheme: "light",
  },
  {
    id: "b",
    letter: "B",
    name: { en: "Modern Commerce", ar: "التجارة الحديثة" },
    oneLiner: {
      en: "A fast, content-rich marketplace built for discovery and conversion.",
      ar: "سوق سريع وغني بالمحتوى، مصمم للاكتشاف وإتمام الشراء.",
    },
    philosophy: {
      en: "Search first, then filter, then decide. A clear retail grid, visible facets, deal signals and one-tap bidding make a large, mixed inventory feel organised — the way serious buyers expect a modern marketplace to work.",
      ar: "ابحث أولاً، ثم صفِّ النتائج، ثم قرر. شبكة واضحة وعوامل تصفية ظاهرة وإشارات للعروض ومزايدة بلمسة واحدة تجعل المخزون الكبير والمتنوع منظّماً — كما يتوقع المشتري الجاد من سوق حديث.",
    },
    traits: [
      { en: "Dominant search with scoped categories", ar: "بحث بارز مع تحديد الفئة" },
      { en: "Dense, scannable product grid and facets", ar: "شبكة منتجات كثيفة سهلة المسح مع عوامل تصفية" },
      { en: "Brand indigo for action, gold for value", ar: "النيلي للإجراءات والذهبي للقيمة" },
      { en: "Mobile bottom navigation and sticky actions", ar: "تنقل سفلي على الجوال وأزرار ثابتة" },
    ],
    type: { en: "Figtree · Almarai", ar: "Figtree · المراعي" },
    swatches: ["#F4F5F7", "#101828", "#3D4D9B", "#D8A535"],
    defaultTheme: "light",
  },
  {
    id: "c",
    letter: "C",
    name: { en: "Saudi Contemporary", ar: "سعودي معاصر" },
    oneLiner: {
      en: "A confident, Arabic-first identity with modern Riyadh restraint.",
      ar: "هوية واثقة تبدأ بالعربية، بهدوء الرياض الحديثة.",
    },
    philosophy: {
      en: "Designed from right to left, then mirrored with care. Architectural grids, warm limestone neutrals and the diamond from the خ mark create a local character that feels contemporary rather than decorative.",
      ar: "صُمّم من اليمين إلى اليسار أولاً، ثم عُكس بعناية. شبكات معمارية ودرجات حجرية دافئة والمعيّن المستوحى من حرف الخاء في الشعار تصنع طابعاً محلياً معاصراً بعيداً عن الزخرفة.",
    },
    traits: [
      { en: "Arabic-first typography in the brand typefaces", ar: "طباعة عربية أولاً بخطوط الهوية" },
      { en: "Limestone, night indigo and saffron gold", ar: "حجر جيري ونيلي ليلي وذهبي زعفراني" },
      { en: "Diamond and diagonal motifs from the logo", ar: "المعيّن والقطري المستوحيان من الشعار" },
      { en: "Bilingual compositions and Hijri dates", ar: "تكوينات ثنائية اللغة وتواريخ هجرية" },
    ],
    type: { en: "Alexandria · Archivo (brand typefaces)", ar: "الإسكندرية · Archivo (خطوط الهوية)" },
    swatches: ["#F3EEE6", "#1B2150", "#3D4D9B", "#D8A535"],
    defaultTheme: "light",
  },
  {
    id: "d",
    letter: "D",
    name: { en: "Digital / Auction Marketplace", ar: "سوق المزادات الرقمي" },
    oneLiner: {
      en: "A real-time auction platform: live data, layered surfaces, precise motion.",
      ar: "منصة مزادات لحظية: بيانات مباشرة وطبقات متداخلة وحركة دقيقة.",
    },
    philosophy: {
      en: "Auctions are time and movement. Live price charts, countdown rings, bid velocity and an activity feed put buyers on the auction floor — with the calm, credible finish of a premium technology product.",
      ar: "المزاد وقت وحركة. رسوم بيانية حية للأسعار وحلقات عدّ تنازلي وسرعة المزايدات وسجل نشاط مباشر تضع المشتري في قلب المزاد — بلمسة هادئة وموثوقة لمنتج تقني راقٍ.",
    },
    traits: [
      { en: "Dark-first layered surfaces with indigo depth", ar: "طبقات داكنة أولاً بعمق نيلي" },
      { en: "Live charts, rings, tickers and bid feeds", ar: "رسوم حية وحلقات وشريط أسعار وسجل مزايدات" },
      { en: "Monospaced figures for prices and time", ar: "أرقام بعرض ثابت للأسعار والوقت" },
      { en: "Board view for ending-soon lots", ar: "عرض لوحي للمزادات القريبة من الإغلاق" },
    ],
    type: { en: "Geist · Geist Mono · Readex Pro", ar: "Geist · Geist Mono · ريدكس برو" },
    swatches: ["#080C1A", "#141A30", "#5B6CE0", "#E0B04A"],
    defaultTheme: "dark",
  },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
