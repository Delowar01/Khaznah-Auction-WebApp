// Auction Detail wording shared by the four options (EN / AR). Each option
// decides how the page looks; the words stay the same so the pages compare
// like for like. Marketplace words that already exist (Current bid, Place
// bid, Bid history …) come from data/ui.js; the lines below reuse Option 1's
// existing auction copy where it had one.
export const AUCTION_COPY = {
  // Status and identity
  phaseLive: { en: "Open for bids", ar: "مفتوح للمزايدة" },
  auctionAndBuyNow: { en: "Auction + Buy Now", ar: "مزاد + شراء فوري" },
  fullPallet: { en: "Full pallet · {units}", ar: "طبلية كاملة · {units}" },
  carton: { en: "Carton · {units}", ar: "كرتونة · {units}" },
  lotDetails: { en: "Lot details", ar: "تفاصيل المنتج" },
  aboutLot: { en: "About this lot", ar: "عن هذا المنتج" },
  highlights: { en: "Highlights", ar: "أبرز المزايا" },
  deliveryReturns: { en: "Delivery & returns", ar: "التوصيل والإرجاع" },
  galleryLabel: { en: "Images of {title}", ar: "صور {title}" },
  openViewer: { en: "Open image {n} of {total} full size", ar: "افتح الصورة {n} من {total} بالحجم الكامل" },
  bidPanel: { en: "Bidding", ar: "المزايدة" },

  // Clock (spoken form; the visible clock is digits)
  timeLeftSpoken: { en: "{label}: {time}", ar: "{label}: {time}" },
  auctionProgress: { en: "Auction progress", ar: "تقدّم المزاد" },

  // Figures
  statsBids: { en: "Bids", ar: "المزايدات" },
  statsBidders: { en: "Bidders", ar: "المزايدون" },
  statsWatching: { en: "Watching", ar: "المتابعون" },

  // Bid form
  lowerBid: { en: "Lower your bid by {amount}", ar: "خفّض مزايدتك بمقدار {amount}" },
  raiseBid: { en: "Raise your bid by {amount}", ar: "ارفع مزايدتك بمقدار {amount}" },
  yourMaxIs: { en: "Your maximum: {amount}", ar: "حدّك الأقصى: {amount}" },
  bidSheetTitle: { en: "Place your bid", ar: "قدّم مزايدتك" },

  // Outcome
  boughtTitle: { en: "It's yours — the auction is closed", ar: "أصبح لك — تم إغلاق المزاد" },
  boughtText: { en: "Choose delivery or pickup at checkout to complete your purchase.", ar: "اختر التوصيل أو الاستلام عند الدفع لإتمام عملية الشراء." },
  boughtBanner: { en: "You bought this lot with Buy Now", ar: "اشتريت هذا المنتج بالشراء الفوري" },
  lostBanner: { en: "Auction closed — you were outbid", ar: "أُغلق المزاد — تمت المزايدة بأعلى منك" },
  winningBidder: { en: "Winning bidder", ar: "صاحب المزايدة الفائزة" },
  upcomingNote: {
    en: "Bidding opens when the countdown ends. Watch the lot to keep it in your watchlist.",
    ar: "تبدأ المزايدة عند انتهاء العد التنازلي. تابع المنتج ليبقى في قائمة متابعتك.",
  },

  // Bid history
  amount: { en: "Amount", ar: "المبلغ" },
  time: { en: "Time", ar: "الوقت" },
  showingRange: { en: "{from}–{to} of {total}", ar: "{from}–{to} من {total}" },

  // Terms
  termsDeposit: { en: "Refundable bidding deposit of {amount}, covered by your wallet.", ar: "تأمين مزايدة مسترد بقيمة {amount}، مغطّى من محفظتك." },
  termsPayment: { en: "Winning bidders pay within {hours} hours.", ar: "يدفع الفائز خلال {hours} ساعة من إغلاق المزاد." },
  termsIncrement: { en: "Minimum bid increment is {amount}.", ar: "الحد الأدنى للزيادة {amount}." },

  // Manifest
  line: { en: "Item", ar: "البند" },
  qty: { en: "Qty", ar: "الكمية" },
  lotTotal: { en: "Total", ar: "الإجمالي" },
  totalUnits: { en: "{units} across {lines}", ar: "{units} في {lines}" },

  // Grade guide
  gradeMatrixWorks: { en: "Works", ar: "يعمل" },
  gradeMatrixNotWorking: { en: "Not working", ar: "لا يعمل" },
  thisLot: { en: "This lot", ar: "هذا المنتج" },
};

// Spoken remaining time ("5 hours 40 minutes"). Arabic uses all six CLDR forms.
export const DURATION_FORMS = {
  days: {
    en: { one: "{n} day", other: "{n} days" },
    ar: { zero: "{n} يوم", one: "يوم واحد", two: "يومان", few: "{n} أيام", many: "{n} يوماً", other: "{n} يوم" },
  },
  hours: {
    en: { one: "{n} hour", other: "{n} hours" },
    ar: { zero: "{n} ساعة", one: "ساعة واحدة", two: "ساعتان", few: "{n} ساعات", many: "{n} ساعة", other: "{n} ساعة" },
  },
  minutes: {
    en: { one: "{n} minute", other: "{n} minutes" },
    ar: { zero: "{n} دقيقة", one: "دقيقة واحدة", two: "دقيقتان", few: "{n} دقائق", many: "{n} دقيقة", other: "{n} دقيقة" },
  },
  seconds: {
    en: { one: "{n} second", other: "{n} seconds" },
    ar: { zero: "{n} ثانية", one: "ثانية واحدة", two: "ثانيتان", few: "{n} ثوانٍ", many: "{n} ثانية", other: "{n} ثانية" },
  },
};
